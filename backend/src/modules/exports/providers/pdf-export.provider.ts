import { Injectable } from "@nestjs/common";
import { EditorExportPayload, ExportProvider } from "./export-provider";

@Injectable()
export class PdfExportProvider implements ExportProvider {
  async generate(payload: EditorExportPayload) {
    return { content: `PDF placeholder: ContentShield AI editor report\n${JSON.stringify(payload.summary, null, 2)}`, mimeType: "application/pdf", extension: "pdf" };
  }
}
