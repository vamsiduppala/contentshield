export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "reviewer" | "viewer";
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  planId: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  scans: string;
  features: string[];
  recommended?: boolean;
}

export interface Usage {
  scansUsed: number;
  scansLimit: number;
  reportsExported: number;
  seatsUsed: number;
}

export interface Video {
  id: string;
  title: string;
  status: "draft" | "ready" | "review";
}

export interface Scan {
  id: string;
  videoId: string;
  status: "queued" | "processing" | "completed" | "failed";
  score: number;
}

export interface ScanResult {
  id: string;
  scanId: string;
  monetizationSafetyScore: number;
  verdict: string;
  findings: RiskFinding[];
}

export interface RiskFinding {
  id: string;
  severity: "low" | "medium" | "high";
  category: string;
  timestamp: string;
  excerpt: string;
}

export interface EditorSession {
  id: string;
  scanResultId: string;
  status: "not_started" | "in_progress" | "ready_to_export" | "complete";
}

export interface FindingAction {
  id: string;
  findingId: string;
  action: "replace" | "mute" | "trim" | "approve" | "note";
  status: "open" | "applied" | "dismissed";
}

export interface ExportJob {
  id: string;
  editorSessionId: string;
  format: "Safety Report" | "timestamp_export";
  status: "queued" | "processing" | "ready" | "failed";
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: "mic" | "scanText" | "captions" | "gauge" | "sparkles" | "file";
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
