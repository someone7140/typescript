import { MongoClient, MongoClientOptions, type Db } from "mongodb";

export class MongoConnection {
  private client: MongoClient | null = null;
  private connectPromise: Promise<MongoClient> | null = null; // 接続中の重複防止

  constructor(private readonly uri: string) {}

  async getDb(): Promise<Db> {
    if (!this.connectPromise) {
      const client = new MongoClient(this.uri, {
        maxPoolSize: 5,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      } as MongoClientOptions);

      this.connectPromise = client
        .connect()
        .then((connectedClient) => {
          this.client = connectedClient;
          return connectedClient;
        })
        .catch((err) => {
          // 失敗時はリセット
          this.connectPromise = null;
          this.client = null;
          throw err;
        });
    }

    const client = await this.connectPromise;
    return client.db();
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.connectPromise = null;
    }
  }
}
