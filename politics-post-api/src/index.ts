import { EventEmitter } from "events";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { getMongoClient } from "@/db/mongoConnection";
import { getGraphqlHandler } from "@/graphql/graphqlHandler";
import { setAuthInfoToContext } from "@/service/authenticationService";
import { EnvBindings, Variables } from "@/type/context";

const app = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();

// CORSの設定
app.use(
  "/graphql",
  cors({
    origin: (_, c) => c.env.FRONTEND_DOMAIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Accept",
      "Authorization",
      "Content-type",
      "User-agent",
      "X-csrftoken",
      "X-requested-with",
      "Apollo-require-preflight",
    ],
    credentials: true,
    maxAge: 86400,
  }),
);

EventEmitter.defaultMaxListeners = 50;

// GraphQLエンドポイント
app.use("/graphql", async (c, next) => {
  const handler = getGraphqlHandler(c.env.GRAPHIQL_ENABLE === "true");
  // DBクライアント
  const dbClient = await getMongoClient(c.env.MONGODB_URI);
  try {
    c.set("db", dbClient.db());
    // 認証情報があればコンテキストにセットする
    setAuthInfoToContext(c, c.req.header("Authorization"));
    return await handler(c, next);
  } finally {
    await dbClient.close();
  }
});

export default app;
