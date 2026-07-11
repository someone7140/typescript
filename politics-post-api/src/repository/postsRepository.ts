import { Db } from "mongodb";

import {
  POSTS_COLLECTION,
  POST_TAGS_COLLECTION,
  USER_ACCOUNTS_COLLECTION,
} from "@/db/collectionConstants";
import { PostStatusType } from "@/graphql/graphqlType";
import { toCamel, ToCamelCase, toSnake } from "./typeConvertUtil";
import type { PostTagEntity, PostTagCollection } from "./postTagRepository";
import type { AccountUserCollection } from "./userAccountsRepository";

type PostCollection = {
  _id: string;
  title: string;
  contents: string;
  tag_ids: string[];
  user_account_id: string;
  status: PostStatusType;
  updated_at: Date;
  description?: string;
  commit_at?: Date;
};

export type PostEntity = ToCamelCase<PostCollection>;

export const registerPost = async (db: Db, post: PostEntity) => {
  const postsCol = db.collection<PostCollection>(POSTS_COLLECTION);
  await postsCol.insertOne(toSnake<PostCollection>(post));
};

export const updatePost = async (db: Db, post: PostEntity) => {
  const postsCol = db.collection<PostCollection>(POSTS_COLLECTION);
  const { _id, ...rest } = post;

  await postsCol.updateOne(
    { _id: post._id },
    { $set: toSnake<Omit<PostCollection, "_id">>(rest) },
  );
};

export const getPosts = async (
  db: Db,
  userAccountId?: string,
  id?: string,
  status?: PostStatusType,
) => {
  const postsCol = db.collection<PostCollection>(POSTS_COLLECTION);

  const filters = [];
  if (userAccountId) {
    filters.push({ $match: { user_account_id: userAccountId } });
  }
  if (id) {
    filters.push({ $match: { _id: id } });
  }
  if (status) {
    filters.push({ $match: { status: status } });
  }

  const results = await postsCol
    .aggregate<
      PostCollection & {
        tags: PostTagCollection[];
        user_account: AccountUserCollection;
      }
    >([
      ...filters,
      {
        $lookup: {
          from: POST_TAGS_COLLECTION,
          localField: "tag_ids",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $lookup: {
          from: USER_ACCOUNTS_COLLECTION,
          localField: "user_account_id",
          foreignField: "_id",
          as: "user_account",
        },
      },
      {
        $unwind: {
          path: "$user_account",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          updated_at: -1,
        },
      },
      {
        $limit: 300,
      },
    ])
    .toArray();

  return results.map(
    (result) =>
      toCamel(result) as ToCamelCase<
        PostCollection & {
          tags: PostTagEntity[];
          user_account: AccountUserCollection;
        }
      >,
  );
};
