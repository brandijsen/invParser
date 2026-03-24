import { useDispatch, useSelector } from "react-redux";
import { sendVerificationEmail } from "../store/authSlice";
import { useEffect, useState } from "react";
import { FiMail, FiCheckCircle } from "react-icons/fi";

const VerificationBanner = () => {
  const dispatch = useDispatch();
  const { user, emailSent } = useSelector((state) => state.auth);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (emailSent) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [emailSent]);

  if (!user || user.verified === 1 || !visible) return null;

  return (
    <div
      role="status"
      className="fixed top-14 sm:top-16 left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pt-2 sm:pt-3 pointer-events-none"
    >
      <div
        className={`pointer-events-auto flex w-full max-w-2xl flex-col gap-3 rounded-xl border px-4 py-3 shadow-md shadow-slate-900/6 sm:flex-row sm:items-center sm:justify-between ${
          emailSent
            ? "border-emerald-200 bg-emerald-50/90"
            : "border-slate-200 bg-white"
        }`}
      >
        {!emailSent ? (
          <>
            <div className="flex items-start gap-3 text-left min-w-0">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                aria-hidden
              >
                <FiMail className="h-5 w-5" />
              </span>
              <p className="text-sm leading-snug text-slate-700 pt-1">
                <span className="font-semibold text-slate-900">
                  Your email is not verified.
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(sendVerificationEmail())}
              className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:self-center"
            >
              Verify now
            </button>
          </>
        ) : (
          <div className="flex w-full items-center justify-center gap-2.5 text-emerald-900 sm:justify-start">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            <span className="text-sm font-semibold">Verification email sent</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationBanner;
