import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB;

export async function getDb() {
  if (!client.isConnected()) await client.connect();
  return client.db(dbName);
}
