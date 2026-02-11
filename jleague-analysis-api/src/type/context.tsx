import { Context } from "hono";

export type EnvBindings = {
  GRAPHIQL_ENABLE: string;
  DATA_COLLECTION_DOMAIN: string;
};

export type GraphQLContext = Context<{ Bindings: EnvBindings }>;
