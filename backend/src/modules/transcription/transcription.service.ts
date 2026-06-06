import { Injectable } from "@nestjs/common";
import { MockTranscriptionProvider } from "./providers/mock-transcription.provider";
import { WhisperProvider } from "./providers/whisper.provider";

@Injectable()
export class TranscriptionService {
  constructor(private readonly mockProvider: MockTranscriptionProvider, private readonly whisperProvider: WhisperProvider) {}

  transcribe(scanId: string, mediaUrl?: string) {
    if (process.env.MOCK_AI_MODE !== "false") return this.mockProvider.transcribe({ scanId });
    return this.whisperProvider.transcribe({ scanId, mediaUrl }).catch((error) => {
      console.error("Groq transcription failed, falling back to mock transcript", error);
      return this.mockProvider.transcribe({ scanId });
    });
  }
}
