import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import PageLoadingShell from "../components/PageLoadingShell";
import { setUser, setSessionResolved } from "../store/authSlice";

/** One POST per token (avoids double verify under React Strict Mode). */
const verifyInflight = new Map();
function postVerifyEmailOnce(token) {
  let p = verifyInflight.get(token);
  if (!p) {
    p = api.post("/auth/verify-email", { token }).finally(() => {
      verifyInflight.delete(token);
    });
    verifyInflight.set(token, p);
  }
  return p;
}

/**
 * Opens from email: /verify-email#token=... (fragment not sent to servers on navigation).
 * Do not strip the hash with replaceState until after success — otherwise a second effect
 * run sees an empty token and flashes "Invalid verification link."
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [invalid, setInvalid] = useState(false);
  const effectGeneration = useRef(0);

  useEffect(() => {
    const hash = window.location.hash || "";
    let token = "";
    if (hash.startsWith("#token=")) {
      try {
        token = decodeURIComponent(hash.slice(7));
      } catch {
        token = "";
      }
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

    const gen = ++effectGeneration.current;
    (async () => {
      try {
        const { data } = await postVerifyEmailOnce(token);
        if (gen !== effectGeneration.current) return;
        if (window.location.hash.startsWith("#token=")) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }
        if (data?.user) {
          dispatch(setUser(data.user));
        }
        dispatch(setSessionResolved(true));
        navigate("/verify/success", { replace: true });
      } catch {
        if (gen !== effectGeneration.current) return;
        navigate("/verify/error", { replace: true });
      }
    })();
  }, [navigate, dispatch]);

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 pt-24">
        <p className="text-red-600 text-center">Invalid verification link.</p>
      </div>
    );
  }

  return <PageLoadingShell message="Verifying your email…" />;
};

export default VerifyEmail;
