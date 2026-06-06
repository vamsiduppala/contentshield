import { Injectable } from "@nestjs/common";
import { OcrProvider, OcrSegment } from "./ocr-provider";

@Injectable()
export class MockOcrProvider implements OcrProvider {
  async scanFrames(_videoInput?: { scanId: string; intervalSeconds: number }): Promise<OcrSegment[]> {
    return [
      { startTime: 202, endTime: 209, detectedText: "dead bodies near the border", confidence: 0.91, boundingBox: { x: 0.2, y: 0.68, w: 0.46, h: 0.08 } }
    ];
  }
}
