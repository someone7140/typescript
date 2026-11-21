import { Db, Filter } from "mongodb";

import { POST_TAGS_COLLECTION } from "@/db/collectionConstants";
import type { PostTagCollection, PostTagEntity } from "@/type/db/dbType";
import { toCamel, toSnake } from "@/type/db/typeConvertUtil";
import { PostStatus } from "@/graphql/graphqlType";

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

export const getPostTagsByNames = async (
  db: Db,
  tagNames: string[],
): Promise<PostTagEntity[]> => {
  const tagsCol = db.collection<PostTagCollection>(POST_TAGS_COLLECTION);

  const results = await tagsCol
    .find({
      tag_name: { $in: tagNames },
    })
    .toArray();

  return results.map((col) => {
    return toCamel<PostTagCollection>(col);
  });
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

  const results = await tagsCol
    .find({
      $or: filters,
    })
    .collation({ locale: "ja" })
    .sort({ tag_name: 1 })
    .limit(100)
    .toArray();

  return results.map((col) => {
    return toCamel<PostTagCollection>(col);
  });
};
