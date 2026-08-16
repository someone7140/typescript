import SchemaBuilder from "@pothos/core";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

import { GraphQLContext } from "@/type/context";

export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  AuthScopes: {
    isAuthenticated: boolean;
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [ScopeAuthPlugin],
  scopeAuth: {
    authScopes: async (context) => ({
      isAuthenticated: !!context.var.loginUserAccountId,
    }),
  },
});

type Types =
  typeof builder extends PothosSchemaTypes.SchemaBuilder<infer T> ? T : never;

// エラー関係
export const ErrorType = {
  AUTH_ERROR: "AUTH_ERROR",
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
} as const;

// ユーザー関係
type UserAccountBase = {
  userSettingId: string;
  name: string;
  urlList: string[];
  detail?: string;
  imageUrl?: string;
};

const userAccountBaseFields = <T extends UserAccountBase>(
  t: PothosSchemaTypes.ObjectFieldBuilder<Types, T>,
) => ({
  userSettingId: t.string({
    nullable: false,
    resolve: (parent) => parent.userSettingId,
  }),
  name: t.string({
    nullable: false,
    resolve: (parent) => parent.name,
  }),
  urlList: t.stringList({
    nullable: false,
    resolve: (parent) => parent.urlList,
  }),
  detail: t.string({
    nullable: true,
    resolve: (parent) => parent.detail,
  }),
  imageUrl: t.string({
    nullable: true,
    resolve: (parent) => parent.imageUrl,
  }),
});

export const UserAccountAuthResponse = builder.objectType(
  builder.objectRef<UserAccountBase & { authToken: string }>(
    "UserAccountAuthResponse",
  ),
  {
    fields: (t) => ({
      ...userAccountBaseFields(t),
      authToken: t.exposeString("authToken", { nullable: false }),
    }),
  },
);

export const UserAccountInfoResponse = builder.objectType(
  builder.objectRef<UserAccountBase>("UserAccountInfoResponse"),
  {
    fields: (t) => userAccountBaseFields(t),
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
export type PostStatusType = (typeof PostStatus)[keyof typeof PostStatus];
export const PostStatusEnum = builder.enumType("PostStatus", {
  values: Object.values(PostStatus),
});

const PostRequestFields = (
  t: Parameters<Parameters<typeof builder.args>[0]>[0],
) => ({
  title: t.string({ required: true }),
  contents: t.string({ required: true }),
  status: t.field({
    type: PostStatusEnum,
    required: true,
  }),
  tagNames: t.stringList({ required: true }),
  description: t.string({ required: false }),
});

export const RegisterPostRequest = builder.args((t) => ({
  ...PostRequestFields(t),
}));

export const UpdatePostRequest = builder.args((t) => ({
  id: t.string({ required: true }),
  ...PostRequestFields(t),
}));

export const GetPostTagsRequest = builder.args((t) => ({
  keyword: t.string({ required: true }),
  isOpenOnly: t.boolean({ required: true }),
}));
export const PostTagResponse = builder.objectType(
  builder.objectRef<{
    id: string;
    tagName: string;
  }>("PostTagResponse"),
  {
    fields: (t) => ({
      id: t.exposeString("id", { nullable: false }),
      tagName: t.exposeString("tagName", { nullable: false }),
    }),
  },
);

export const MyPostsRequest = builder.args((t) => ({
  status: t.field({
    type: PostStatusEnum,
    required: false,
  }),
}));
export const PostResponse = builder.objectType(
  builder.objectRef<{
    id: string;
    title: string;
    contents: string;
    status: PostStatusType;
    updateAt: Date;
    tags: (typeof PostTagResponse.$inferType)[];
    userAccount: typeof UserAccountInfoResponse.$inferType;
    commitAt?: Date;
  }>("PostResponse"),
  {
    fields: (t) => ({
      id: t.exposeString("id", { nullable: false }),
      title: t.exposeString("title", { nullable: false }),
      contents: t.exposeString("contents", { nullable: false }),
      status: t.field({
        type: PostStatusEnum,
        resolve: (parent) => parent.status,
        nullable: false,
      }),
      updateAt: t.field({
        type: "DateTime",
        resolve: (parent) => parent.updateAt,
        nullable: false,
      }),
      tags: t.field({
        type: [PostTagResponse],
        resolve: (parent) => parent.tags,
        nullable: false,
      }),
      userAccount: t.field({
        type: UserAccountInfoResponse,
        resolve: (parent) => parent.userAccount,
        nullable: false,
      }),
      commitAt: t.field({
        type: "DateTime",
        resolve: (parent) => parent.commitAt,
        nullable: true,
      }),
    }),
  },
);
