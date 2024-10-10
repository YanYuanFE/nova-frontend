import { AccountInterface, CompiledContract, BigNumberish } from 'starknet';

async function declare(
  account: AccountInterface | null,
  contract: CompiledContract | string,
  classHash: string,
  compiledClassHash: string,
  casm: any
) {
  try {
    await account?.declare({
      contract: contract,
      classHash: classHash,
      compiledClassHash: compiledClassHash,
      casm: casm
    });
  } catch (error) {
    console.log('declare error:', error);
  }
}

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
  return await account?.deploy({
    classHash: classHash,
    constructorCalldata: calldata
  });
};

export { declare, deploy };
