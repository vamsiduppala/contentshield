import { Injectable } from "@nestjs/common";
import { RiskCandidate, RiskCandidate as RiskFinding } from "./sensitive-word-engine.service";

@Injectable()
export class LlmContextClassifierService {
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly model = process.env.GEMINI_RISK_MODEL || "gemini-2.0-flash";

  async classify(candidates: RiskCandidate[]): Promise<RiskFinding[]> {
    if (!this.apiKey || !candidates.length) return candidates;

    console.log(`Classifying ${candidates.length} risks with Gemini...`);

    try {
      const prompt = `Analyze these potential monetization risks in a video transcript and provide a final verdict for each.
      Candidates: ${JSON.stringify(candidates)}
      Return the same array format but with refined severity and reasoning.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
      
      const result = await response.json();
      // Logic to parse Gemini response and update candidates would go here.
      // For now, we return candidates as-is but have established the connection.
      
      return candidates;
    } catch (error) {
      console.error("Gemini classification failed, falling back to dictionary results", error);
      return candidates;
    }
  }
}
