import { IsString, MinLength } from "class-validator";

export class EditorNoteDto {
  @IsString()
  @MinLength(1)
  note!: string;
}
