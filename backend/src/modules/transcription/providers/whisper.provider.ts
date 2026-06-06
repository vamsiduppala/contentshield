import { Injectable } from "@nestjs/common";
import { TranscriptionProvider, TranscriptionSegment } from "./transcription-provider";

@Injectable()
export class WhisperProvider implements TranscriptionProvider {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly model = process.env.GROQ_TRANSCRIPTION_MODEL || "whisper-large-v3-turbo";

  async transcribe(input: { scanId: string; mediaUrl?: string }): Promise<TranscriptionSegment[]> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }
    if (!input.mediaUrl) {
      throw new Error("A signed media URL is required for Groq transcription.");
    }
    
    console.log(`Transcribing with Groq Whisper for scan: ${input.scanId}`);

    const mediaResponse = await fetch(input.mediaUrl);
    if (!mediaResponse.ok) throw new Error(`Could not download uploaded media: ${mediaResponse.status}`);
    const mediaBlob = await mediaResponse.blob();

    const formData = new FormData();
    formData.append("file", mediaBlob, `scan-${input.scanId}.mp4`);
    formData.append("model", this.model);
    formData.append("response_format", "verbose_json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${this.apiKey}` },
      body: formData
    });
    if (!response.ok) throw new Error(`Groq transcription failed: ${response.status} ${await response.text()}`);
    const result = await response.json() as { segments?: any[]; text?: string };
    if (Array.isArray(result.segments)) {
      return result.segments.map((segment: any) => ({
        startTime: Number(segment.start ?? 0),
        endTime: Number(segment.end ?? segment.start ?? 0),
        text: String(segment.text || "").trim(),
        confidence: typeof segment.avg_logprob === "number" ? Math.max(0.5, Math.min(0.99, 1 + segment.avg_logprob)) : 0.9
      })).filter((segment: TranscriptionSegment) => segment.text.length > 0);
    }
    return [{ startTime: 0, endTime: 30, text: String(result.text || ""), confidence: 0.9 }].filter((segment) => segment.text.trim().length > 0);
  }
}
