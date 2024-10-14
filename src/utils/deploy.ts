import { AccountInterface, BigNumberish } from 'starknet';
import { Contract } from './contract';

const declare = async (account: AccountInterface | null, contractData: Contract) => {
  const res = await account?.declare({
    contract: contractData?.sierra,
    casm: contractData?.casm
    // classHash: contractData?.classHash,
    // compiledClassHash: contractData?.compiledClassHash
  });

  const txReceipt = await account?.waitForTransaction(res!.transaction_hash);
  return txReceipt;
};

const deploy = async (
  account: AccountInterface | null,
  classHash: string,
  calldata: BigNumberish[]
): Promise<
  | {
      contract_address: Array<string>;
      transaction_hash: string;
    }
  | undefined
> => {
  console.log('deploying contract with calldata:', calldata);
  const res = await account?.deploy({
    classHash: classHash,
    constructorCalldata: calldata
  });
  return res;
};

export { declare, deploy };
