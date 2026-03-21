/**
 * Auth HTTP handlers — re-exported from focused modules under ./auth/
 * so routes keep importing from auth.controller.js unchanged.
 */
export { register } from "./auth/auth.register.js";
export { login, refresh, logout, me } from "./auth/auth.session.js";
export {
  updateProfile,
  changePassword,
  exportData,
  uploadAvatar,
  getAvatar,
} from "./auth/auth.profile.js";
export { requestDeleteAccount, confirmDeleteAccount } from "./auth/auth.account-delete.js";
export {
  sendVerificationEmail,
  verify,
  verifyEmailFromBody,
} from "./auth/auth.verify-email.js";
export { googleAuth, googleCallback } from "./auth/auth.google.js";
export { forgotPassword, resetPassword } from "./auth/auth.password-reset.js";
