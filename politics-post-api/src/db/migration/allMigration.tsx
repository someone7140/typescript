import {
  POSTS_COLLECTION,
  USER_ACCOUNTS_COLLECTION,
} from "../collectionConstants";
import { MongoConnection } from "../mongoConnection";

async function runMigrations() {
  const connection = new MongoConnection(process.env.MONGODB_URI!);
  console.log("Running migrations...");
  // Migration実行
  const userAccountsCol = (await connection.getDb()).collection(
    USER_ACCOUNTS_COLLECTION,
  );
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

  const postsCol = (await connection.getDb()).collection(POSTS_COLLECTION);
  await postsCol.createIndexes([
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
      key: { open_at: 1 },
      name: "idx_open_at",
      background: true,
    },
  ]);

  console.log("Migrations completed!");
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
