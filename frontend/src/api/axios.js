import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // 🔑 required for refresh token cookie
});

const isBackendDownError = (err) => {
  if (!err) return false;
  if (!err.response) {
    const code = err.code;
    return (
      code === "ERR_NETWORK" ||
      code === "ECONNABORTED" ||
      code === "ETIMEDOUT" ||
      code === "ERR_CONNECTION_REFUSED"
    );
  }
  const status = err.response?.status;
  return status === 502 || status === 503 || status === 504;
};

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Always adds the access token (if present)
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !config._retry) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| On backend down → emit event for ServiceUnavailable overlay
| On 401 → attempt refresh token ONCE
*/
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Backend unreachable → show Service Unavailable
    if (isBackendDownError(error)) {
      window.dispatchEvent(new CustomEvent("backend-down"));
      return Promise.reject(error);
    }

    // ❌ Not 401 → normal error
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ❌ Avoid infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // ❌ Do not retry refresh on refresh endpoint
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 🔄 REFRESH TOKEN (cookie only)
      const res = await api.post("/auth/refresh");

      const newAccessToken = res.data.accessToken;

      // 💾 save new token
      localStorage.setItem("accessToken", newAccessToken);

      // 🔁 retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      // ❌ refresh failed → force logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(refreshError);
    }
  }
);

export default api;
