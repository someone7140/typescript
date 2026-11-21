import { InputShapeFromFields } from "@pothos/core";
import { generate as generateV7 } from "@std/uuid/v7";
import { Db } from "mongodb";

import {
  ErrorType,
  PostStatus,
  PostStatusType,
  RegisterPostRequest,
  UpdatePostRequest,
} from "@/graphql/graphqlType";
import {
  deletePost,
  getPosts,
  registerPost,
  updatePost,
  addAdditionalInfoToPost,
} from "@/repository/postsRepository";
import { AppGraphQLError } from "@/type/error";
import { getTagIdsWithRegister } from "@/usecase/postTagUsecase";

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
    additionalInfo: [],
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
  await checkDraftPost(db, userAccountId, req.id);
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
    additionalInfo: [],
    commitAt:
      req.status === "OPEN" || req.status === "PRIVATE"
        ? new Date()
        : undefined,
  };
  await updatePost(db, updatedPost);
};

export const deleteMyPost = async (
  db: Db,
  id: string,
  userAccountId: string,
) => {
  await checkDraftPost(db, userAccountId, id);
  await deletePost(db, id, userAccountId);
};

export const addAdditionalInfoToMyPost = async (
  db: Db,
  id: string,
  additionalInfo: string,
  userAccountId: string,
) => {
  const registeredPosts = await getPosts(db, userAccountId, undefined, id);
  if (registeredPosts.length === 0) {
    throw new AppGraphQLError("Post not found or you don't have permission", ErrorType.NOT_FOUND);
  }
  await addAdditionalInfoToPost(db, id, additionalInfo);
};

const toPostResultList = (r: Awaited<ReturnType<typeof getPosts>>[number]) => ({
  id: r._id,
  title: r.title,
  contents: r.contents,
  status: r.status,
  updateAt: r.updatedAt,
  tags: r.tags.map((tag) => ({
    id: ("_id" in tag ? tag._id : tag.id) as string,
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

const checkDraftPost = async (db: Db, userAccountId: string, id: string) => {
  const registeredPosts = await getPosts(db, userAccountId, undefined, id);
  if (registeredPosts.length === 0) {
    throw new AppGraphQLError("Can not found user", ErrorType.NOT_FOUND);
  }
  if (registeredPosts[0].status !== PostStatus.DRAFT) {
    throw new AppGraphQLError(
      "Edit only status DRAFT",
      ErrorType.FORBIDDEN_ERROR,
    );
  }
};

export const getMyPostLists = async (
  db: Db,
  userAccountId: string,
  status?: PostStatusType,
  id?: string,
) => {
  const results = await getPosts(db, userAccountId, status, id);
  return results.map(toPostResultList);
};

export const getOpenPostLists = async (db: Db) => {
  const results = await getPosts(db, undefined, "OPEN", undefined);
  return results.map(toPostResultList);
};
