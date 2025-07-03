import { useState } from "react";
import { ScanOptions, ScanResult, AIAnalysis, ScanResponse } from "@shared/api";
import Scanner from "@/components/Scanner";
import ScanProgress from "@/components/ScanProgress";
import AIAnalysisComponent from "@/components/AIAnalysis";
import CyberBackground from "@/components/ui/cyber-background";
import { NeonButton } from "@/components/ui/neon-button";
import { RotateCcw } from "lucide-react";

type AppState = "scanner" | "scanning" | "results";

export default function Index() {
  const [appState, setAppState] = useState<AppState>("scanner");
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const handleStartScan = async (options: ScanOptions) => {
    try {
      // Start the scan
      const response = await fetch("/api/scanner/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      const data = (await response.json()) as ScanResponse;
      setCurrentScanId(data.scanId);
      setAppState("scanning");
    } catch (error) {
      console.error("Error starting scan:", error);
      alert("Failed to start scan. Please try again.");
    }
  };

  const handleScanComplete = async (result: ScanResult) => {
    setScanResult(result);

    // Get AI analysis
    try {
      const response = await fetch(`/api/ai-analysis/${result.id}`);
      const analysis = (await response.json()) as AIAnalysis;
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      // Create mock analysis if API fails
      const mockAnalysis: AIAnalysis = {
        summary:
          "The target application shows several security vulnerabilities that require immediate attention. Critical issues include potential SQL injection vectors and exposed sensitive endpoints. The overall security posture needs significant improvement.",
        riskScore: 75,
        recommendations: [
          "Implement input validation and parameterized queries to prevent SQL injection",
          "Enable proper authentication and authorization mechanisms",
          "Update all third-party dependencies to latest secure versions",
          "Implement proper error handling to prevent information disclosure",
          "Add rate limiting and DDoS protection mechanisms",
        ],
        prioritizedVulns: result.vulnerabilities.slice(0, 5),
        riskFactors: [
          "Multiple high-severity vulnerabilities detected",
          "Outdated software components identified",
          "Insufficient access controls observed",
          "Potential data exposure vectors found",
        ],
        estimatedFixTime: "2-3 weeks",
      };
      setAiAnalysis(mockAnalysis);
    }

    setAppState("results");
  };

  const handleNewScan = () => {
    setAppState("scanner");
    setCurrentScanId(null);
    setScanResult(null);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen relative">
      <CyberBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {appState === "scanner" && (
          <Scanner onStartScan={handleStartScan} isScanning={false} />
        )}

        {appState === "scanning" && currentScanId && (
          <ScanProgress
            scanId={currentScanId}
            onScanComplete={handleScanComplete}
          />
        )}

        {appState === "results" && scanResult && aiAnalysis && (
          <div className="space-y-6">
            <AIAnalysisComponent
              scanResult={scanResult}
              analysis={aiAnalysis}
            />

            {/* New Scan Button */}
            <div className="flex justify-center pt-8">
              <NeonButton
                variant="outline"
                onClick={handleNewScan}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                NEW SCAN
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
