import { generate as generateV7 } from "@std/uuid/v7";
import { Db } from "mongodb";

import { PostStatusType } from "@/graphql/graphqlType";
import {
  getPostTagsByKeywordAndUserAuthority,
  getPostTagsByNames,
  PostTagEntity,
  registerPostTags,
} from "@/repository/postTagRepository";

export const getTagIdsWithRegister = async (
  db: Db,
  tagNames: string[],
  userAccountId: string,
  status: PostStatusType,
) => {
  if (tagNames.length === 0) {
    return [];
  }

  const tagsFromDb = await getPostTagsByNames(db, tagNames);
  const returnTagIds: string[] = [];
  const registerTags: PostTagEntity[] = [];
  tagNames.forEach((tagName) => {
    const tag = tagsFromDb.find((t) => t.tagName === tagName);

    // 新規追加
    if (!tag) {
      const id = generateV7();
      registerTags.push({
        _id: id,
        tagName: tagName,
        userAccountIds: [userAccountId],
        status: status,
      });
      returnTagIds.push(id);
    } else {
      if (status === "OPEN" && tag.status !== "OPEN") {
        // OPENにステータス変更
        registerTags.push({
          _id: tag._id,
          tagName: tag.tagName,
          userAccountIds: [userAccountId],
          status: status,
        });
      } else if (
        !tag.userAccountIds.some((uid) => uid === userAccountId) &&
        tag.status === "PRIVATE"
      ) {
        // tag参照できるユーザを追加
        registerTags.push({
          _id: tag._id,
          tagName: tag.tagName,
          userAccountIds: [...tag.userAccountIds, userAccountId],
          status: status,
        });
      }
      returnTagIds.push(tag._id);
    }
  });

  if (registerTags.length > 0) {
    registerPostTags(db, registerTags);
  }

  return returnTagIds;
};

export const getPostTagsByKeywordAndUserAccount = async (
  db: Db,
  keyword: string,
  userAccountId?: string,
) => {
  const tags = await getPostTagsByKeywordAndUserAuthority(
    db,
    keyword,
    userAccountId,
  );
  return tags.map((tag) => ({
    id: tag._id,
    tagName: tag.tagName,
  }));
};
