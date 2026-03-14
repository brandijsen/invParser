
import IORedis from "ioredis";
import logger from "../utils/logger.js";

const redisOptions = {
  maxRetriesPerRequest: null,
  family: 0, // dual-stack: Railway private network uses IPv6
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 500, 10000),
};

export const redisConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, redisOptions)
  : new IORedis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      ...redisOptions,
    });

// Must attach error listener — otherwise Node.js throws on ECONNREFUSED
redisConnection.on("error", (err) => {
  logger.warn("Redis connection error (will retry)", { error: err.message });
});

redisConnection.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisConnection.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});