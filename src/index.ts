import dotenv from "dotenv";
import { connectDB } from "./database/connection";
import { processBlock, getCurrentBlockNumber } from "./services/blocks";

dotenv.config();

const startIndexer = async () => {
  await connectDB();

  let latestBlockNumber = await getCurrentBlockNumber();

  setInterval(async () => {
    try {
      const currentBlock = await getCurrentBlockNumber();

      if (currentBlock > latestBlockNumber) {
        for (let i = latestBlockNumber + 1; i <= currentBlock; i++) {
          console.log(`Processing block ${i}`);
          await processBlock(i);
        }
        latestBlockNumber = currentBlock;
      }
    } catch (error) {
      console.error("Error fetching the latest block:", error);
    }
  }, 10000);
};

startIndexer();
