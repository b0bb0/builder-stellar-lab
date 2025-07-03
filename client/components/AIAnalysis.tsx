import {
  CyberCard,
  CyberCardContent,
  CyberCardHeader,
  CyberCardTitle,
} from "@/components/ui/cyber-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AIAnalysis, ScanResult, SeverityLevel } from "@shared/api";
import {
  Brain,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";

interface AIAnalysisProps {
  scanResult: ScanResult;
  analysis: AIAnalysis;
}

const severityColors: Record<SeverityLevel, string> = {
  critical: "text-red-400 border-red-500",
  high: "text-orange-400 border-orange-500",
  medium: "text-yellow-400 border-yellow-500",
  low: "text-blue-400 border-blue-500",
  info: "text-gray-400 border-gray-500",
};

const severityGlow: Record<SeverityLevel, string> = {
  critical: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
  high: "shadow-[0_0_10px_rgba(251,146,60,0.3)]",
  medium: "shadow-[0_0_10px_rgba(250,204,21,0.3)]",
  low: "shadow-[0_0_10px_rgba(96,165,250,0.3)]",
  info: "shadow-[0_0_10px_rgba(156,163,175,0.3)]",
};

export default function AIAnalysisComponent({
  scanResult,
  analysis,
}: AIAnalysisProps) {
  const getRiskLevelColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-orange-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getRiskLevelText = (score: number) => {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-cyber-cyan">
          <Brain className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-glow-cyan">AI ANALYSIS</h1>
          <Brain className="h-8 w-8" />
        </div>
        <p className="text-cyber-purple text-sm tracking-widest uppercase">
          [CLASSIFIED] INTELLIGENCE ASSESSMENT
        </p>
      </div>

      {/* Risk Score */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            RISK ASSESSMENT
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <Badge
                  variant="outline"
                  className={`${getRiskLevelColor(analysis.riskScore)} border-current`}
                >
                  {getRiskLevelText(analysis.riskScore)}
                </Badge>
              </div>
              <div className="space-y-2">
                <Progress
                  value={analysis.riskScore}
                  className={`h-4 ${getRiskLevelColor(analysis.riskScore)}`}
                />
                <p className="text-2xl font-mono text-center text-white">
                  {analysis.riskScore}/100
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-cyber-cyan">
                Vulnerability Distribution
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(scanResult.stats).map(
                  ([severity, count]) =>
                    severity !== "total" && (
                      <div
                        key={severity}
                        className={`p-2 rounded border ${severityColors[severity as SeverityLevel]} ${severityGlow[severity as SeverityLevel]}`}
                      >
                        <div className="text-xs uppercase">{severity}</div>
                        <div className="text-lg font-mono">{count}</div>
                      </div>
                    ),
                )}
              </div>
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Summary */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            EXECUTIVE SUMMARY
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <p className="text-cyber-cyan leading-relaxed">{analysis.summary}</p>
        </CyberCardContent>
      </CyberCard>

      {/* Risk Factors */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            RISK FACTORS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-2">
            {analysis.riskFactors.map((factor, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded bg-cyber-surface border-l-2 border-cyber-purple"
              >
                <AlertTriangle className="h-4 w-4 text-cyber-purple flex-shrink-0" />
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Recommendations */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            RECOMMENDATIONS
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded bg-cyber-surface border-l-2 border-cyber-cyan"
              >
                <div className="w-6 h-6 rounded-full bg-cyber-cyan text-cyber-bg-dark flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Priority Vulnerabilities */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            PRIORITY VULNERABILITIES
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="space-y-3">
            {analysis.prioritizedVulns.slice(0, 5).map((vuln, index) => (
              <div
                key={vuln.id}
                className={`p-4 rounded border ${severityColors[vuln.severity]} ${severityGlow[vuln.severity]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={severityColors[vuln.severity]}
                      >
                        {vuln.severity.toUpperCase()}
                      </Badge>
                      {vuln.cvss && (
                        <span className="text-xs text-muted-foreground">
                          CVSS: {vuln.cvss}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-white mb-1">
                      {vuln.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {vuln.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-mono text-cyber-cyan">
                        {vuln.url}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CyberCardContent>
      </CyberCard>

      {/* Estimated Fix Time */}
      <CyberCard>
        <CyberCardHeader>
          <CyberCardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            REMEDIATION TIMELINE
          </CyberCardTitle>
        </CyberCardHeader>
        <CyberCardContent>
          <div className="text-center space-y-2">
            <p className="text-3xl font-mono text-cyber-cyan">
              {analysis.estimatedFixTime}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimated time to resolve all critical and high severity issues
            </p>
          </div>
        </CyberCardContent>
      </CyberCard>
    </div>
  );
}
