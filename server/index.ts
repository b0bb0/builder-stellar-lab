import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { startScan, getScanStatus } from "./routes/scanner";
import { getAIAnalysis } from "./routes/ai-analysis";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Vulnerability Scanner routes
  app.post("/api/scanner/start", startScan);
  app.get("/api/scanner/status/:scanId", getScanStatus);

  // AI Analysis routes
  app.get("/api/ai-analysis/:scanId", getAIAnalysis);

  return app;
}
