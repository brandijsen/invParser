import { pool } from "../config/db.js";
import { redisConnection } from "../config/redis.js";

/**
 * GET /api/health — liveness + dependency checks for ops / load balancers.
 * No auth. Does not call OpenAI.
 */
export async function getHealth(req, res) {
  const payload = {
    ok: true,
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    await pool.execute("SELECT 1");
    payload.checks.mysql = "up";
  } catch (err) {
    payload.checks.mysql = "down";
    payload.checks.mysql_error = err?.message || "error";
    payload.ok = false;
  }

  try {
    const pong = await redisConnection.ping();
    payload.checks.redis = pong === "PONG" ? "up" : "degraded";
  } catch (err) {
    payload.checks.redis = "down";
    payload.checks.redis_error = err?.message || "error";
    payload.ok = false;
  }

  res.status(payload.ok ? 200 : 503).json(payload);
}
