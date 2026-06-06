import { Injectable } from "@nestjs/common";
import { MockTranscriptionProvider } from "./providers/mock-transcription.provider";

@Injectable()
export class TranscriptionService {
  constructor(private readonly mockProvider: MockTranscriptionProvider) {}

  transcribe(scanId: string) {
    return this.mockProvider.transcribe({ scanId });
  }
}
