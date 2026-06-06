import { IsEnum } from "class-validator";

export enum EditorExportFormatDto {
  pdf = "pdf",
  csv = "csv",
  premiere_markers = "premiere_markers",
  capcut_notes = "capcut_notes",
  json = "json"
}

export class CreateEditorExportDto {
  @IsEnum(EditorExportFormatDto)
  format!: EditorExportFormatDto;
}
