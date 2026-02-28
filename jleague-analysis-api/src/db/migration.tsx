import { migrate } from "drizzle-orm/neon-http/migrator";
import { getDrizzleDb } from "./connection";

async function runMigrations() {
  const db = getDrizzleDb(
    process.env.DATABASE_URL!,
    process.env.LOCAL_NEON_FETCH_POINT,
  );
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./src/db/migration" });
  console.log("Migrations completed!");
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
