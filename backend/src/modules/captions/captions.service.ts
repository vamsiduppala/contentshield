import { Injectable } from "@nestjs/common";

@Injectable()
export class CaptionsService {
  async parseCaptions() {
    return [
      { startTime: 340, endTime: 346, text: "The assault was captured in the report.", language: "english" },
      { startTime: 423, endTime: 430, text: "Analysts warned of regime collapse.", language: "english" }
    ];
  }
}
