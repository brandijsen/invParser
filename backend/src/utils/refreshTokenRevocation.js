import crypto from "crypto";
import { redisConnection } from "../config/redis.js";
import logger from "./logger.js";

const PREFIX = "auth:rt_revoked:";

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken, "utf8").digest("hex");
}

/**
 * Marks a refresh JWT as revoked until it would have expired (logout / stolen token).
 * Best-effort: failures are logged; caller still clears cookies.
 */
export async function revokeRefreshToken(rawToken, ttlSeconds) {
  if (!rawToken || ttlSeconds < 1) return;
  try {
    await redisConnection.set(`${PREFIX}${hashToken(rawToken)}`, "1", "EX", ttlSeconds);
  } catch (err) {
    logger.warn("Refresh token revocation skipped (Redis)", { error: err.message });
  }
}

/**
 * @returns {Promise<boolean>} true if token was revoked via logout
 */
export async function isRefreshTokenRevoked(rawToken) {
  if (!rawToken) return true;
  try {
    const v = await redisConnection.get(`${PREFIX}${hashToken(rawToken)}`);
    return v === "1";
  } catch (err) {
    logger.warn("Refresh revocation check failed (Redis); allowing refresh", {
      error: err.message,
    });
    return false;
  }
}
