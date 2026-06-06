import { Injectable } from "@nestjs/common";
import { MockOcrProvider } from "./providers/mock-ocr.provider";
import { OcrSpaceProvider } from "./providers/ocr-space.provider";

@Injectable()
export class OcrService {
  constructor(private readonly mockProvider: MockOcrProvider, private readonly realProvider: OcrSpaceProvider) {}

  scanFrames(scanId: string, scanDepth: "fast" | "balanced" | "deep") {
    const intervalSeconds = scanDepth === "fast" ? 10 : scanDepth === "balanced" ? 5 : 2;
    
    if (process.env.MOCK_AI_MODE !== "false") {
      return this.mockProvider.scanFrames({ scanId, intervalSeconds });
    }
    return this.realProvider.scanFrames({ scanId, intervalSeconds });
  }
}
