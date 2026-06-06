import { Module } from "@nestjs/common";
import { LlmContextClassifierService } from "./llm-context-classifier.service";
import { RiskAnalysisService } from "./risk-analysis.service";
import { SensitiveWordEngineService } from "./sensitive-word-engine.service";

@Module({
  providers: [RiskAnalysisService, SensitiveWordEngineService, LlmContextClassifierService],
  exports: [RiskAnalysisService]
})
export class RiskAnalysisModule {}
