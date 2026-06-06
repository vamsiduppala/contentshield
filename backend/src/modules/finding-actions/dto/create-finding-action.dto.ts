import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export enum FindingActionTypeDto {
  beep = "beep",
  mute = "mute",
  blur = "blur",
  replace = "replace",
  fix = "fix",
  ignore = "ignore",
  note = "note"
}

export class CreateFindingActionDto {
  @IsEnum(FindingActionTypeDto)
  actionType!: FindingActionTypeDto;

  @IsNumber()
  startTime!: number;

  @IsNumber()
  endTime!: number;

  @IsOptional()
  @IsString()
  replacementPhrase?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
