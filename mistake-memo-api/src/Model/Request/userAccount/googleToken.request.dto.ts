import { IsString, MinLength } from 'class-validator';

export class GoogleTokenRequestDto {
  @IsString()
  @MinLength(1)
  idToken: string;
}
