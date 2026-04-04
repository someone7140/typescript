import { getUserAccountRegisterTokenFromGoogleAuthCode } from "@/usecase/userAccountUsecase";
import {
  builder,
  UserAccountRegisterTokenFromGoogleRequest,
  UserAccountRegisterTokenFromGoogleResponse,
} from "./graphqlType";

export const setQueries = () => {
  builder.queryType({
    fields: (t) => ({
      getUserAccountRegisterTokenFromGoogleAuthCode: t.field({
        type: UserAccountRegisterTokenFromGoogleResponse,
        args: UserAccountRegisterTokenFromGoogleRequest,
        resolve: async (_root, args, context) => {
          return await getUserAccountRegisterTokenFromGoogleAuthCode(
            context.env,
            context.var.db,
            args.authCode,
          );
        },
      }),
    }),
  });
};
