import { MongoClient } from "mongodb";

export const getMongoClient = async (uri: string): Promise<MongoClient> => {
  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });

  await client.connect();
  return client;
};
