import { Hono } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import SchemaBuilder from "@pothos/core";

import { setMutations } from "@/graphql/mutations";
import { setQueries } from "@/graphql/query";
import { EnvBindings, GraphQLContext } from "@/type/context";

const app = new Hono<{ Bindings: EnvBindings }>();
const builder = new SchemaBuilder<{ Context: GraphQLContext }>({});
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
