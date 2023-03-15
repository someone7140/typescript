export class UserAccountResponseDto {
  token: string;

  userId: string;

  userName: string;

  iconImageUrl?: string;

  constructor(
    token: string,
    userId: string,
    userName: string,
    iconImageUrl?: string,
  ) {
    this.token = token;
    this.userId = userId;
    this.userName = userName;
    this.iconImageUrl = iconImageUrl;
  }
}
