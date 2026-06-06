import { Injectable } from "@nestjs/common";
import { LlmContextClassifierService } from "./llm-context-classifier.service";
import { SensitiveWordEngineService, TextSegmentInput } from "./sensitive-word-engine.service";

@Injectable()
export class RiskAnalysisService {
  constructor(private readonly dictionary: SensitiveWordEngineService, private readonly classifier: LlmContextClassifierService) {}

  async detectRisks(segments: TextSegmentInput[]) {
    return this.classifier.classify(this.dictionary.detect(segments));
  }
}
