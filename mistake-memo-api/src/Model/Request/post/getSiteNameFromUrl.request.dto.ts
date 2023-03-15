import { IsString, MinLength } from 'class-validator';

export class GetSiteNameFromUrlRequestDto {
  @IsString()
  @MinLength(1)
  url: string;
}
