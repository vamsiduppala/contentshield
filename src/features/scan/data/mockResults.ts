import type { RiskFinding, ScanResult } from "../types";

export const mockFindings: RiskFinding[] = [
  { id: "finding_1", timestamp: "00:01:14", phrase: "war", source: "speech", category: "violence_war", severity: "high", suggestion: "conflict", confidence: 96 },
  { id: "finding_2", timestamp: "00:03:22", phrase: "dead bodies", source: "onscreen_text", category: "death_tragedy", severity: "critical", suggestion: "casualties", confidence: 91 },
  { id: "finding_3", timestamp: "00:05:40", phrase: "assault", source: "caption", category: "violence_war", severity: "high", suggestion: "attack incident", confidence: 88 },
  { id: "finding_4", timestamp: "00:06:12", phrase: "weapon", source: "speech", category: "weapons", severity: "medium", suggestion: "equipment", confidence: 84 },
  { id: "finding_5", timestamp: "00:07:03", phrase: "regime collapse", source: "caption", category: "political", severity: "medium", suggestion: "government change", confidence: 79 }
];

export const mockResults: Record<string, ScanResult> = {
  scan_1027: {
    scanId: "scan_1027",
    videoTitle: "Border Conflict Explainer - Final Cut",
    completedAt: "2026-06-05T16:28:00.000Z",
    monetizationSafetyScore: 67,
    verdict: "High Risk",
    summary:
      "This video contains several advertiser-sensitive terms related to conflict, death, and political violence. The highest-risk moments appear between 01:10 and 03:40.",
    categories: [
      { category: "violence_war", count: 6, severity: "high", confidence: 94 },
      { category: "death_tragedy", count: 2, severity: "critical", confidence: 91 },
      { category: "adult_explicit", count: 0, severity: "low", confidence: 99 },
      { category: "profanity", count: 1, severity: "low", confidence: 76 },
      { category: "political", count: 3, severity: "medium", confidence: 82 },
      { category: "weapons", count: 2, severity: "medium", confidence: 84 },
      { category: "self_harm", count: 0, severity: "low", confidence: 98 },
      { category: "hate_harassment", count: 0, severity: "low", confidence: 97 },
      { category: "drugs_crime", count: 0, severity: "low", confidence: 96 }
    ],
    findings: mockFindings
  }
};
