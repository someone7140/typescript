import { Db, Filter } from "mongodb";

import { POST_TAGS_COLLECTION } from "@/db/collectionConstants";
import { PostStatus } from "@/graphql/graphqlType";
import { toCamel, ToCamelCase, toSnake } from "./typeConvertUtil";

export type PostTagCollection = {
  _id: string;
  tag_name: string;
  user_account_ids: string[];
  status: (typeof PostStatus)[keyof typeof PostStatus];
};

export type PostTagEntity = ToCamelCase<PostTagCollection>;

export const registerPostTags = async (db: Db, tags: PostTagEntity[]) => {
  const tagsCol = db.collection<PostTagCollection>(POST_TAGS_COLLECTION);
  await tagsCol.bulkWrite(
    tags.map((tag) => {
      return {
        replaceOne: {
          filter: { _id: tag._id },
          replacement: toSnake<PostTagCollection>(tag),
          upsert: true,
        },
      };
    }),
  );
};

export const getPostTagsByNames = async (db: Db, tagNames: string[]) => {
  const tagsCol = db.collection<PostTagCollection>(POST_TAGS_COLLECTION);
  const results = tagsCol.find({
    tag_name: { $in: tagNames },
  });

  return await results
    .map((col) => {
      return toCamel<PostTagCollection>(col);
    })
    .toArray();
};

export const getPostTagsByKeywordAndUserAuthority = async (
  db: Db,
  keyword: string,
  userAccountId?: string,
) => {
  const tagsCol = db.collection<PostTagCollection>(POST_TAGS_COLLECTION);

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(`^${escapedKeyword}`);

  const filters: Filter<PostTagCollection>[] = [
    {
      tag_name: { $regex: prefixRegex },
      status: PostStatus.OPEN,
    },
  ];

  if (userAccountId) {
    filters.push({
      tag_name: { $regex: prefixRegex },
      status: { $ne: PostStatus.OPEN },
      user_account_ids: userAccountId,
    });
  }

  const results = tagsCol
    .find({
      $or: filters,
    })
    .collation({ locale: "ja" })
    .sort({ tag_name: 1 })
    .limit(100);

  return await results
    .map((col) => {
      return toCamel<PostTagCollection>(col);
    })
    .toArray();
};
