import { Db } from "mongodb";

import { POSTS_COLLECTION } from "@/db/collectionConstants";
import { PostStatus } from "@/graphql/graphqlType";
import { ToCamelCase, toSnake } from "./typeConvertUtil";

type PostCollection = {
  _id: string;
  title: string;
  contents: string;
  user_account_id: string;
  status: (typeof PostStatus)[keyof typeof PostStatus];
};

export type PostEntity = ToCamelCase<PostCollection>;

export const registerPost = async (db: Db, post: PostEntity) => {
  const postsCol = db.collection<PostCollection>(POSTS_COLLECTION);
  await postsCol.insertOne(toSnake<PostCollection>(post));
};
