import {
  HYPOTHESES_COLLECTION,
  USER_ACCOUNTS_COLLECTION,
} from "../collectionConstants";
import { getMongoClient } from "../mongoConnection";

async function runMigrations() {
  const dbClient = await getMongoClient(process.env.MONGODB_URI!);
  try {
    const db = dbClient.db();

    console.log("Running migrations...");
    // Migration実行
    const userAccountsCol = db.collection(USER_ACCOUNTS_COLLECTION);
    await userAccountsCol.createIndexes([
      {
        key: { user_setting_id: 1 },
        name: "idx_user_setting_id",
        unique: true,
        background: true,
      },
      {
        key: { google_id: 1 },
        name: "idx_google_id",
        unique: true,
        partialFilterExpression: { google_id: { $gte: "" } },
        background: true,
      },
    ]);

    const hypothesesCol = db.collection(HYPOTHESES_COLLECTION);
    await hypothesesCol.createIndexes([
      {
        key: { user_account_id: 1 },
        name: "idx_user_account_id",
        background: true,
      },
      {
        key: { category_ids: 1 },
        name: "idx_category_ids",
        background: true,
      },
      {
        key: { is_open: 1 },
        name: "idx_is_open",
        background: true,
      },
      {
        key: { fixed_at: 1 },
        name: "idx_fixed_at",
        background: true,
      },
      {
        key: { "evaluates.fixed_at": 1 },
        name: "idx_evaluates_fixed_at",
        background: true,
      },
    ]);

    console.log("Migrations completed!");
  } finally {
    await dbClient.close();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
