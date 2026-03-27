import { FiMail, FiCheckCircle } from "react-icons/fi";

export default function ProfileEmailVerificationCard({
  emailSent,
  verifyLoading,
  verifyError,
  onSendVerification,
}) {
  return (
    <div
      className={`mb-6 rounded-xl border shadow-sm shadow-slate-900/5 p-4 sm:p-5 ${
        emailSent ? "border-emerald-200 bg-emerald-50/90" : "border-slate-200 bg-white"
      }`}
      role="region"
      aria-label="Email verification"
    >
      {!emailSent ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-500"
              aria-hidden
            >
              <FiMail className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 pt-0.5 sm:pt-0">
              <p className="text-sm font-semibold text-slate-900">Your email is not verified.</p>
              <p className="text-sm text-slate-600 mt-1 leading-snug">
                If you closed the reminder at the top of the page, you can still request a
                verification link here.
              </p>
              {verifyError && <p className="text-red-600 text-sm mt-2">{verifyError}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onSendVerification}
            disabled={verifyLoading}
            className="shrink-0 w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {verifyLoading ? "Sending…" : "Verify now"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 text-emerald-900">
          <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
          <span className="text-sm font-semibold">Verification email sent. Check your inbox.</span>
        </div>
      )}
    </div>
  );
}
