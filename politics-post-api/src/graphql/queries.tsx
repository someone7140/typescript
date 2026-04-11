import {
  getUserAccountByUserAccountId,
  getUserAccountRegisterTokenFromGoogleAuthCode,
} from "@/usecase/userAccountUsecase";
import {
  AuthCodeForGoogleRequest,
  builder,
  UserAccountAuthResponse,
  UserAccountRegisterTokenFromGoogleResponse,
} from "./graphqlType";

export const setQueries = () => {
  builder.queryType({
    fields: (t) => ({
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
    }),
  });
};
