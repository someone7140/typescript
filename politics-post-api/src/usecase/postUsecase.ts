import { generate as generateV7 } from "@std/uuid/v7";
import { Db } from "mongodb";
import { InputShapeFromFields } from "@pothos/core";

import {
  ErrorType,
  PostStatus,
  PostStatusType,
  RegisterPostRequest,
  UpdatePostRequest,
} from "@/graphql/graphqlType";
import {
  getPosts,
  registerPost,
  updatePost,
} from "@/repository/postsRepository";
import { getTagIdsWithRegister } from "@/usecase/postTagUsecase";
import { AppGraphQLError } from "@/type/error";

export const registerMyPost = async (
  db: Db,
  req: InputShapeFromFields<typeof RegisterPostRequest>,
  userAccountId: string,
) => {
  const tagIds = await getTagIdsWithRegister(
    db,
    req.tagNames,
    userAccountId,
    req.status,
  );
  const newPost = {
    _id: generateV7(),
    title: req.title,
    userAccountId: userAccountId,
    contents: req.contents,
    tagIds: tagIds,
    status: req.status,
    updatedAt: new Date(),
    description: req.description ?? undefined,
    commitAt:
      req.status === "OPEN" || req.status === "PRIVATE"
        ? new Date()
        : undefined,
  };
  await registerPost(db, newPost);
};

export const updateMyPost = async (
  db: Db,
  req: InputShapeFromFields<typeof UpdatePostRequest>,
  userAccountId: string,
) => {
  const registeredPosts = await getPosts(db, userAccountId, req.id);
  if (registeredPosts.length === 0) {
    throw new AppGraphQLError("Can not found user", ErrorType.NOT_FOUND);
  }
  if (registeredPosts[0].status !== PostStatus.DRAFT) {
    throw new AppGraphQLError(
      "Edit only status DRAFT",
      ErrorType.FORBIDDEN_ERROR,
    );
  }

  const tagIds = await getTagIdsWithRegister(
    db,
    req.tagNames,
    userAccountId,
    req.status,
  );
  const updatedPost = {
    _id: req.id,
    title: req.title,
    userAccountId: userAccountId,
    contents: req.contents,
    tagIds: tagIds,
    status: req.status,
    updatedAt: new Date(),
    description: req.description ?? undefined,
    commitAt:
      req.status === "OPEN" || req.status === "PRIVATE"
        ? new Date()
        : undefined,
  };
  await updatePost(db, updatedPost);
};

const toPostResultList = (r: Awaited<ReturnType<typeof getPosts>>[number]) => ({
  id: r._id,
  title: r.title,
  contents: r.contents,
  status: r.status,
  updateAt: r.updatedAt,
  tags: r.tags.map((tag) => ({
    id: tag.id,
    tagName: tag.tagName,
  })),
  userAccount: {
    userSettingId: r.userAccount.userSettingId,
    name: r.userAccount.name,
    urlList: r.userAccount.urlList,
    detail: r.userAccount.detail,
    imageUrl: r.userAccount.imageUrl,
  },
  commitAt: r.commitAt,
});

export const getMyPostLists = async (
  db: Db,
  userAccountId: string,
  status?: PostStatusType,
) => {
  const results = await getPosts(db, userAccountId, undefined, status);
  return results.map(toPostResultList);
};

export const getOpenPostLists = async (db: Db) => {
  const results = await getPosts(db, undefined, undefined, "OPEN");
  return results.map(toPostResultList);
};
