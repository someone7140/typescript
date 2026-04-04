import { generate as generateV7, extractTimestamp } from "@std/uuid/v7";
import { Db } from "mongodb";
import { InputShapeFromFields } from "@pothos/core";

import { RegisterUserAccountFromGoogleRequest } from "@/graphql/graphqlType";
import {
  getUserAccountByGoogleId,
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
import { AppGraphQLError, BAD_REQUEST, FORBIDDEN_ERROR } from "@/type/error";

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
    picture: googleUserInfo.picture,
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
  console.log(extractTimestamp(newUser._id));

  // jwtトークンとともにレスポンスを返す
  const token = await getUserAccountAuthToken(env, newUser._id);
  return {
    authToken: token,
    name: newUser.name,
    picture: newUser.imageUrl,
  };
};
