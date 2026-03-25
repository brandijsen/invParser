import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { setUser } from "../store/authSlice";
import PageLoadingShell from "../components/PageLoadingShell";

function isVerifiedUser(user) {
  if (!user) return false;
  const v = user.verified;
  return v === 1 || v === true || v === "1" || Number(v) === 1;
}

const VerifySuccess = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const alreadyVerified = isVerifiedUser(user);
  /** Skip blocking loader when Redux was updated on /verify-email (same SPA navigation) */
  const [loading, setLoading] = useState(() => !alreadyVerified);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const finishLogin = async () => {
      try {
        const res = await api.get("/auth/me");
        if (!cancelled) dispatch(setUser(res.data));
      } catch (err) {
        console.error("Verification session error:", err);
        if (!cancelled && !alreadyVerified) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    finishLogin();
    return () => {
      cancelled = true;
    };
  }, [dispatch, alreadyVerified]);

  if (loading) {
    return <PageLoadingShell message="Verifying your account…" />;
  }

  if (failed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 pt-24">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-red-600 font-medium">Could not start your session.</p>
          <p className="text-sm text-slate-600 mt-2">Try signing in from the home page.</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] pt-16 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600">
          Email verified successfully!
        </h1>

        <p className="mt-4 text-gray-700">
          Your account is now fully active.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default VerifySuccess;
