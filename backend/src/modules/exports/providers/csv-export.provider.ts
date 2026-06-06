import { Injectable } from "@nestjs/common";
import { EditorExportPayload, ExportProvider } from "./export-provider";

@Injectable()
export class CsvExportProvider implements ExportProvider {
  async generate(payload: EditorExportPayload) {
    const rows = ["timestampStart,timestampEnd,phrase,category,severity,source,actionTaken,replacement,note,confidence"];
    payload.actions.forEach((action) => rows.push(`${action.startTime},${action.endTime},"${action.originalPhrase}",,,,"${action.actionType}","${action.replacementPhrase || ""}","${action.reason || ""}",`));
    return { content: rows.join("\n"), mimeType: "text/csv", extension: "csv" };
  }
}
