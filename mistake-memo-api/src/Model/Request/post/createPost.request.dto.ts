import { IsString, MinLength } from 'class-validator';

export class CreatePostRequestDto {
  @IsString()
  @MinLength(1)
  title: string;

  isOpen: boolean;

  tagWords?: string[];

  detail?: string;

  causes?: string[];

  prevents?: string[];

  occurrenceDate?: Date;

  refUrls?: CreatePostRequestRefUrlDto[];
}

export class CreatePostRequestRefUrlDto {
  @IsString()
  @MinLength(1)
  url: string;

  @IsString()
  @MinLength(1)
  siteName: string;
}
