import type { ProcessingStep, Scan, ScanConfig } from "../types";

export const defaultScanConfig: ScanConfig = {
  platform: "YouTube",
  contentType: "Documentary",
  scanDepth: "Balanced",
  language: "English",
  includeSpeech: true,
  includeOcr: true,
  includeCaptions: true,
  includeSensitiveContext: true
};

export const processingSteps: ProcessingStep[] = [
  { id: "upload", label: "Uploading video", detail: "Preparing the draft for analysis." },
  { id: "audio", label: "Extracting audio", detail: "Separating speech channels from the video." },
  { id: "transcript", label: "Transcribing speech", detail: "Converting spoken language into reviewable text." },
  { id: "ocr", label: "Reading on-screen text", detail: "Scanning overlays, graphics, and visible words." },
  { id: "captions", label: "Checking captions", detail: "Comparing subtitles against advertiser-sensitive patterns." },
  { id: "language", label: "Detecting sensitive language", detail: "Classifying phrases by monetization risk." },
  { id: "risk", label: "Analyzing monetization risk", detail: "Scoring severity, confidence, and context." },
  { id: "report", label: "Generating creator-safe report", detail: "Building the Safety Report summary." }
];

export const mockScans: Scan[] = [
  {
    id: "scan_1027",
    title: "Border Conflict Explainer - Final Cut",
    fileName: "border-conflict-final.mp4",
    fileSizeMb: 842,
    format: "MP4",
    duration: "08:42",
    status: "completed",
    score: 67,
    riskCount: 14,
    createdAt: "2026-06-05T16:25:00.000Z",
    completedAt: "2026-06-05T16:28:00.000Z",
    config: defaultScanConfig
  },
  {
    id: "scan_1019",
    title: "Podcast Episode 41 - Creator Burnout",
    fileName: "podcast-41.webm",
    fileSizeMb: 512,
    format: "WEBM",
    duration: "46:18",
    status: "completed",
    score: 91,
    riskCount: 3,
    createdAt: "2026-06-04T11:10:00.000Z",
    completedAt: "2026-06-04T11:15:00.000Z",
    config: { ...defaultScanConfig, contentType: "Podcast" }
  },
  {
    id: "scan_1008",
    title: "Gaming News Weekly",
    fileName: "gaming-news-weekly.mov",
    fileSizeMb: 1204,
    format: "MOV",
    duration: "12:07",
    status: "completed",
    score: 78,
    riskCount: 8,
    createdAt: "2026-06-02T19:45:00.000Z",
    completedAt: "2026-06-02T19:49:00.000Z",
    config: { ...defaultScanConfig, contentType: "Gaming" }
  },
  {
    id: "scan_0994",
    title: "Documentary Trailer - Raw Export",
    fileName: "doc-trailer.mkv",
    fileSizeMb: 672,
    format: "MKV",
    duration: "02:36",
    status: "completed",
    score: 42,
    riskCount: 21,
    createdAt: "2026-05-30T09:20:00.000Z",
    completedAt: "2026-05-30T09:22:00.000Z",
    config: { ...defaultScanConfig, scanDepth: "Deep" }
  }
];
