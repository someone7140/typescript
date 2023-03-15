import mongoose, { HydratedDocument } from 'mongoose';

export const USER_ACCOUNT_SCHEMA_NAME = 'user_account';

export const UserAccountAuthSchema = new mongoose.Schema({
  gmail: {
    type: String,
  },
  line_id: {
    type: String,
    alias: 'lineId',
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export class UserAccountAuthModel {
  public gmail?: string;

  public lineId?: string;

  public email?: string;

  public password?: string;

  constructor(
    gmail?: string,
    lineId?: string,
    email?: string,
    password?: string,
  ) {
    this.gmail = gmail;
    this.lineId = lineId;
    this.email = email;
    this.password = password;
  }
}

export const UserAccountSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      alias: 'objectId',
    },
    user_id: {
      type: String,
      required: true,
      unique: true,
      alias: 'userId',
    },
    auth_info: {
      type: UserAccountAuthSchema,
      required: true,
      alias: 'authInfo',
    },
    user_name: {
      type: String,
      required: true,
      alias: 'userName',
    },
    description: {
      type: String,
    },
    icon_image_url: {
      type: String,
      alias: 'iconImageUrl',
    },
    twitter_user_name: {
      type: String,
      alias: 'twitterUserName',
    },
    instagram_user_name: {
      type: String,
      alias: 'instagramUserName',
    },
  },
  { collection: USER_ACCOUNT_SCHEMA_NAME },
);

export class UserAccountModel {
  public objectId: string;

  public userId: string;

  public userName: string;

  public authInfo: UserAccountAuthModel;

  public description?: string;

  public iconImageUrl?: string;

  public twitterId?: string;

  public instagramUserName?: string;

  constructor(
    objectId: string,
    userId: string,
    userName: string,
    authInfo: UserAccountAuthModel,
    description?: string,
    iconImageUrl?: string,
    twitterId?: string,
    instagramUserName?: string,
  ) {
    this.objectId = objectId;
    this.userId = userId;
    this.userName = userName;
    this.authInfo = authInfo;
    this.description = description;
    this.iconImageUrl = iconImageUrl;
    this.twitterId = twitterId;
    this.instagramUserName = instagramUserName;
  }
}

export type UserAccountDocument = HydratedDocument<UserAccountModel>;
