import { validateTransaction } from "./validator";
import { insertTransaction } from "../database/insertion";
import Web3 from "web3";

const web3 = new Web3();
const USDT_CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

export const processTransaction = async (tx: any) => {
  try {
    const { hash: transactionHash, blockNumber, from, to, value, event } = tx;

    const usdtValue = parseFloat(web3.utils.fromWei(value, "mwei")).toFixed(6);

    const transactionData = {
      transactionHash,
      blockNumber,
      from,
      to,
      value: usdtValue,
      tokenContract: USDT_CONTRACT_ADDRESS,
      event: event,
    };

    await validateTransaction(transactionData);
    await insertTransaction(transactionData);
    console.log(`Transaction ${transactionHash} saved successfully.`);
  } catch (error) {
    console.error(
      `Failed to process transaction ${tx.transactionHash}:`,
      error
    );
  }
};
