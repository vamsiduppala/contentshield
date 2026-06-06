export interface OcrSegment {
  startTime: number;
  endTime: number;
  detectedText: string;
  confidence: number;
  boundingBox?: Record<string, number>;
  frameStorageKey?: string;
}

export interface OcrProvider {
  scanFrames(videoInput: { scanId: string; intervalSeconds: number }): Promise<OcrSegment[]>;
}
