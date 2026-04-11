import { generate as generateV7 } from "@std/uuid/v7";
import { Db } from "mongodb";
import { InputShapeFromFields } from "@pothos/core";

import { RegisterUserAccountFromGoogleRequest } from "@/graphql/graphqlType";
import {
  getUserAccountByGoogleId,
  getUserAccountById,
  getUserAccountByUserSettingId,
  registerUserAccount,
} from "@/repository/userAccountsRepository";
import {
  getGoogleUserInfoFromAuthCode,
  getPayloadFromGoogleRegisterToken,
  getRegisterTokenByGoogle,
  getUserAccountAuthToken,
} from "@/service/authenticationService";
import { EnvBindings } from "@/type/context";
import {
  AppGraphQLError,
  AUTH_ERROR,
  BAD_REQUEST,
  FORBIDDEN_ERROR,
} from "@/type/error";

export const getUserAccountRegisterTokenFromGoogleAuthCode = async (
  env: EnvBindings,
  db: Db,
  authCode: string,
) => {
  const googleUserInfo = await getGoogleUserInfoFromAuthCode(env, authCode);
  // gmailがすでに登録済みかチェック
  const registeredUser = await getUserAccountByGoogleId(db, googleUserInfo.id);
  if (registeredUser) {
    throw new AppGraphQLError("Already registered user", BAD_REQUEST);
  }

  // jwtトークンとともにレスポンスを返す
  const token = await getRegisterTokenByGoogle(env, googleUserInfo);
  return {
    token,
    name: googleUserInfo.name,
    imageUrl: googleUserInfo.picture,
  };
};

export const registerUserAccountFromGoogle = async (
  env: EnvBindings,
  db: Db,
  req: InputShapeFromFields<typeof RegisterUserAccountFromGoogleRequest>,
) => {
  const payload = await getPayloadFromGoogleRegisterToken(env, req.token);

  // すでに登録済みのユーザーかチェック
  let registeredUser = await getUserAccountByGoogleId(db, payload.googleId);
  if (registeredUser) {
    throw new AppGraphQLError("Already registered gmail", FORBIDDEN_ERROR);
  }
  registeredUser = await getUserAccountByUserSettingId(db, req.userSettingId);
  if (registeredUser) {
    throw new AppGraphQLError("Already registered userSettingId", BAD_REQUEST);
  }

  // ユーザーを保存する
  const newUser = {
    _id: generateV7(),
    name: req.name,
    userSettingId: req.userSettingId,
    googleId: payload.googleId,
    urlList: req.urlList,
    detail: req.detail ?? undefined,
    imageUrl: payload.picture,
  };
  await registerUserAccount(db, newUser);

  // jwtトークンとともにレスポンスを返す
  const token = await getUserAccountAuthToken(env, newUser._id);
  return {
    authToken: token,
    userSettingId: req.userSettingId,
    name: newUser.name,
    urlList: newUser.urlList,
    detail: newUser.detail,
    imageUrl: newUser.imageUrl,
  };
};

export const getUserAccountFromGoogleAuthCode = async (
  env: EnvBindings,
  db: Db,
  authCode: string,
) => {
  const googleUserInfo = await getGoogleUserInfoFromAuthCode(env, authCode);
  const registeredUser = await getUserAccountByGoogleId(db, googleUserInfo.id);
  if (!registeredUser) {
    throw new AppGraphQLError("Can not found user", AUTH_ERROR);
  }

  // jwtトークンとともにレスポンスを返す
  const token = await getUserAccountAuthToken(env, registeredUser._id);
  return {
    authToken: token,
    userSettingId: registeredUser.userSettingId,
    urlList: registeredUser.urlList,
    detail: registeredUser.detail,
    name: registeredUser.name,
    imageUrl: registeredUser.imageUrl,
  };
};

export const getUserAccountByUserAccountId = async (
  env: EnvBindings,
  db: Db,
  userAccountId: string,
) => {
  const registeredUser = await getUserAccountById(db, userAccountId);
  if (!registeredUser) {
    throw new AppGraphQLError("Can not found user", AUTH_ERROR);
  }

  // jwtトークンとともにレスポンスを返す
  const token = await getUserAccountAuthToken(env, registeredUser._id);
  return {
    authToken: token,
    userSettingId: registeredUser.userSettingId,
    urlList: registeredUser.urlList,
    detail: registeredUser.detail,
    name: registeredUser.name,
    imageUrl: registeredUser.imageUrl,
  };
};
