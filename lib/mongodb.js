import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

// If the DB name is in the URI, use client.db() with no argument
export async function getDb() {
  await client.connect(); // safe to call multiple times
  return client.db(); // uses the default DB from the URI
}
