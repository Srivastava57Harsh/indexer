import Web3 from "web3";
import { processTransaction } from "./transactions";
import { USDT_ABI } from "../constants/usdt";
import { validateTransaction } from "./validator";
import { insertTransaction } from "../database/insertion";

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://cloudflare-eth.com")
);
const USDT_CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const usdtContract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS);

export const processBlock = async (blockNumber: number) => {
  try {
    const block = await web3.eth.getBlock(blockNumber, true);

    if (block && block.transactions) {
      for (const tx of block.transactions) {
        await processTransaction(tx);
      }
    }

    const events = await usdtContract.getPastEvents("allEvents", {
      fromBlock: blockNumber,
      toBlock: blockNumber,
    });

    console.log("Events array", events);

    for (const event of events) {
      const transactionData = {
        //@ts-ignore
        transactionHash: event.transactionHash,
        //@ts-ignore
        blockNumber: event.blockNumber,
        //@ts-ignore
        from: event.returnValues.from,
        //@ts-ignore
        to: event.returnValues.to,
        value: parseFloat(
          //@ts-ignore
          web3.utils.fromWei(event.returnValues.value, "mwei")
        ).toFixed(6),
        tokenContract: USDT_CONTRACT_ADDRESS,
        //@ts-ignore
        event: event.event,
      };

      await validateTransaction(transactionData);
      await insertTransaction(transactionData);
      // console.log(`Event ${event.transactionHash} processed successfully.`);
    }
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error);
  }
};

export const getCurrentBlockNumber = async (): Promise<number> => {
  return Number(await web3.eth.getBlockNumber());
};
