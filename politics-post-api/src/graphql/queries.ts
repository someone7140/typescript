import {
  getUserAccountByUserAccountId,
  getUserAccountRegisterTokenFromGoogleAuthCode,
} from "@/usecase/userAccountUsecase";
import {
  AuthCodeForGoogleRequest,
  builder,
  ErrorType,
  UserAccountAuthResponse,
  UserAccountRegisterTokenFromGoogleResponse,
} from "./graphqlType";

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
    }),
  });
};
