import { hash, AccountInterface, CompiledSierraCasm, CompiledContract } from 'starknet';

async function doDeclare(
  account: AccountInterface | null,
  sierraData: CompiledContract | string,
  casmData: CompiledSierraCasm
) {
  console.log('111 account:', account, 'sierraData:', sierraData, 'casmData:', casmData);
  const classHash = hash.computeContractClassHash(sierraData); //sierraFile?
  let compiledClassHash = '';
  if (casmData) {
    compiledClassHash = hash.computeCompiledClassHash(casmData);
  }

  console.log('222 classHash:', classHash, 'compiledClassHash:', compiledClassHash);

  try {
    const res = await account?.declare({
      contract: sierraData,
      classHash: classHash,
      casm: casmData,
      compiledClassHash: compiledClassHash
    });

    console.log('declare res:', JSON.stringify(res));
  } catch (error) {
    console.log('declare error:', error);
  }
}

async function doDeploy(account: AccountInterface | null, sierraData: CompiledContract | string) {
  const classHash = hash.computeContractClassHash(sierraData);

  const constructorCalldata: [] = []; //TODO
  await account?.deploy({
    classHash,
    constructorCalldata
  });
}

export { doDeclare, doDeploy };
