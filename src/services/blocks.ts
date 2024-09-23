import Web3 from "web3";
import { processTransaction } from "./transactions";

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://cloudflare-eth.com")
);

export const processBlock = async (blockNumber: number) => {
  try {
    const block = await web3.eth.getBlock(blockNumber, true);

    if (block && block.transactions) {
      for (const tx of block.transactions) {
        await processTransaction(tx);
      }
    }
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error);
  }
};

export const getCurrentBlockNumber = async (): Promise<number> => {
  return Number(await web3.eth.getBlockNumber());
};
