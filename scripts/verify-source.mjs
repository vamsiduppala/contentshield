import { listFiles, readText } from "./check-utils.mjs";

const files = await listFiles("src", [".ts", ".tsx", ".css"]);
const normalizedFiles = files.map((file) => file.replaceAll("\\", "/"));
const all = (await Promise.all(files.map((file) => readText(file)))).join("\n");

const requiredText = [
  "ContentShield AI",
  "Protect Creator Revenue Before YouTube Flags Your Video.",
  "Start Free Scan",
  "Monetization Safety Score",
  "Risk Finding",
  "Scan Job",
  "Editor Session",
  "Finding Action",
  "Safety Report",
  "createScan",
  "getScanResults",
  "simulateScanProgress",
  "APPLY_BEEP",
  "APPLY_REPLACEMENT",
  "Review Complete",
  "Export Premiere Pro Markers"
];

const requiredFiles = [
  "src/app/App.tsx",
  "src/app/router.tsx",
  "src/components/layout/Navbar.tsx",
  "src/features/marketing/MarketingPage.tsx",
  "src/features/auth/LoginPage.tsx",
  "src/features/auth/SignupPage.tsx",
  "src/features/dashboard/DashboardPage.tsx",
  "src/features/scan/pages/NewScanPage.tsx",
  "src/features/scan/pages/ProcessingPage.tsx",
  "src/features/scan/pages/ResultsPage.tsx",
  "src/features/scan/pages/ScanHistoryPage.tsx",
  "src/features/scan/components/UploadDropzone.tsx",
  "src/features/scan/components/ProcessingStepper.tsx",
  "src/features/scan/components/RiskFindingsTable.tsx",
  "src/features/scan/types.ts",
  "src/lib/mockApi.ts",
  "src/features/editor/pages/EditorReviewPage.tsx",
  "src/features/editor/pages/EditorSummaryPage.tsx",
  "src/features/editor/components/EditorWorkspace.tsx",
  "src/features/editor/components/VideoReviewPlayer.tsx",
  "src/features/editor/components/RiskTimeline.tsx",
  "src/features/editor/components/TranscriptPanel.tsx",
  "src/features/editor/components/FindingInspector.tsx",
  "src/features/editor/components/ReplacementModal.tsx",
  "src/features/editor/hooks/useEditorSession.ts",
  "src/features/editor/types.ts",
  "src/data/pricing.ts",
  "src/data/faqs.ts",
  "src/types/index.ts"
];

const missingText = requiredText.filter((text) => !all.includes(text));
const missingFiles = requiredFiles.filter((file) => !normalizedFiles.includes(file));
const backendCalls = /\b(fetch|XMLHttpRequest|axios)\b/.test(all);

if (missingText.length || missingFiles.length || backendCalls) {
  if (missingText.length) console.error(`Missing required product text: ${missingText.join(", ")}`);
  if (missingFiles.length) console.error(`Missing required files: ${missingFiles.join(", ")}`);
  if (backendCalls) console.error("Frontend modules must stay mock-only with no backend calls.");
  process.exit(1);
}

console.log(`Source verification passed (${files.length} source files).`);
