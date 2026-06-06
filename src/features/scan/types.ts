export type ScanStatus = "queued" | "uploading" | "processing" | "completed" | "failed";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RiskSource = "speech" | "onscreen_text" | "caption";
export type RiskCategory =
  | "violence_war"
  | "death_tragedy"
  | "adult_explicit"
  | "profanity"
  | "political"
  | "weapons"
  | "self_harm"
  | "hate_harassment"
  | "drugs_crime";

export interface ScanConfig {
  platform: "YouTube" | "TikTok" | "Instagram";
  contentType: "Geopolitics" | "Podcast" | "Documentary" | "Gaming" | "News" | "Education";
  scanDepth: "Fast" | "Balanced" | "Deep";
  language: "English" | "Telugu" | "Hindi" | "Spanish";
  includeSpeech: boolean;
  includeOcr: boolean;
  includeCaptions: boolean;
  includeSensitiveContext: boolean;
}

export interface Scan {
  id: string;
  title: string;
  fileName: string;
  fileSizeMb: number;
  format: string;
  duration: string;
  status: ScanStatus;
  score: number;
  riskCount: number;
  createdAt: string;
  completedAt?: string;
  config: ScanConfig;
}

export interface RiskFinding {
  id: string;
  timestamp: string;
  phrase: string;
  source: RiskSource;
  category: RiskCategory;
  severity: RiskSeverity;
  suggestion: string;
  confidence: number;
}

export interface RiskCategorySummary {
  category: RiskCategory;
  count: number;
  severity: RiskSeverity;
  confidence: number;
}

export interface ScanResult {
  scanId: string;
  videoTitle: string;
  completedAt: string;
  monetizationSafetyScore: number;
  verdict: "Safe" | "Limited Risk" | "High Risk" | "Critical Risk";
  summary: string;
  categories: RiskCategorySummary[];
  findings: RiskFinding[];
}

export interface ProcessingStep {
  id: string;
  label: string;
  detail: string;
}

export interface ExportOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface UploadFile {
  name: string;
  size: number;
  type: string;
  file?: File;
}
