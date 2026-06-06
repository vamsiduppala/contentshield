import { Injectable } from "@nestjs/common";
import { TranscriptionProvider, TranscriptionSegment } from "./transcription-provider";

@Injectable()
export class MockTranscriptionProvider implements TranscriptionProvider {
  async transcribe(_audioInput?: { scanId: string; audioStorageKey?: string }): Promise<TranscriptionSegment[]> {
    return [
      { startTime: 74, endTime: 82, text: "The war situation became worse after several attacks near the border.", confidence: 0.96, speakerLabel: "Speaker A" },
      { startTime: 340, endTime: 346, text: "Officials described the assault as a serious attack incident.", confidence: 0.88, speakerLabel: "Speaker A" },
      { startTime: 372, endTime: 378, text: "The report mentioned a weapon recovered near the scene.", confidence: 0.84, speakerLabel: "Speaker A" }
    ];
  }
}
