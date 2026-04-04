import { registerUserAccountFromGoogle } from "@/usecase/userAccountUsecase";
import {
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
      registerPost: t.boolean({
        authScopes: {
          isAuthenticated: true,
        },
        args: RegisterPostRequest,
        resolve: async (_root, args, context) => {
          console.log(context.var.loginUserAccountId);
          return true;
        },
      }),
    }),
  });
};
