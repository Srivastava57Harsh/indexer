import { validateTransaction } from "./validator";
import { insertTransaction } from "../database/insertion";

import Web3 from "web3";

const web3 = new Web3();

const USDT_CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

export const processTransaction = async (tx: any) => {
  if (tx.to && tx.to.toLowerCase() === USDT_CONTRACT_ADDRESS) {
    const methodID = tx.input.slice(0, 10); //TRAGET TRANSFER METHOD

    let value;

    if (methodID === "0xa9059cbb") {
      // TRANSFER METHOD
      const rawValue = `0x${tx.input.slice(74, 138)}`;
      value = web3.utils.hexToNumberString(rawValue);
      const usdtValue = (parseFloat(value) / 1e6).toFixed(6);
      value = usdtValue;
    } else {
      value = null;
    }

    const transactionData = {
      transactionHash: tx.hash,
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
      value: value || "0",
      tokenContract: tx.to,
      methodID: methodID,
    };

    try {
      await validateTransaction(transactionData);
      await insertTransaction(transactionData);
      console.log(`Transaction ${tx.hash} saved`);
    } catch (error) {
      console.error(`Failed to process transaction ${tx.hash}:`, error);
    }
  }
};
