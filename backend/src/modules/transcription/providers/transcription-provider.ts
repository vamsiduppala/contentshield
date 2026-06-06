export interface TranscriptionSegment {
  startTime: number;
  endTime: number;
  text: string;
  confidence: number;
  speakerLabel?: string;
}

export interface TranscriptionProvider {
  transcribe(audioInput: { scanId: string; mediaUrl?: string }): Promise<TranscriptionSegment[]>;
}
