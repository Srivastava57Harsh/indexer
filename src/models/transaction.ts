import * as yup from "yup";

export const transactionSchema = yup.object({
  transactionHash: yup.string().required(),
  blockNumber: yup.number().required(),
  from: yup.string().required(),
  to: yup.string().required(),
  value: yup.string().required(),
  tokenContract: yup.string().required(),
});
