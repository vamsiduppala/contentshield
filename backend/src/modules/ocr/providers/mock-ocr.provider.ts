import { Injectable } from "@nestjs/common";
import { OcrProvider, OcrSegment } from "./ocr-provider";

@Injectable()
export class MockOcrProvider implements OcrProvider {
  async scanFrames(_videoInput?: { scanId: string; intervalSeconds: number }): Promise<OcrSegment[]> {
    return [];
  }
}
