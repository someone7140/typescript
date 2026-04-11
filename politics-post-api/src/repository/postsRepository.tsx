import camelcaseKeys from "camelcase-keys";
import { Db } from "mongodb";

import { POSTS_COLLECTION } from "@/db/collectionConstants";
import { ToCamelCase, toSnake } from "./typeConvertUtil";

type PostCollection = {
  _id: string;
  title: string;
  contents: string;
  user_account_id: string;
  open_flag: boolean;
  open_at: Date;
};

export type PostEntity = ToCamelCase<PostCollection>;

export const registerPost = async (db: Db, post: PostEntity) => {
  const postsCol = db.collection<PostCollection>(POSTS_COLLECTION);
  await postsCol.insertOne(toSnake<PostCollection>(post));
};
