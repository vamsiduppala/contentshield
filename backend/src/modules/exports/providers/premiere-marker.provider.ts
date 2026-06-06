import { Injectable } from "@nestjs/common";
import { EditorExportPayload, ExportProvider } from "./export-provider";

@Injectable()
export class PremiereMarkerProvider implements ExportProvider {
  async generate(payload: EditorExportPayload) {
    return { content: JSON.stringify(payload.actions.map((action) => ({ timestamp: action.startTime, markerName: action.originalPhrase, comment: action.actionType, severity: "review" })), null, 2), mimeType: "application/json", extension: "markers.json" };
  }
}
