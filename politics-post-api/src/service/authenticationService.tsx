import { sign, verify } from "hono/jwt";

import { EnvBindings, GraphQLContext } from "@/type/context";
import { AppGraphQLError, AUTH_ERROR, FORBIDDEN_ERROR } from "@/type/error";

type GoogleUserInfo = {
  id: string;
  name: string;
  picture: string;
};

export type GoogleRegisterTokenJwtPayload = {
  googleId: string;
  picture: string;
  exp: number;
};

export type UserAccountJwtPayload = {
  userAccountId: string;
  exp: number;
};

// Googleの認証コードからGoogleのユーザー情報を取得
export const getGoogleUserInfoFromAuthCode = async (
  env: EnvBindings,
  authCode: string,
) => {
  // トークン取得
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: authCode,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.FRONTEND_DOMAIN,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    throw new AppGraphQLError("Failed to exchange token", AUTH_ERROR);
  }

  // ユーザー情報取得
  const { access_token } = await tokenRes.json<{ access_token: string }>();
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) {
    throw new AppGraphQLError("Failed to fetch user info", AUTH_ERROR);
  }

  return await userRes.json<GoogleUserInfo>();
};

// Googleのユーザー情報から登録用のトークンを返す
export const getRegisterTokenByGoogle = async (
  env: EnvBindings,
  googleUserInfo: GoogleUserInfo,
) => {
  const payload: GoogleRegisterTokenJwtPayload = {
    googleId: googleUserInfo.id,
    picture: googleUserInfo.picture,
    exp: Math.floor(Date.now() / 1000) + 60 * 180, // 3時間
  };
  return await sign(payload, env.JWT_SECRET);
};

// Googleの登録用トークンからPayloadを返す
export const getPayloadFromGoogleRegisterToken = async (
  env: EnvBindings,
  token: string,
) => {
  // トークンを検証
  try {
    return (await verify(
      token,
      env.JWT_SECRET,
      "HS256",
    )) as GoogleRegisterTokenJwtPayload;
  } catch (e) {
    throw new AppGraphQLError("Invalid or expired token", FORBIDDEN_ERROR);
  }
};

// ユーザー認証用のトークンを返す
export const getUserAccountAuthToken = async (
  env: EnvBindings,
  userAccountId: string,
) => {
  const payload: UserAccountJwtPayload = {
    userAccountId: userAccountId,
    exp: Math.floor(Date.now() / 1000) + 60 * 1440 * 90, // 90日
  };
  return await sign(payload, env.JWT_SECRET);
};

// Authenticationヘッダーのトークンからコンテキストに認証情報をセット
export const setAuthInfoToContext = async (
  env: EnvBindings,
  context: GraphQLContext,
  authHeader?: string,
) => {
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = (await verify(
        token,
        env.JWT_SECRET,
        "HS256",
      )) as UserAccountJwtPayload;
      context.set("loginUserAccountId", payload.userAccountId);
    } catch {
      // 無効なトークンはundefinedのまま
    }
  }
};
