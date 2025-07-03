import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  ScanOptions,
  ScanResponse,
  ScanResult,
  AIAnalysis,
  Vulnerability,
} from "@shared/api";

// Simple in-memory storage for development
const mockScans = new Map<string, any>();
const mockVulnerabilities = new Map<string, Vulnerability[]>();

export function createDevServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: "development",
      timestamp: new Date().toISOString(),
    });
  });

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "LUMINOUS FLOW Scanner API v2.0 (Dev Mode)" });
  });

  // Mock scanner routes
  app.post("/api/scanner/start", (req, res) => {
    try {
      const options = req.body as ScanOptions;
      const scanId = uuidv4();

      // Store mock scan
      mockScans.set(scanId, {
        id: scanId,
        target: options.target,
        status: "pending",
        startTime: new Date().toISOString(),
      });

      const response: ScanResponse = {
        scanId,
        status: "started",
        message: "Mock vulnerability scan initiated",
      };

      res.status(202).json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.get("/api/scanner/status/:scanId", (req, res) => {
    const { scanId } = req.params;
    const scan = mockScans.get(scanId);

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    // Generate mock vulnerabilities
    const vulnerabilities = generateMockVulnerabilities(scan.target.url);

    const result: ScanResult = {
      id: scanId,
      target: scan.target,
      status: "completed",
      vulnerabilities,
      stats: {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter((v) => v.severity === "critical")
          .length,
        high: vulnerabilities.filter((v) => v.severity === "high").length,
        medium: vulnerabilities.filter((v) => v.severity === "medium").length,
        low: vulnerabilities.filter((v) => v.severity === "low").length,
        info: vulnerabilities.filter((v) => v.severity === "info").length,
      },
      startTime: scan.startTime,
      endTime: new Date().toISOString(),
      duration: 120,
    };

    res.json({ scan: result });
  });

  app.get("/api/ai-analysis/:scanId", (req, res) => {
    const { scanId } = req.params;
    const scan = mockScans.get(scanId);

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    const analysis: AIAnalysis = {
      summary:
        "Mock AI analysis for development testing. The target application shows several security vulnerabilities that require attention.",
      riskScore: 75,
      recommendations: [
        "Implement input validation and parameterized queries",
        "Enable proper authentication mechanisms",
        "Update third-party dependencies",
        "Implement security headers",
        "Add rate limiting protection",
      ],
      prioritizedVulns: generateMockVulnerabilities(scan.target.url).slice(
        0,
        5,
      ),
      riskFactors: [
        "Multiple high-severity vulnerabilities detected",
        "Outdated software components identified",
        "Insufficient access controls observed",
      ],
      estimatedFixTime: "2-3 weeks",
    };

    res.json(analysis);
  });

  // Enhanced API routes (v2)
  app.post("/api/v2/scanner/start", (req, res) => {
    // Same as v1 for now
    app.handle(req, res);
  });

  app.get("/api/v2/scanner/health", (_req, res) => {
    res.json({
      status: "healthy",
      mode: "development",
      activeScans: 0,
      maxConcurrent: 5,
      availableSlots: 5,
      nucleiAvailable: false,
      aiEnabled: false,
      websocketConnections: 0,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.originalUrl,
      mode: "development",
    });
  });

  return app;
}

function generateMockVulnerabilities(targetUrl: string): Vulnerability[] {
  return [
    {
      id: uuidv4(),
      title: "SQL Injection in Login Form",
      description:
        "The login form is vulnerable to SQL injection attacks through the username parameter.",
      severity: "critical",
      cvss: 9.8,
      cve: "CVE-2023-12345",
      url: `${targetUrl}/login.php`,
      method: "POST",
      evidence: "' OR '1'='1' -- -",
      tags: ["injection", "sql", "authentication"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Cross-Site Scripting (XSS)",
      description: "Reflected XSS vulnerability found in search parameter.",
      severity: "high",
      cvss: 7.2,
      cve: "CVE-2023-12346",
      url: `${targetUrl}/search.php?q=<script>alert(1)</script>`,
      method: "GET",
      evidence: "<script>alert(1)</script>",
      tags: ["xss", "injection", "client-side"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Directory Traversal",
      description: "Application is vulnerable to directory traversal attacks.",
      severity: "high",
      cvss: 8.1,
      url: `${targetUrl}/download.php?file=../../../etc/passwd`,
      method: "GET",
      evidence: "root:x:0:0:root:/root:/bin/bash",
      tags: ["traversal", "file-access"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Missing Security Headers",
      description:
        "Application is missing important security headers like X-Frame-Options and CSP.",
      severity: "medium",
      cvss: 5.3,
      url: targetUrl,
      method: "GET",
      evidence: "Missing: X-Frame-Options, CSP, HSTS",
      tags: ["headers", "configuration"],
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: "Information Disclosure",
      description:
        "Server version and technology stack exposed in HTTP headers.",
      severity: "low",
      cvss: 3.1,
      url: targetUrl,
      method: "GET",
      evidence: "Server: Apache/2.4.41, X-Powered-By: PHP/7.4.3",
      tags: ["disclosure", "fingerprinting"],
      timestamp: new Date().toISOString(),
    },
  ];
}
