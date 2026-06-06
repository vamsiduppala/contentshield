import { Module } from "@nestjs/common";
import { OcrService } from "./ocr.service";
import { MockOcrProvider } from "./providers/mock-ocr.provider";
import { OcrSpaceProvider } from "./providers/ocr-space.provider";

@Module({
  providers: [OcrService, MockOcrProvider, OcrSpaceProvider],
  exports: [OcrService]
})
export class OcrModule {}
