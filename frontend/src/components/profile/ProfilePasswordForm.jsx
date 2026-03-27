import { FiLock } from "react-icons/fi";

export default function ProfilePasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  passwordLoading,
  passwordError,
  passwordSuccess,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FiLock className="text-slate-500" />
        Change password
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
        {passwordSuccess && (
          <p className="text-emerald-600 text-sm">Password updated successfully.</p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={onCurrentPasswordChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New password (min 8 chars, 1 upper, 1 lower, 1 number)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={onNewPasswordChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={passwordLoading}
          className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {passwordLoading ? "Updating…" : "Update password"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-3">
        If you signed up with Google and want to set a password, use the Forgot password flow.
      </p>
    </div>
  );
}
