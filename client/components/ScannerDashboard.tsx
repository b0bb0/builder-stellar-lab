import { useState, useEffect } from "react";
import { HolographicCard } from "@/components/ui/holographic-card";
import FloatingHUD from "@/components/ui/floating-hud";
import EmergencyAlert from "@/components/ui/emergency-alert";
import { NeonButton } from "@/components/ui/neon-button";
import { CyberInput } from "@/components/ui/cyber-input";
import CyberProgressRing from "@/components/ui/cyber-progress-ring";
import CyberRobot from "@/components/ui/cyber-robot";
import { Badge } from "@/components/ui/badge";
import { ScanOptions, ScanTool } from "@shared/api";
import {
  Shield,
  Target,
  Zap,
  AlertTriangle,
  Activity,
  Cpu,
  Eye,
  TrendingUp,
  Gauge,
  Wifi,
} from "lucide-react";

interface ScannerDashboardProps {
  onStartScan: (options: ScanOptions) => void;
  isScanning: boolean;
  scanProgress?: number;
  scanPhase?: string;
  vulnerabilityCount?: number;
}

const AVAILABLE_TOOLS: ScanTool[] = [
  {
    name: "Nuclei",
    enabled: true,
    description: "Advanced vulnerability scanner with 5000+ templates",
  },
  { name: "Httpx", enabled: false, description: "Fast HTTP probing toolkit" },
  {
    name: "Nmap",
    enabled: false,
    description: "Network discovery and security auditing",
  },
  {
    name: "Gobuster",
    enabled: false,
    description: "Directory/file brute-forcing tool",
  },
  {
    name: "Sqlmap",
    enabled: false,
    description: "SQL injection vulnerability scanner",
  },
  {
    name: "Subfinder",
    enabled: false,
    description: "Subdomain discovery tool",
  },
];

