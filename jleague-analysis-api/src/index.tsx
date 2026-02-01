import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import SchemaBuilder from "@pothos/core";
import { setMutations } from "./graphql/mutations";
import { setQueries } from "./graphql/query";

type Bindings = {
  GRAPHIQL_ENABLE: string;
};
const app = new Hono<{ Bindings: Bindings }>();

const builder = new SchemaBuilder({});
setQueries(builder);
setMutations(builder);

// GraphQLエンドポイント
app.use("/graphql", (c, next) => {
  const handler = graphqlServer({
    schema: builder.toSchema(),
    graphiql: c.env.GRAPHIQL_ENABLE === "true",
  });

  return handler(c, next);
});

export default app;
