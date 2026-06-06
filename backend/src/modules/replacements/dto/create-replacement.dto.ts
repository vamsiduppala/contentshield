import { IsString, MinLength } from "class-validator";

export class CreateReplacementDto {
  @IsString()
  @MinLength(1)
  replacement!: string;
}
