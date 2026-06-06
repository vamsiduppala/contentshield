import { Injectable } from "@nestjs/common";
import { TranscriptionProvider, TranscriptionSegment } from "./transcription-provider";

@Injectable()
export class MockTranscriptionProvider implements TranscriptionProvider {
  async transcribe(_audioInput?: { scanId: string; audioStorageKey?: string }): Promise<TranscriptionSegment[]> {
    return [
      { startTime: 0, endTime: 8, text: "Provider fallback transcript unavailable for this uploaded video.", confidence: 0.5, speakerLabel: "System" }
    ];
  }
}
