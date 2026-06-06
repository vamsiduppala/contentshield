import { Injectable } from "@nestjs/common";

export interface TextSegmentInput {
  startTime: number;
  endTime: number;
  text: string;
  source: "speech" | "onscreen_text" | "caption";
}

export interface RiskCandidate {
  startTime: number;
  endTime: number;
  phrase: string;
  source: "speech" | "onscreen_text" | "caption";
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  contextSnippet: string;
  suggestedReplacement: string;
  suggestedReplacements: string[];
  reason: string;
  monetizationImpact: string;
}

const dictionary = [
  { phrase: "dead bodies", category: "death_tragedy", severity: "critical", replacement: "casualties" },
  { phrase: "war", category: "violence_war", severity: "high", replacement: "conflict" },
  { phrase: "assault", category: "violence_war", severity: "high", replacement: "attack incident" },
  { phrase: "weapon", category: "weapons", severity: "medium", replacement: "armed equipment" },
  { phrase: "regime collapse", category: "political", severity: "medium", replacement: "government change" },
  { phrase: "attack", category: "violence_war", severity: "medium", replacement: "incident" }
] as const;

@Injectable()
export class SensitiveWordEngineService {
  detect(segments: TextSegmentInput[]): RiskCandidate[] {
    return segments.flatMap((segment) =>
      dictionary
        .filter((entry) => segment.text.toLowerCase().includes(entry.phrase))
        .map((entry) => ({
          startTime: segment.startTime,
          endTime: segment.endTime,
          phrase: entry.phrase,
          source: segment.source,
          category: entry.category,
          severity: entry.severity,
          confidence: entry.severity === "critical" ? 0.91 : entry.severity === "high" ? 0.88 : 0.79,
          contextSnippet: segment.text,
          suggestedReplacement: entry.replacement,
          suggestedReplacements: [entry.replacement, `${entry.replacement} context`, "neutral wording"],
          reason: `${entry.phrase} can trigger advertiser-sensitive review in ${entry.category} context.`,
          monetizationImpact: entry.severity === "critical" ? "High chance of limited ads." : "May reduce advertiser suitability."
        }))
    );
  }
}
