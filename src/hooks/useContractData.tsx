import { Contract } from '@/utils/contract';
import { useEffect, useState } from 'react';
import { hash } from 'starknet';

export const useContractData = ({ compileData }: { compileData: any }) => {
  const [contractData, setContractData] = useState<Contract>({
    name: '',
    sierra: compileData?.sierraData,
    casm: compileData?.casmData,
    classHash: '',
    compiledClassHash: '',
    sierraClassHash: '',
    abi: [],
    address: ''
  });

  useEffect(() => {
    try {
      const classHash = hash.computeContractClassHash(compileData?.sierraData);
      const compiledClassHash = hash.computeCompiledClassHash(compileData?.casmData);

      setContractData((prve) => {
        return {
          ...prve,
          sierra: compileData?.sierraData,
          casm: compileData?.casmData,
          classHash: classHash,
          compiledClassHash: compiledClassHash
        };
      });
    } catch (error: any) {
      console.log('setContractData error:', error?.message);
    }
  }, [compileData]);

  return { contractData };
};
