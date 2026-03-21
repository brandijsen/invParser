import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import { logAuth, logError } from "../../utils/logger.js";
import { getRequestLogger } from "../../middlewares/logger.middleware.js";
import { validatePassword } from "../../utils/passwordValidator.js";
import { setRefreshCookie, setAccessCookie } from "../../utils/authCookies.js";
import { createAccessToken, createRefreshToken, toSafeUser } from "./auth.shared.js";

export const register = async (req, res) => {
  const log = getRequestLogger(req);

  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ message: pwCheck.message });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const exists = await User.findByEmail(trimmedEmail);
    if (exists) {
      log.warn("Registration attempted with existing email", { email });
      return res.status(400).json({ message: "Email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password: hashed,
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    setRefreshCookie(res, refreshToken);
    setAccessCookie(res, accessToken);

    logAuth("user_registered", { userId: user.id, email: user.email });

    return res.json({
      user: toSafeUser({ ...user, verified: 0 }),
    });
  } catch (err) {
    logError(err, { operation: "register", email: req.body?.email });
    return res.status(500).json({ message: err.message });
  }
};
