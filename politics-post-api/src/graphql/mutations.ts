import {
  deleteMyPost,
  registerMyPost,
  updateMyPost,
} from "@/usecase/postUsecase";
import {
  getUserAccountFromGoogleAuthCode,
  registerUserAccountFromGoogle,
} from "@/usecase/userAccountUsecase";
import {
  AuthCodeForGoogleRequest,
  builder,
  RegisterPostRequest,
  RegisterUserAccountFromGoogleRequest,
  UpdatePostRequest,
  UserAccountAuthResponse,
} from "./graphqlType";

export const setMutations = () => {
  builder.mutationType({
    fields: (t) => ({
      registerUserAccountFromGoogle: t.field({
        type: UserAccountAuthResponse,
        args: RegisterUserAccountFromGoogleRequest,
        resolve: async (_root, args, context) => {
          return await registerUserAccountFromGoogle(
            context.env,
            context.var.db,
            args,
          );
        },
      }),
      loginByGoogle: t.field({
        type: UserAccountAuthResponse,
        args: AuthCodeForGoogleRequest,
        resolve: async (_root, args, context) => {
          return await getUserAccountFromGoogleAuthCode(
            context.env,
            context.var.db,
            args.authCode,
          );
        },
      }),
      registerPost: t.boolean({
        authScopes: {
          isAuthenticated: true,
        },
        args: RegisterPostRequest,
        resolve: async (_root, args, context) => {
          await registerMyPost(
            context.var.db,
            args,
            context.var.loginUserAccountId!,
          );
          return true;
        },
      }),
      updatePost: t.boolean({
        authScopes: {
          isAuthenticated: true,
        },
        args: UpdatePostRequest,
        resolve: async (_root, args, context) => {
          await deleteMyPost(
            context.var.db,
            args.id,
            context.var.loginUserAccountId!,
          );
          return true;
        },
      }),
      deletePost: t.boolean({
        authScopes: {
          isAuthenticated: true,
        },
        args: builder.args((t) => ({
          id: t.string({ required: true }),
        })),
        resolve: async (_root, args, context) => {
          await deleteMyPost(
            context.var.db,
            args.id,
            context.var.loginUserAccountId!,
          );
          return true;
        },
      }),
    }),
  });
};
