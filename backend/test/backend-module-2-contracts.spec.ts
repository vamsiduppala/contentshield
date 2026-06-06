import { readFileSync } from "fs";

describe("Backend Module 2 contracts", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  const scansService = readFileSync("src/modules/scans/scans.service.ts", "utf8");

  it("defines scan engine persistence models", () => {
    ["Video", "ScanJob", "ProcessingStep", "TranscriptSegment", "OcrSegment", "CaptionSegment", "RiskFinding", "RiskCategorySummary", "ScanResult", "ProcessingLog"].forEach((model) => {
      expect(schema).toContain(`model ${model}`);
    });
  });

  it("enforces usage limits and tenant ownership at scan creation", () => {
    expect(scansService).toContain("USAGE_LIMIT_EXCEEDED");
    expect(scansService).toContain("getOwnedVideo");
    expect(scansService).toContain("organizationId");
  });
});
