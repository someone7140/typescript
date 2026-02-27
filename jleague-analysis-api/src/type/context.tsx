import { Context } from "hono";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export type EnvBindings = {
  GRAPHIQL_ENABLE: string;
  DATA_COLLECTION_DOMAIN: string;
};

export type DbConnection = NeonHttpDatabase<typeof schema>;
export type Variables = {
  db: DbConnection;
};

export type GraphQLContext = Context<{
  Bindings: EnvBindings;
  Variables: Variables;
}>;
