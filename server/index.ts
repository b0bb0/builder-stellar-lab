import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Import database and services
import { initializeDatabase } from "./config/database";
import { wsService } from "./services/websocket";

// Import route handlers
import { handleDemo } from "./routes/demo";
import { startScan, getScanStatus } from "./routes/scanner";
import { getAIAnalysis } from "./routes/ai-analysis";
import {
  startEnhancedScan,
  getEnhancedScanStatus,
  stopScan,
  getScanLogs,
  getActiveScans,
  getRecentScans,
  getScannerHealth,
} from "./routes/enhanced-scanner";

export function createExpressServer() {
  const app = express();

  // Trust proxy for rate limiting and IP detection
  app.set("trust proxy", 1);

  // Middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
      );
    });
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
    });
  });

  // Legacy API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "LUMINOUS FLOW Scanner API v2.0" });
  });

  app.get("/api/demo", handleDemo);

  // Legacy scanner routes (for backward compatibility)
  app.post("/api/scanner/start", startScan);
  app.get("/api/scanner/status/:scanId", getScanStatus);
  app.get("/api/ai-analysis/:scanId", getAIAnalysis);

  // Enhanced scanner routes with full backend integration
  app.post("/api/v2/scanner/start", startEnhancedScan);
  app.get("/api/v2/scanner/status/:scanId", getEnhancedScanStatus);
  app.post("/api/v2/scanner/stop/:scanId", stopScan);
  app.get("/api/v2/scanner/logs/:scanId", getScanLogs);
  app.get("/api/v2/scanner/active", getActiveScans);
  app.get("/api/v2/scanner/recent", getRecentScans);
  app.get("/api/v2/scanner/health", getScannerHealth);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Unhandled error:", err);
      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      });
    },
  );

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Not found",
      path: req.originalUrl,
    });
  });

  return app;
}

export function createHttpServer() {
  // Initialize database
  console.log("Initializing database...");
  try {
    initializeDatabase();
  } catch (error) {
    console.error("Database initialization failed, using mock data:", error);
  }

  // Create Express app
  const app = createExpressServer();

  // Create HTTP server
  const server = createServer(app);

  // Initialize WebSocket service
  console.log("Initializing WebSocket service...");
  wsService.initialize(server);

  // Graceful shutdown handling
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    wsService.shutdown();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully...");
    wsService.shutdown();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return server;
}
