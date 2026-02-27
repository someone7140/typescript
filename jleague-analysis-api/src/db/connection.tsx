import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { WebSocket } from "undici";
import * as schema from "@/db/schema";

export const getDrizzleDb = async () => {
  neonConfig.webSocketConstructor = WebSocket;

  if (process.env.LOCAL_NEON_FETCH_POINT) {
    neonConfig.fetchEndpoint = process.env.LOCAL_NEON_FETCH_POINT;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }

  return drizzle(neon(process.env.DATABASE_URL!), { schema });
};
