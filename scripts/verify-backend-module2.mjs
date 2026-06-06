import { listFiles, readText } from "./check-utils.mjs";

const files = await listFiles("backend", [".ts", ".prisma", ".json", ".yml", ".sql"]);
const normalized = files.map((file) => file.replaceAll("\\", "/"));
const all = (await Promise.all(files.map((file) => readText(file)))).join("\n");

const requiredFiles = [
  "backend/src/modules/videos/videos.controller.ts",
  "backend/src/modules/scans/scans.controller.ts",
  "backend/src/modules/scan-processing/scan-orchestrator.service.ts",
  "backend/src/modules/scan-processing/scan-queue.processor.ts",
  "backend/src/modules/transcription/providers/mock-transcription.provider.ts",
  "backend/src/modules/ocr/providers/mock-ocr.provider.ts",
  "backend/src/modules/risk-analysis/risk-analysis.service.ts",
  "backend/src/modules/scoring/scoring.service.ts",
  "backend/src/modules/scan-results/scan-results.controller.ts",
  "backend/src/modules/exports/exports.controller.ts",
  "backend/src/modules/dashboard/dashboard.controller.ts",
  "backend/prisma/schema.prisma",
  "backend/src/worker.ts"
];

const requiredText = [
  "@Post",
  "upload-url",
  "confirm-upload",
  "scan.process",
  "MOCK_AI_MODE",
  "USAGE_LIMIT_EXCEEDED",
  "TENANT_ACCESS_DENIED",
  "RiskFinding",
  "RiskCategorySummary",
  "ScanResult",
  "ProcessingLog",
  "safe",
  "limited_risk",
  "high_risk",
  "critical_risk"
];

const missingFiles = requiredFiles.filter((file) => !normalized.includes(file));
const missingText = requiredText.filter((text) => !all.includes(text));

if (missingFiles.length || missingText.length) {
  if (missingFiles.length) console.error(`Missing backend files: ${missingFiles.join(", ")}`);
  if (missingText.length) console.error(`Missing backend contract text: ${missingText.join(", ")}`);
  process.exit(1);
}

console.log(`Backend Module 2 verification passed (${files.length} files).`);
