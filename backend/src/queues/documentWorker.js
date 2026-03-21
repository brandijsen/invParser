import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { processDocumentJob } from "./documentProcessing.job.js";
import logger from "../utils/logger.js";

logger.info("Document worker started");

const worker = new Worker("document-processing", (job) => processDocumentJob(job), {
  connection: redisConnection,
});

worker.on("error", (err) => {
  logger.warn("DocumentWorker error", { error: err.message });
});
