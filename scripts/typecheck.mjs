import { readText } from "./check-utils.mjs";

const source = await readText("src/types/index.ts");
const scanSource = await readText("src/features/scan/types.ts");
const editorSource = await readText("src/features/editor/types.ts");
const requiredInterfaces = [
  "User",
  "Organization",
  "Plan",
  "Usage",
  "Video",
  "Scan",
  "ScanResult",
  "RiskFinding",
  "EditorSession",
  "FindingAction",
  "ExportJob"
];
const requiredScanTypes = [
  "ScanStatus",
  "RiskSeverity",
  "RiskSource",
  "RiskCategory",
  "Scan",
  "ScanConfig",
  "ScanResult",
  "RiskFinding",
  "RiskCategorySummary",
  "ProcessingStep",
  "ExportOption"
];
const requiredEditorTypes = [
  "EditorFinding",
  "EditorAction",
  "FindingStatus",
  "EditorSession",
  "ExportFormat"
];

const missing = requiredInterfaces.filter((name) => !new RegExp(`export interface ${name}\\b`).test(source));
const missingScan = requiredScanTypes.filter((name) => !new RegExp(`export (interface|type) ${name}\\b`).test(scanSource));
const missingEditor = requiredEditorTypes.filter((name) => !new RegExp(`export (interface|type) ${name}\\b`).test(editorSource));

if (missing.length || missingScan.length || missingEditor.length) {
  console.error(`Missing shared interfaces: ${missing.join(", ")}`);
  console.error(`Missing scan contracts: ${missingScan.join(", ")}`);
  console.error(`Missing editor contracts: ${missingEditor.join(", ")}`);
  process.exit(1);
}

console.log(`Source contract check passed (${requiredInterfaces.length} shared interfaces, ${requiredScanTypes.length} scan contracts, ${requiredEditorTypes.length} editor contracts).`);
