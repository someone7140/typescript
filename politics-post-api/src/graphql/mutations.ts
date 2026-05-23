import { registerMyPost } from "@/usecase/postUsecase";
import {
  getUserAccountFromGoogleAuthCode,
  registerUserAccountFromGoogle,
} from "@/usecase/userAccountUsecase";
import {
  AuthCodeForGoogleRequest,
  builder,
  RegisterPostRequest,
  RegisterUserAccountFromGoogleRequest,
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
          registerMyPost(context.var.db, args, context.var.loginUserAccountId!);
          return true;
        },
      }),
    }),
  });
};
