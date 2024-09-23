import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db: Db;

export const connectDB = async (): Promise<void> => {
  const client = new MongoClient(process.env.MONGO_URI as string);
  try {
    await client.connect();
    db = client.db("indexer");
    console.log("Connected estanlished to indexer Database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error("Database not initialized.");
  }
  return db;
};
