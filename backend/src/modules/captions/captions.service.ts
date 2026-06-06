import { Injectable } from "@nestjs/common";

export interface ParsedCaptionSegment {
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

@Injectable()
export class CaptionsService {
  async parseCaptions(): Promise<ParsedCaptionSegment[]> {
    return [];
  }
}
