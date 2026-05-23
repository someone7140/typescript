import { Context } from "hono";
import { Db } from "mongodb";

export type EnvBindings = {
  GRAPHIQL_ENABLE: string;
  FRONTEND_DOMAIN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
};

export type Variables = {
  db: Db;
  loginUserAccountId?: string;
};

export type GraphQLContext = Context<{
  Bindings: EnvBindings;
  Variables: Variables;
}>;
