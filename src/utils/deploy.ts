import { AccountInterface, CompiledContract, BigNumberish } from 'starknet';

async function declare(
  account: AccountInterface | null,
  contract: CompiledContract | string,
  classHash: string,
  compiledClassHash: string
) {
  try {
    await account?.declare({
      contract: contract,
      classHash: classHash,
      compiledClassHash: compiledClassHash
    });
  } catch (error) {
    console.log('declare error:', error);
  }
}

async function deploy(account: AccountInterface | null, classHash: string, calldata: BigNumberish[]) {
  try {
    await account?.deploy({
      classHash: classHash,
      constructorCalldata: calldata
    });
  } catch (error) {
    console.log('deploy error:', error);
  }
}

export { declare, deploy };
