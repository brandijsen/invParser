import crypto from "crypto";
import fs from "fs";
import { User } from "../../models/user.model.js";
import { pool } from "../../config/db.js";
import { getUploadDir, getFilePath } from "../../config/upload.js";
import { sendDeleteAccountEmail } from "../../services/email.service.js";
import { logAuth, logError } from "../../utils/logger.js";
import { getRequestLogger } from "../../middlewares/logger.middleware.js";
import { clearAuthCookies } from "../../utils/authCookies.js";

async function performAccountDeletion(userId, log) {
  const uploadsDir = getUploadDir(userId);
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      try {
        fs.unlinkSync(getFilePath(userId, file));
      } catch (e) {
        log?.warn("Could not delete file", { file, error: e.message });
      }
    }
    try {
      fs.rmdirSync(uploadsDir);
    } catch (e) {
      log?.warn("Could not remove uploads dir", { error: e.message });
    }
  }
  await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
}

export const requestDeleteAccount = async (req, res) => {
  const log = getRequestLogger(req);
  try {
    const user = req.user;
    const token = crypto.randomBytes(32).toString("hex");

    await User.setDeleteToken(user.id, token);

    const confirmLink = `${process.env.BASE_URL}/api/auth/confirm-delete/${token}`;
    await sendDeleteAccountEmail(user.email, user.name, confirmLink);

    logAuth("delete_account_requested", { userId: user.id, email: user.email });

    return res.json({
      message:
        "We sent you an email with a link to confirm deletion. The link expires in 24 hours.",
    });
  } catch (err) {
    logError(err, { operation: "requestDeleteAccount", userId: req.user?.id });
    return res.status(500).json({ message: err.message });
  }
};

export const confirmDeleteAccount = async (req, res) => {
  const log = getRequestLogger(req);
  const successUrl = `${process.env.FRONTEND_URL}/account-deleted`;
  const errorUrl = `${process.env.FRONTEND_URL}/account-deleted?error=invalid`;

  try {
    const { token } = req.params;
    const user = await User.findByDeleteToken(token);

    if (!user) {
      logAuth("delete_account_failed", { reason: "invalid_or_expired_token" });
      return res.redirect(errorUrl);
    }

    await performAccountDeletion(user.id, log);

    logAuth("account_deleted", { userId: user.id, email: user.email });

    clearAuthCookies(res);

    return res.redirect(successUrl);
  } catch (err) {
    logError(err, { operation: "confirmDeleteAccount" });
    return res.redirect(errorUrl);
  }
};
