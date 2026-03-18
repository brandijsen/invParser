import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AccountDeleted = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const hasError = searchParams.get("error") === "invalid";

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="pt-24 pb-24 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        {hasError ? (
          <>
            <FiAlertCircle className="mx-auto text-5xl text-amber-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid or expired link</h1>
            <p className="text-slate-600 text-sm mb-6">
              The confirmation link is invalid or has expired (24 hours).{" "}
              <Link to="/profile" className="text-emerald-600 hover:underline font-medium">
                Go to profile
              </Link>{" "}
              to request a new link.
            </p>
          </>
        ) : (
          <>
            <FiCheckCircle className="mx-auto text-5xl text-emerald-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Account deleted</h1>
            <p className="text-slate-600 text-sm mb-6">
              Your account and all associated data have been permanently deleted.
            </p>
          </>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default AccountDeleted;
