import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdatePresenceDto {
  @IsOptional()
  @IsString()
  activeFindingId?: string;

  @IsOptional()
  @IsObject()
  cursorMetadata?: Record<string, unknown>;
}
