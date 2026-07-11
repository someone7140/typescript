import {
  POST_EVALUATES_COLLECTION,
  POST_TAGS_COLLECTION,
  POSTS_COLLECTION,
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

    const postsCol = db.collection(POSTS_COLLECTION);
    await postsCol.createIndexes([
      {
        key: { user_account_id: 1 },
        name: "idx_user_account_id",
        background: true,
      },
      {
        key: { tag_ids: 1 },
        name: "idx_tag_ids",
        background: true,
      },
      {
        key: { status: 1 },
        name: "idx_status",
        background: true,
      },
      {
        key: { commit_at: 1 },
        name: "idx_commit_at",
        background: true,
      },
      {
        key: { updated_at: 1 },
        name: "idx_updated_at",
        background: true,
      },
    ]);

    const postEvaluatesCol = db.collection(POST_EVALUATES_COLLECTION);
    await postEvaluatesCol.createIndexes([
      {
        key: { user_account_id: 1 },
        name: "idx_user_account_id",
        background: true,
      },
      {
        key: { post_id: 1 },
        name: "idx_post_id",
        background: true,
      },
      {
        key: { updated_at: 1 },
        name: "idx_updated_at",
        background: true,
      },
    ]);

    const postTagsCol = db.collection(POST_TAGS_COLLECTION);
    await postTagsCol.createIndexes([
      {
        key: { tag_name: 1 },
        name: "idx_tag_name",
        background: true,
        collation: { locale: "ja" },
      },
      {
        key: { user_account_ids: 1 },
        name: "idx_user_account_ids",
        background: true,
      },
      {
        key: { status: 1 },
        name: "idx_status",
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
