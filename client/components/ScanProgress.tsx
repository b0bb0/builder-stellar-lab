import { useEffect, useState } from "react";
import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@shared/api";
import { Activity, Clock, Target, AlertTriangle } from "lucide-react";

interface ScanProgressProps {
  scanId: string;
  onScanComplete: (result: ScanResult) => void;
}

export default function ScanProgress({
  scanId,
  onScanComplete,
}: ScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vulnerabilitiesFound, setVulnerabilitiesFound] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    // Simulate scan progress
    const phases = [
      { phase: "Target reconnaissance...", duration: 2000 },
      { phase: "Port scanning...", duration: 3000 },
      { phase: "Vulnerability detection...", duration: 8000 },
      { phase: "Deep analysis...", duration: 5000 },
      { phase: "AI processing results...", duration: 3000 },
      { phase: "Generating report...", duration: 1000 },
    ];

    let currentPhaseIndex = 0;
    let totalProgress = 0;

    const phaseInterval = setInterval(() => {
      if (currentPhaseIndex < phases.length) {
        const phase = phases[currentPhaseIndex];
        setCurrentPhase(phase.phase);

        const phaseProgress = 100 / phases.length;
        const phaseStart = currentPhaseIndex * phaseProgress;

        let phaseElapsed = 0;
        const phaseTimer = setInterval(() => {
          phaseElapsed += 100;
          const phaseProgressPercent = Math.min(
            (phaseElapsed / phase.duration) * phaseProgress,
            phaseProgress,
          );
          setProgress(phaseStart + phaseProgressPercent);

          // Simulate finding vulnerabilities
          if (currentPhaseIndex >= 2 && Math.random() > 0.8) {
            setVulnerabilitiesFound((prev) => prev + 1);
          }

          if (phaseElapsed >= phase.duration) {
            clearInterval(phaseTimer);
            currentPhaseIndex++;
          }
        }, 100);

        setTimeout(() => {
          clearInterval(phaseTimer);
        }, phase.duration);
      } else {
        // Scan complete
        clearInterval(phaseInterval);
        setCurrentPhase("Scan completed!");
        setProgress(100);

        // Simulate scan result
        const mockResult: ScanResult = {
          id: scanId,
          target: { url: "https://target.example.com" },
          status: "completed",
          vulnerabilities: [],
          stats: {
            total: vulnerabilitiesFound,
            critical: Math.floor(vulnerabilitiesFound * 0.1),
            high: Math.floor(vulnerabilitiesFound * 0.2),
            medium: Math.floor(vulnerabilitiesFound * 0.3),
            low: Math.floor(vulnerabilitiesFound * 0.3),
            info: Math.floor(vulnerabilitiesFound * 0.1),
          },
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration: elapsedTime,
        };

        setTimeout(() => onScanComplete(mockResult), 1000);
      }
    }, 100);

    // Update elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(timeInterval);
    };
  }, [scanId, onScanComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-purple">
          <Activity className="h-8 w-8 animate-pulse" />
          <h1 className="text-4xl font-bold text-glow-purple">
            SCAN IN PROGRESS
          </h1>
        </div>
        <p className="text-cyber-cyan text-sm tracking-widest uppercase">
          [ACTIVE] VULNERABILITY ASSESSMENT
        </p>
      </div>

      {/* Progress Card */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SCAN STATUS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cyber-cyan">{currentPhase}</span>
              <span className="text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-cyber-surface" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-cyan/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-cyber-cyan" />
                <span className="text-sm font-medium text-cyber-cyan">
                  Elapsed Time
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {formatTime(elapsedTime)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-purple/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-cyber-purple" />
                <span className="text-sm font-medium text-cyber-purple">
                  Vulnerabilities Found
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {vulnerabilitiesFound}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-cyber-surface border border-cyber-green/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-cyber-green" />
                <span className="text-sm font-medium text-cyber-green">
                  Progress
                </span>
              </div>
              <p className="text-2xl font-mono text-white">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="border-cyber-green text-cyber-green animate-pulse"
            >
              SCANNING
            </Badge>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyber-cyan rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
