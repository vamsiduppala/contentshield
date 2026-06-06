export interface EditorExportPayload {
  session: any;
  summary: any;
  actions: any[];
  notes: any[];
}

export interface ExportProvider {
  generate(payload: EditorExportPayload): Promise<{ content: string; mimeType: string; extension: string }>;
}
