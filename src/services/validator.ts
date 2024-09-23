import { transactionSchema } from "../models/transaction";

export const validateTransaction = async (transactionData: any) => {
  try {
    await transactionSchema.validate(transactionData);
  } catch (error: any) {
    throw new Error(`Validation failed: ${error.message}`);
  }
};
