import { IsInt, IsMimeType, IsString, Max, Min } from "class-validator";

export class CreateUploadUrlDto {
  @IsString()
  fileName!: string;

  @IsMimeType()
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(1_500_000_000)
  fileSizeBytes!: number;
}
