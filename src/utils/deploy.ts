import { AccountInterface, BigNumberish } from 'starknet';
import { Contract } from './contract';
import toast from 'react-hot-toast';

const declare = async (account: AccountInterface | null, contractData: Contract) => {
  try {
    const res = await account?.declare({
      contract: contractData?.sierra,
      classHash: contractData?.classHash,
      casm: contractData?.casm,
      compiledClassHash: contractData?.compiledClassHash
    });

    const txReceipt = await account?.waitForTransaction(res!.transaction_hash);
    console.log(txReceipt, 'txReceipt');
    toast.success('Declare success');
  } catch (error) {
    toast.error('Declare failed');
  }
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
  try {
    const res = await account?.deploy({
      classHash: classHash,
      constructorCalldata: calldata
    });
    toast.success('Deploy success');
    return res;
  } catch (error) {
    toast.error('Deploy failed');
  }
};

export { declare, deploy };
