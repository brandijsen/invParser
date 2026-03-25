import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import PageLoader from "../components/PageLoader";
import { setUser, setSessionResolved } from "../store/authSlice";

/**
 * Opens from email: /verify-email#token=... (fragment not sent to servers on navigation).
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash || "";
    let token = "";
    if (hash.startsWith("#token=")) {
      try {
        token = decodeURIComponent(hash.slice(7));
      } catch {
        token = "";
      }
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (!token) {
      const q = new URLSearchParams(window.location.search);
      token = q.get("token") || "";
    }

    if (!token) {
      setInvalid(true);
      dispatch(setSessionResolved(true));
      return;
    }

    (async () => {
      try {
        const { data } = await api.post("/auth/verify-email", { token });
        if (data?.user) {
          dispatch(setUser(data.user));
        }
        dispatch(setSessionResolved(true));
        navigate("/verify/success", { replace: true });
      } catch {
        navigate("/verify/error", { replace: true });
      }
    })();
  }, [navigate, dispatch]);

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-red-600 text-center">Invalid verification link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <PageLoader message="Verifying your email…" />
    </div>
  );
};

export default VerifyEmail;
