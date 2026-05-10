import { graphqlServer } from "@hono/graphql-server";
import { builder, ErrorType } from "./graphqlType";
import { setQueries } from "./queries";
import { setMutations } from "./mutations";

type GlobalGraphql = {
  handler?: ReturnType<typeof graphqlServer>;
};

const globalGraphql = globalThis as unknown as {
  _graphql?: GlobalGraphql;
};

export const getGraphqlHandler = (graphiql: boolean) => {
  if (!globalGraphql._graphql) {
    globalGraphql._graphql = {};
  }

  const store = globalGraphql._graphql;

  // 1回だけ生成
  if (!store.handler) {
    setQueries();
    setMutations();
    builder.enumType(ErrorType, {
      name: "ErrorType",
    });

    const schema = builder.toSchema();

    store.handler = graphqlServer({
      schema,
      graphiql,
    });
  }

  return store.handler;
};
