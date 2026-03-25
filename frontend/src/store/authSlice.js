import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────
// ASYNC THUNKS
// ───────────────────────────────────────────────

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Login failed"
      );
    }
  }
);

// SEND VERIFICATION EMAIL
export const sendVerificationEmail = createAsyncThunk(
  "auth/sendVerificationEmail",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/auth/send-verification");
      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Could not send verification email"
      );
    }
  }
);

// ───────────────────────────────────────────────
// SLICE
// ───────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: readStoredUser(),
    /** false until first GET /auth/me (PersistLogin) or explicit sync — avoids stale localStorage user in UI */
    sessionResolved: false,
    loading: false,
    error: null,
    emailSent: false,
    resetSuccess: false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.emailSent = false;
      state.resetSuccess = false;
      state.sessionResolved = true;

      localStorage.removeItem("user");
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setSessionResolved: (state, action) => {
      state.sessionResolved = Boolean(action.payload);
    },

    resetPasswordSuccess: (state) => {
      state.resetSuccess = true;
    },

    clearResetSuccess: (state) => {
      state.resetSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.sessionResolved = true;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SEND VERIFICATION EMAIL
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.emailSent = true;
      });
  },
});

export const {
  logout,
  setUser,
  setSessionResolved,
  resetPasswordSuccess,
  clearResetSuccess,
} = authSlice.actions;

export default authSlice.reducer;
