import type { RiskSeverity, ScanResult } from "../features/scan/types";

export function scoreVerdict(score: number): ScanResult["verdict"] {
  if (score >= 86) return "Safe";
  if (score >= 70) return "Limited Risk";
  if (score >= 45) return "High Risk";
  return "Critical Risk";
}

export function severityClass(severity: RiskSeverity) {
  return {
    low: "border-acid/25 bg-acid/10 text-acid",
    medium: "border-cyan/25 bg-cyan/10 text-cyan",
    high: "border-amber/25 bg-amber/10 text-amber",
    critical: "border-red-400/30 bg-red-400/10 text-red-200"
  }[severity];
}

export function scoreClass(score: number) {
  if (score >= 86) return "text-acid";
  if (score >= 70) return "text-cyan";
  if (score >= 45) return "text-amber";
  return "text-red-200";
}
