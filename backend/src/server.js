import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import emailRoutes from "./routes/email.routes.js";
import "./config/redis.js";
import { documentQueue } from "./queues/documentQueue.js";
import "./queues/documentWorker.js";
import { syncDueDatesForAllDocuments } from "./services/dueDateTags.service.js";
import cookieParser from "cookie-parser";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { validateEnvOrExit } from "./utils/envValidator.js";
import logger from "./utils/logger.js";
import { requestLogger, errorHandler } from "./middlewares/logger.middleware.js";

dotenv.config();

// Safety net: prevent unhandled errors from crashing the server
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { error: err.message, stack: err.stack });
});
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", {
    error: reason instanceof Error ? reason.message : String(reason),
  });
});

// 🔍 Validate environment variables BEFORE starting the server
validateEnvOrExit();

const app = express();

// Trust Railway/cloud reverse proxy so rate limiting uses real client IPs
app.set("trust proxy", 1);

app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// 📊 Request Logging (first to track every request)
app.use(requestLogger);

// 🛡️ Global Rate Limiting (skipped in development to avoid 429 during tests)
if (process.env.NODE_ENV === "production") {
  app.use(globalRateLimiter);
}

// Test DB
pool.execute("SELECT 1")
  .then(() => logger.info("MySQL connected successfully"))
  .catch(err => {
    logger.error("MySQL connection failed", { 
      error: err.message, 
      stack: err.stack 
    });
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/email", emailRoutes);

// ❌ Centralized Error Handler (MUST be AFTER all routes)
app.use(errorHandler);

// 🏷️ Periodic due-date tags sync (hourly) – updates 30/20/10/3/2/1/overdue
setInterval(async () => {
  try {
    const { updated } = await syncDueDatesForAllDocuments();
    if (updated > 0) {
      logger.info("Due-date tags synced", { documentsUpdated: updated });
    }
  } catch (err) {
    logger.error("Due-date tags sync failed", {
      error: err?.message,
      stack: err?.stack
    });
  }
}, 60 * 60 * 1000);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  logger.info("Server started", {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    features: {
      rateLimiting: true,
      requestLogging: true,
      errorHandling: true
    }
  });
  // Sync due-date tags on startup (fixes tags after restart)
  try {
    const { updated } = await syncDueDatesForAllDocuments();
    if (updated > 0) {
      logger.info("Due-date tags synced at startup", { documentsUpdated: updated });
    }
  } catch (err) {
    logger.warn("Startup due-date sync failed", { error: err?.message });
  }
});
