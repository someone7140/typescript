import { IsString, MinLength } from 'class-validator';

export class CreateUserAccountRequestDto {
  @IsString()
  @MinLength(1)
  userId: string;

  @IsString()
  @MinLength(1)
  userName: string;

  description?: string;

  twitterId?: string;

  instagramId?: string;
}
