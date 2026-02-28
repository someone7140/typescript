import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export const getDrizzleDb = (
  databaseUrl: string,
  localNeonFetchPoint?: string,
) => {
  if (localNeonFetchPoint) {
    neonConfig.fetchEndpoint = localNeonFetchPoint;
    neonConfig.useSecureWebSocket = false;
    neonConfig.pipelineTLS = false;
    neonConfig.pipelineConnect = false;
  }

  return drizzle(neon(databaseUrl), { schema });
};
