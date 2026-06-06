import { listFiles, readText } from "./check-utils.mjs";

const files = await listFiles("src", [".js", ".ts", ".tsx", ".css"]);
const issues = [];

for (const file of files) {
  const text = await readText(file);
  if (/\t/.test(text)) issues.push(`${file}: tabs are not allowed`);
  if (/[ \t]+$/m.test(text)) issues.push(`${file}: trailing whitespace`);
  if (/\b(fetch\(|XMLHttpRequest|axios)\b/.test(text)) {
    issues.push(`${file}: frontend module must stay mock-only with no backend calls`);
  }
  if (/ContentShield(?! AI)/.test(text)) {
    issues.push(`${file}: product name must be ContentShield AI`);
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`Lint passed (${files.length} files).`);
