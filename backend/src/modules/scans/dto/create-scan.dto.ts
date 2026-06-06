import { IsBoolean, IsEnum, IsObject, IsString } from "class-validator";

export enum PlatformPresetDto {
  youtube = "youtube",
  tiktok = "tiktok",
  instagram = "instagram"
}

export enum ContentTypeDto {
  geopolitics = "geopolitics",
  podcast = "podcast",
  documentary = "documentary",
  gaming = "gaming",
  news = "news",
  education = "education",
  other = "other"
}

export enum ScanDepthDto {
  fast = "fast",
  balanced = "balanced",
  deep = "deep"
}

export enum ScanLanguageDto {
  english = "english",
  telugu = "telugu",
  hindi = "hindi",
  spanish = "spanish",
  auto = "auto"
}

export class EnabledChecksDto {
  @IsBoolean()
  speech!: boolean;
  @IsBoolean()
  ocr!: boolean;
  @IsBoolean()
  captions!: boolean;
  @IsBoolean()
  context!: boolean;
}

export class CreateScanDto {
  @IsString()
  videoId!: string;
  @IsEnum(PlatformPresetDto)
  platformPreset!: PlatformPresetDto;
  @IsEnum(ContentTypeDto)
  contentType!: ContentTypeDto;
  @IsEnum(ScanDepthDto)
  scanDepth!: ScanDepthDto;
  @IsEnum(ScanLanguageDto)
  language!: ScanLanguageDto;
  @IsObject()
  enabledChecks!: EnabledChecksDto;
}
