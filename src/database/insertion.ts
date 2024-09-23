import { getDB } from "../database/connection";

export const insertTransaction = async (transactionData: any) => {
  try {
    const db = getDB();
    const transactionCollection = db.collection("transactions");
    await transactionCollection.insertOne(transactionData);
  } catch (error: any) {
    throw new Error(`Insertion failed: ${error.message}`);
  }
};
