import { Injectable } from "@nestjs/common";
import { EditorExportPayload, ExportProvider } from "./export-provider";

@Injectable()
export class CapcutNotesProvider implements ExportProvider {
  async generate(payload: EditorExportPayload) {
    return { content: payload.actions.map((action) => `${action.startTime}-${action.endTime}: ${action.actionType} "${action.originalPhrase}"`).join("\n"), mimeType: "text/plain", extension: "txt" };
  }
}
