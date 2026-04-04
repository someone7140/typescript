import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";

import { MongoConnection } from "@/db/mongoConnection";
import { builder } from "@/graphql/graphqlType";
import { setMutations } from "@/graphql/mutations";
import { setQueries } from "@/graphql/queries";
import { EnvBindings, Variables } from "@/type/context";

const app = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();
setQueries();
setMutations();

// DBコネクション
let connection: MongoConnection | null = null;

// GraphQLエンドポイント
app.use("/graphql", async (c, next) => {
  if (!connection) {
    connection = new MongoConnection(c.env.MONGODB_URI);
  }
  const db = await connection.getDb();

  c.set("db", db);
  const handler = graphqlServer({
    schema: builder.toSchema(),
    graphiql: c.env.GRAPHIQL_ENABLE === "true",
  });

  return handler(c, next);
});

export default app;
