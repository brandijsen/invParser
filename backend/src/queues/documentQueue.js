import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";
import logger from "../utils/logger.js";

export const documentQueue = new Queue("document-processing", {
  connection: redisConnection,
});

documentQueue.on("error", (err) => {
  logger.warn("DocumentQueue error", { error: err.message });
});