export default function ScannerDashboard({
  onStartScan,
  isScanning,
  scanProgress = 0,
  scanPhase = "Initializing...",
  vulnerabilityCount = 0,
}: ScannerDashboardProps) {
  const [targetUrl, setTargetUrl] = useState("https://target.example.com");
  const [tools, setTools] = useState<ScanTool[]>(AVAILABLE_TOOLS);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 67,
    activeConnections: 128,
    threatsDetected: vulnerabilityCount,
    systemUptime: "04:23:15",
    scanIntensity: 85,
  });

  // Update system stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        cpuUsage: Math.min(
          95,
          Math.max(20, prev.cpuUsage + (Math.random() - 0.5) * 10),
        ),
        memoryUsage: Math.min(
          90,
          Math.max(30, prev.memoryUsage + (Math.random() - 0.5) * 5),
        ),
        activeConnections: Math.max(
          50,
          prev.activeConnections + Math.floor((Math.random() - 0.5) * 20),
        ),
        threatsDetected: vulnerabilityCount,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [vulnerabilityCount]);

  // Show emergency alert for critical vulnerabilities
  useEffect(() => {
    if (vulnerabilityCount > 10) {
      setShowEmergencyAlert(true);
    }
  }, [vulnerabilityCount]);

  const handleToolToggle = (toolName: string, enabled: boolean) => {
    setTools(
      tools.map((tool) =>
        tool.name === toolName ? { ...tool, enabled } : tool,
      ),
    );
  };

  const handleStartScan = () => {
    const enabledTools = tools.filter((tool) => tool.enabled);
    if (enabledTools.length === 0) {
      alert("Please select at least one scanning tool");
      return;
    }

    try {
      new URL(targetUrl);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    onStartScan({
      target: { url: targetUrl },
      tools: enabledTools,
      severity: ["critical", "high", "medium", "low", "info"],
      timeout: 300,
    });
  };

  const hudData = [
    {
      label: "CPU USAGE",
      value: systemStats.cpuUsage,
      unit: "%",
      status: systemStats.cpuUsage > 80 ? "warning" : "normal",
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      label: "MEMORY",
      value: systemStats.memoryUsage,
      unit: "%",
      status: systemStats.memoryUsage > 85 ? "critical" : "normal",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "CONNECTIONS",
      value: systemStats.activeConnections,
      unit: "",
      status: "normal",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      label: "THREATS",
      value: systemStats.threatsDetected,
      unit: "",
      status: systemStats.threatsDetected > 5 ? "critical" : "normal",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      label: "UPTIME",
      value: systemStats.systemUptime,
      unit: "",
      status: "normal",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "INTENSITY",
      value: systemStats.scanIntensity,
      unit: "%",
      status: "normal",
      icon: <Gauge className="h-4 w-4" />,
    },
  ];

  if (showEmergencyAlert) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <FloatingHUD data={hudData} className="absolute inset-0" />

        <EmergencyAlert
          type="critical"
          duration={120}
          title="CRITICAL VULNERABILITIES DETECTED"
          message={`${vulnerabilityCount} security threats identified`}
          onTimeout={() => setShowEmergencyAlert(false)}
          className="z-30"
        />

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <NeonButton
            variant="outline"
            onClick={() => setShowEmergencyAlert(false)}
            className="text-red-400 border-red-400"
          >
            ACKNOWLEDGE ALERT
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating HUD Overlay */}
      <FloatingHUD
        data={hudData}
        centerElement={
          isScanning ? (
            <div className="relative">
              {/* Central scanning eye */}
              <div className="relative p-8">
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyber-cyan animate-spin"
                  style={{ animationDuration: "8s" }}
                />
                <div
                  className="absolute inset-2 rounded-full border border-cyber-purple animate-spin"
                  style={{
                    animationDuration: "4s",
                    animationDirection: "reverse",
                  }}
                />

                <Eye className="h-16 w-16 text-cyber-cyan relative z-10" />

                <div className="absolute inset-0 rounded-full bg-cyber-cyan/20 animate-pulse" />
              </div>

              <div className="text-center mt-4">
                <div className="text-cyber-cyan font-mono text-lg font-bold">
                  SCANNING...
                </div>
                <div className="text-cyber-purple text-sm">{scanPhase}</div>
              </div>
            </div>
          ) : null
        }
        className="absolute inset-0 pointer-events-none"
      />

      {/* Header */}
      <div className="text-center space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-cyber-cyan animate-neon-flicker" />
          <h1 className="text-5xl font-bold text-cyber-cyan">LUMINOUS FLOW</h1>
          <Shield className="h-10 w-10 text-cyber-cyan animate-neon-flicker" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
          <p className="text-cyber-purple text-sm tracking-widest uppercase font-bold">
            [CLASSIFIED] SECURITY ASSESSMENT PROTOCOL
          </p>
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <Badge
            variant="outline"
            className="border-cyber-green text-cyber-green bg-green-950/30 animate-pulse"
          >
            <Activity className="h-3 w-3 mr-1" />
            CORE SYSTEM ONLINE
          </Badge>
          <Badge
            variant="outline"
            className="border-cyber-cyan text-cyber-cyan bg-cyan-950/30"
          >
            <Eye className="h-3 w-3 mr-1" />
            AI MODULE ACTIVE
          </Badge>
          <Badge
            variant="outline"
            className="border-cyber-purple text-cyber-purple bg-purple-950/30"
          >
            <Zap className="h-3 w-3 mr-1" />
            NUCLEI ENGINE READY
          </Badge>
        </div>
      </div>

      {/* Target Acquisition */}
      <HolographicCard
        variant="default"
        glowIntensity="medium"
        className="relative z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-cyber-cyan" />
          <h2 className="text-xl font-bold text-cyber-cyan">
            TARGET ACQUISITION
          </h2>
        </div>

        <div className="space-y-3">
          <div className="text-cyber-cyan text-sm font-medium tracking-wide">
            TARGET URL
          </div>
          <CyberInput
            variant="target"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://target.example.com"
            disabled={isScanning}
            showStatusLine={!isScanning}
            statusText="TARGET LOCKED AND LOADED"
            isScanning={isScanning}
            className="text-lg"
          />
        </div>
      </HolographicCard>

      {/* Weapon Selection */}
      <HolographicCard
        variant="warning"
        glowIntensity="high"
        className="relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-6 w-6 text-cyber-purple" />
          <h2 className="text-xl font-bold text-cyber-purple">
            WEAPON SELECTION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                ${
                  tool.enabled
                    ? "border-cyber-purple bg-purple-950/20 border-2 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
                    : "border-gray-600 bg-gray-900/30 hover:border-cyber-cyan/50"
                }
              `}
              onClick={() => handleToolToggle(tool.name, !tool.enabled)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    tool.enabled
                      ? "bg-cyber-purple border-cyber-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                      : "border-gray-500"
                  }`}
                />
                <span
                  className={`font-bold ${
                    tool.enabled ? "text-cyber-purple" : "text-gray-400"
                  }`}
                >
                  {tool.name}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {tool.description}
              </p>

              {tool.enabled && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </HolographicCard>

      {/* Execute Scan */}
      <div className="flex justify-center relative z-10">
        {isScanning ? (
          <div className="flex flex-col items-center space-y-6">
            <CyberProgressRing
              progress={scanProgress}
              size={200}
              color="cyan"
              className="mb-4"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-cyber-cyan font-mono">
                  {Math.round(scanProgress)}%
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  SCANNING
                </div>
              </div>
            </CyberProgressRing>

            <div className="text-center">
              <div className="text-cyber-cyan text-lg font-bold mb-2">
                {scanPhase}
              </div>
              <div className="text-cyber-purple text-sm">
                Vulnerabilities Found: {vulnerabilityCount}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* 3D Robot standing on button */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
              <CyberRobot
                isWaving={true}
                size="md"
                className="drop-shadow-lg"
              />
            </div>

            {/* Execute Button */}
            <NeonButton
              variant="scan"
              size="lg"
              onClick={handleStartScan}
              className="px-16 py-6 text-xl font-bold tracking-wider relative"
            >
              <Zap className="h-6 w-6 mr-3" />
              EXECUTE SCAN
            </NeonButton>

            {/* Robot Speech Bubble */}
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-cyber-cyan rounded-lg px-3 py-2 z-10 backdrop-blur-sm">
              <div className="text-xs text-cyber-cyan font-mono animate-pulse">
                Ready to hack! 🤖
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-cyber-cyan"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
