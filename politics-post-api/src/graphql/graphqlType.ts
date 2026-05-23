import SchemaBuilder from "@pothos/core";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

import { GraphQLContext } from "@/type/context";

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  AuthScopes: {
    isAuthenticated: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin],
  scopeAuth: {
    authScopes: async (context) => ({
      isAuthenticated: !!context.var.loginUserAccountId,
    }),
  },
});

// エラー関係
export const ErrorType = {
  AUTH_ERROR: "AUTH_ERROR",
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
} as const;

// ユーザー関係
export const UserAccountAuthResponse = builder.objectType(
  builder.objectRef<{
    authToken: string;
    userSettingId: string;
    name: string;
    urlList: string[];
    detail?: string;
    imageUrl?: string;
  }>("UserAccountAuthResponse"),
  {
    fields: (t) => ({
      authToken: t.exposeString("authToken", { nullable: false }),
      userSettingId: t.exposeString("userSettingId", { nullable: false }),
      name: t.exposeString("name", { nullable: false }),
      urlList: t.exposeStringList("urlList", { nullable: false }),
      detail: t.exposeString("detail"),
      imageUrl: t.exposeString("imageUrl"),
    }),
  },
);

export const AuthCodeForGoogleRequest = builder.args((t) => ({
  authCode: t.string({ required: true }),
}));
export const UserAccountRegisterTokenFromGoogleResponse = builder.objectType(
  builder.objectRef<{
    token: string;
    name: string;
    imageUrl: string;
  }>("UserAccountRegisterTokenFromGoogleResponse"),
  {
    fields: (t) => ({
      token: t.exposeString("token", { nullable: false }),
      name: t.exposeString("name", { nullable: false }),
      imageUrl: t.exposeString("imageUrl"),
    }),
  },
);

export const RegisterUserAccountFromGoogleRequest = builder.args((t) => ({
  token: t.string({ required: true }),
  userSettingId: t.string({ required: true }),
  name: t.string({ required: true }),
  urlList: t.stringList({ required: true }),
  detail: t.string({ required: false }),
}));

// 投稿関係
export const PostStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  PRIVATE: "PRIVATE",
} as const;

export const RegisterPostRequest = builder.args((t) => ({
  title: t.string({ required: true }),
  contents: t.string({ required: true }),
  status: t.field({
    type: builder.enumType("PostStatus", {
      values: Object.values(PostStatus),
    }),
    required: true,
  }),
}));
