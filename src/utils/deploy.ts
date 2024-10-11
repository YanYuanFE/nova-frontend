import { AccountInterface, CompiledContract, BigNumberish } from 'starknet';

const declare = async (
  account: AccountInterface | null,
  contract: CompiledContract | string,
  classHash: string,
  casm: any,
  compiledClassHash: string
) => {
  try {
    await account?.declare({
      contract: contract,
      classHash: classHash,
      casm: casm,
      compiledClassHash: compiledClassHash
    });
  } catch (error) {
    console.log('declare error:', error);
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
    return await account?.deploy({
      classHash: classHash,
      constructorCalldata: calldata
    });
  } catch (error) {
    console.log('deploy error:', error);
  }
};

export { declare, deploy };
