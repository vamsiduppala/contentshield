import { ScoringService } from "../src/modules/scoring/scoring.service";
import { SensitiveWordEngineService } from "../src/modules/risk-analysis/sensitive-word-engine.service";

describe("Backend Module 2 scan engine", () => {
  it("detects sensitive phrases in mock pipeline text", () => {
    const engine = new SensitiveWordEngineService();
    const findings = engine.detect([{ startTime: 74, endTime: 82, text: "The war situation included attacks.", source: "speech" }]);
    expect(findings.some((finding) => finding.phrase === "war")).toBe(true);
  });

  it("scores high-risk findings below safe threshold", () => {
    const scoring = new ScoringService();
    const result = scoring.score([{ severity: "high", category: "violence_war" }, { severity: "critical", category: "death_tragedy" }]);
    expect(result.safetyScore).toBeLessThan(90);
    expect(result.verdict).toBe("limited_risk");
  });
});
