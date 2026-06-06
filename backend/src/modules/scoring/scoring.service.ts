import { Injectable } from "@nestjs/common";

const multipliers: Record<string, number> = {
  self_harm: 1.5,
  hate_harassment: 1.4,
  death_tragedy: 1.3,
  violence_war: 1.2,
  political: 1.1
};

@Injectable()
export class ScoringService {
  score(findings: Array<{ severity: string; category: string }>) {
    const penalty = findings.reduce((sum, finding) => {
      const base = finding.severity === "critical" ? 15 : finding.severity === "high" ? 8 : finding.severity === "medium" ? 4 : 1;
      return sum + base * (multipliers[finding.category] || 1);
    }, 0);
    const safetyScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    return { safetyScore, verdict: this.verdict(safetyScore) };
  }

  verdict(score: number) {
    if (score >= 90) return "safe";
    if (score >= 70) return "limited_risk";
    if (score >= 40) return "high_risk";
    return "critical_risk";
  }
}
