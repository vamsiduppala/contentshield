import { Module } from "@nestjs/common";
import { MockTranscriptionProvider } from "./providers/mock-transcription.provider";
import { WhisperProvider } from "./providers/whisper.provider";
import { TranscriptionService } from "./transcription.service";

@Module({
  providers: [TranscriptionService, MockTranscriptionProvider, WhisperProvider],
  exports: [TranscriptionService]
})
export class TranscriptionModule {}
