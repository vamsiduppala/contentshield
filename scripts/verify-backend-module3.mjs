import { listFiles, readText } from "./check-utils.mjs";

const files = await listFiles("backend", [".ts", ".prisma", ".json", ".yml", ".sql"]);
const normalized = files.map((file) => file.replaceAll("\\", "/"));
const all = (await Promise.all(files.map((file) => readText(file)))).join("\n");

const requiredFiles = [
  "backend/src/modules/editor/editor.controller.ts",
  "backend/src/modules/editor-sessions/editor-sessions.service.ts",
  "backend/src/modules/finding-actions/finding-actions.controller.ts",
  "backend/src/modules/replacements/replacements.controller.ts",
  "backend/src/modules/editor-notes/editor-notes.controller.ts",
  "backend/src/modules/review-progress/review-progress.service.ts",
  "backend/src/modules/exports/editor-exports.controller.ts",
  "backend/src/modules/exports/export-queue.processor.ts",
  "backend/src/modules/exports/providers/pdf-export.provider.ts",
  "backend/src/modules/exports/providers/csv-export.provider.ts",
  "backend/src/modules/exports/providers/premiere-marker.provider.ts",
  "backend/src/modules/exports/providers/capcut-notes.provider.ts",
  "backend/src/modules/collaboration/collaboration.controller.ts",
  "backend/prisma/schema.prisma"
];

const requiredText = [
  "EditorSession",
  "FindingReviewState",
  "FindingAction",
  "ReplacementSuggestion",
  "EditorNote",
  "ExportJob",
  "CollaborationPresence",
  "REVIEW_INCOMPLETE",
  "CRITICAL_IGNORE_REASON_REQUIRED",
  "SESSION_LOCKED",
  "EXPORT_NOT_FOUND",
  "editor.action_beeped",
  "editor.action_replaced",
  "editor.review_completed",
  "premiere_markers",
  "capcut_notes",
  "undo"
];

const forbiddenText = [
  "ffmpeg render",
  "render video",
  "actual video modification"
];

const missingFiles = requiredFiles.filter((file) => !normalized.includes(file));
const missingText = requiredText.filter((text) => !all.includes(text));
const forbidden = forbiddenText.filter((text) => all.toLowerCase().includes(text));

if (missingFiles.length || missingText.length || forbidden.length) {
  if (missingFiles.length) console.error(`Missing backend module 3 files: ${missingFiles.join(", ")}`);
  if (missingText.length) console.error(`Missing backend module 3 contract text: ${missingText.join(", ")}`);
  if (forbidden.length) console.error(`Forbidden video-rendering behavior found: ${forbidden.join(", ")}`);
  process.exit(1);
}

console.log(`Backend Module 3 verification passed (${files.length} files).`);
