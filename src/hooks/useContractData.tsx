import { Contract } from '@/utils/contract';
import { useMemo } from 'react';
import { hash } from 'starknet';

export const useContractData = ({ compileData }: { compileData: any }) => {
  const contractData = useMemo(() => {
    try {
      const classHash = hash.computeContractClassHash(compileData?.sierraData);
      const compiledClassHash = hash.computeCompiledClassHash(compileData?.casmData);

      return {
        name: '',
        sierra: compileData?.sierraData,
        casm: compileData?.casmData,
        classHash: classHash,
        compiledClassHash: compiledClassHash,
        sierraClassHash: '',
        abi: compileData?.sierraData?.abi,
        address: ''
      } as Contract;
    } catch (error: any) {
      console.log('setContractData error:', error?.message);
      return {} as Contract;
    }
  }, [compileData]);

  return { contractData };
};
