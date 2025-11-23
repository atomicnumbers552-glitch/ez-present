import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // load .env.local

async function testConnection() {
  console.log("MOGNODODOODODODDKD",process.env.MONGODB_URI);
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    const db = client.db(); // uses DB from URI
    console.log("DB name:", db.databaseName);
    await client.close();
  } catch (err) {
    console.error("❌ Failed to connect:", err);
  }
}

testConnection();
