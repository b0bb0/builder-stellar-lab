import { useState } from "react";
import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScanOptions, ScanTool } from "@shared/api";
import { Shield, Target, Zap, AlertTriangle } from "lucide-react";

interface ScannerProps {
  onStartScan: (options: ScanOptions) => void;
  isScanning: boolean;
}

const AVAILABLE_TOOLS: ScanTool[] = [
  {
    name: "Nuclei",
    enabled: true,
    description: "Fast vulnerability scanner with thousands of templates",
  },
  {
    name: "Httpx",
    enabled: false,
    description: "HTTP toolkit for probing services",
  },
  {
    name: "Nmap",
    enabled: false,
    description: "Network exploration and security auditing",
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

export default function Scanner({ onStartScan, isScanning }: ScannerProps) {
  const [targetUrl, setTargetUrl] = useState("https://target.example.com");
  const [tools, setTools] = useState<ScanTool[]>(AVAILABLE_TOOLS);

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

    onStartScan({
      target: { url: targetUrl },
      tools: enabledTools,
      severity: ["critical", "high", "medium", "low", "info"],
      timeout: 30000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-cyan">
          <Shield className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-glow-cyan">LUMINOUS FLOW</h1>
          <Shield className="h-8 w-8" />
        </div>
        <p className="text-cyber-purple text-sm tracking-widest uppercase">
          [CLASSIFIED] SECURITY ASSESSMENT PROTOCOL
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge
            variant="outline"
            className="border-cyber-green text-cyber-green"
          >
            AKTIV
          </Badge>
          <span className="text-muted-foreground">SYSTEM STATUS</span>
        </div>
      </div>

      {/* Target Acquisition */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            TARGET ACQUISITION
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-2">
            <Label
              htmlFor="target"
              className="text-cyber-cyan text-sm font-medium"
            >
              TARGET URL
            </Label>
            <Input
              id="target"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://target.example.com"
              className="bg-cyber-surface border-glow-cyan font-mono text-cyber-cyan"
              disabled={isScanning}
            />
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Weapon Selection */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            WEAPON SELECTION
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className={`
                  p-4 rounded-lg border transition-all duration-300 cursor-pointer
                  ${
                    tool.enabled
                      ? "border-cyber-purple bg-cyber-surface hover:border-cyber-purple hover:glow-purple"
                      : "border-cyber-surface bg-cyber-bg-dark hover:border-cyber-cyan/50"
                  }
                `}
                onClick={() => handleToolToggle(tool.name, !tool.enabled)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={tool.enabled}
                    onChange={(checked) =>
                      handleToolToggle(tool.name, !!checked)
                    }
                    className="border-cyber-cyan data-[state=checked]:bg-cyber-purple"
                    disabled={isScanning}
                  />
                  <Label
                    className={`font-medium cursor-pointer ${tool.enabled ? "text-cyber-purple" : "text-muted-foreground"}`}
                  >
                    {tool.name}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Debug Info */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            DEBUG INFO:
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Selected Tools:</span>
              <p className="text-cyber-cyan">
                {tools.filter((t) => t.enabled).length}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Target Type:</span>
              <p className="text-cyber-cyan">Web Application</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <p className="text-cyber-cyan">Standard Scan</p>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Execute Button */}
      <div className="flex justify-center">
        <NeonButton
          variant="scan"
          size="lg"
          onClick={handleStartScan}
          disabled={isScanning}
          className="px-12 py-4 text-lg font-bold tracking-wider"
        >
          {isScanning ? "SCANNING..." : "EXECUTE SCAN"}
        </NeonButton>
      </div>
    </div>
  );
}
