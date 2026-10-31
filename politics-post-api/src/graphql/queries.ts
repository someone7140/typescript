import {
  AuthCodeForGoogleRequest,
  builder,
  ErrorType,
  GetPostTagsRequest,
  MyPostsRequest,
  PostResponse,
  PostTagResponse,
  UserAccountAuthResponse,
  UserAccountRegisterTokenFromGoogleResponse,
} from "./graphqlType";
import { getPostTagsByKeywordAndUserAccount } from "@/usecase/postTagUsecase";
import { getMyPostLists, getOpenPostLists } from "@/usecase/postUsecase";
import {
  getUserAccountByUserAccountId,
  getUserAccountRegisterTokenFromGoogleAuthCode,
} from "@/usecase/userAccountUsecase";

export const setQueries = () => {
  builder.queryType({
    fields: (t) => ({
      errorTypeDummy: t.field({
        type: builder.enumType("ErrorType", {
          values: Object.values(ErrorType),
        }),
        resolve: async (_root, _args, _context) => {
          return null;
        },
      }),
      getUserAccountRegisterTokenFromGoogleAuthCode: t.field({
        type: UserAccountRegisterTokenFromGoogleResponse,
        args: AuthCodeForGoogleRequest,
        resolve: async (_root, args, context) => {
          return await getUserAccountRegisterTokenFromGoogleAuthCode(
            context.env,
            context.var.db,
            args.authCode,
          );
        },
      }),
      getUserInfoFromAuthHeader: t.field({
        type: UserAccountAuthResponse,
        authScopes: {
          isAuthenticated: true,
        },
        resolve: async (_root, _args, context) => {
          return await getUserAccountByUserAccountId(
            context.env,
            context.var.db,
            context.var.loginUserAccountId!,
          );
        },
      }),
      getMyPosts: t.field({
        type: [PostResponse],
        authScopes: {
          isAuthenticated: true,
        },
        args: MyPostsRequest,
        resolve: async (_root, _args, context) => {
          return await getMyPostLists(
            context.var.db,
            context.var.loginUserAccountId!,
            _args.status ?? undefined,
            _args.id ?? undefined,
          );
        },
      }),
      getOpenPosts: t.field({
        type: [PostResponse],
        resolve: async (_root, _args, context) => {
          return await getOpenPostLists(context.var.db);
        },
      }),
      getPostTags: t.field({
        args: GetPostTagsRequest,
        type: [PostTagResponse],
        resolve: async (_root, _args, context) => {
          return await getPostTagsByKeywordAndUserAccount(
            context.var.db,
            _args.keyword,
            _args.isOpenOnly ? undefined : context.var.loginUserAccountId,
          );
        },
      }),
    }),
  });
};
