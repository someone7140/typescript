import { PostStatusType } from "@/graphql/graphqlType";
import { ToCamelCase } from "./typeConvertUtil";

export type PostCollection = {
  _id: string;
  title: string;
  contents: string;
  tag_ids: string[];
  user_account_id: string;
  status: PostStatusType;
  updated_at: Date;
  additional_info: string[];
  commit_at?: Date;
};

export type PostEntity = ToCamelCase<PostCollection>;

export type PostTagCollection = {
  _id: string;
  tag_name: string;
  user_account_ids: string[];
  status: PostStatusType;
};

export type PostTagEntity = ToCamelCase<PostTagCollection>;

export type AccountUserCollection = {
  _id: string;
  name: string;
  user_setting_id: string;
  google_id: string;
  url_list: string[];
  detail?: string;
  image_url?: string;
};

export type AccountUserEntity = ToCamelCase<AccountUserCollection>;
