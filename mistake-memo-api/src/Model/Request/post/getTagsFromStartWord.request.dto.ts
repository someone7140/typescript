import { IsString, MinLength } from 'class-validator';

export class GetTagsFromStartWordRequestDto {
  @IsString()
  @MinLength(1)
  word: string;
}
