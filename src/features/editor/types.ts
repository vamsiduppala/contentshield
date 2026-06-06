import type { RiskCategory, RiskSeverity, RiskSource } from "../scan/types";

export type FindingStatus = "pending" | "beeped" | "muted" | "blurred" | "replaced" | "fixed" | "ignored";
export type EditorAction = "beep" | "mute" | "blur" | "replace" | "fix" | "ignore" | "note";
export type ExportFormat = "pdf" | "csv" | "premiere_markers" | "capcut_notes";

export interface EditorFinding {
  id: string;
  timestampStart: string;
  timestampEnd: string;
  phrase: string;
  source: RiskSource;
  category: RiskCategory;
  severity: RiskSeverity;
  confidence: number;
  transcriptSnippet: string;
  screenTextSnippet?: string;
  suggestedReplacements: string[];
  status: FindingStatus;
  selectedReplacement?: string;
  editorNote?: string;
  reason: string;
  monetizationImpact: string;
}

export interface EditorSession {
  scanId: string;
  findings: EditorFinding[];
  activeFindingId: string;
  currentTime: string;
  reviewStartedAt: string;
  reviewCompletedAt?: string;
  completionPercentage: number;
}

export interface EditorSummary {
  originalScore: number;
  updatedScore: number;
  resolved: number;
  remaining: number;
  beeped: number;
  muted: number;
  blurred: number;
  replaced: number;
  fixed: number;
  ignored: number;
}
