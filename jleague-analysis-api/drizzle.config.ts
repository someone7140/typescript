import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.tsx",
  out: "./src/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
