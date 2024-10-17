import { ContractAddressType } from '@/types/contract';
import { Abi, Contract } from 'starknet';

const getContractAbi = async (address: string, rpcProvider: any) => {
  try {
    const type = await getContractType(address, rpcProvider);
    const normalAbi = await getNormalAbi(address, rpcProvider);
    console.log('ContractType:', type);
    console.log('ContractAbi:', normalAbi);
    if (type === 'Normal') {
      return normalAbi;
    } else if (type === 'Proxy') {
      const classHash = await getImplementedClassHash(normalAbi, address, rpcProvider);
      const classAbi = getImplementedClassAbi(classHash, rpcProvider);
      return classAbi;
    }
  } catch (error) {
    console.log('getContractAbi error', error);
  }
};

const getNormalAbi = async (address: string, rpcProvider: any): Promise<Abi> => {
  const { abi } = await rpcProvider.getClassAt(address);
  return abi;
};

const getImplementedClassHash = async (abi: Abi, contractAddress: string, rpcProvider: any): Promise<string> => {
  const getImplementationFn = abi.find((i: any) => isImplementationHashFunction(i.name) && i.type === 'function');

  console.log('getImplementationFn:', getImplementationFn);

  const contract = new Contract(abi, contractAddress, rpcProvider);

  const res = await contract.call(getImplementationFn.name, getImplementationFn.inputs);

  const implementationValue = (res as any)?.implementation;
  const finalRes = implementationValue ? decimalToHex(implementationValue) : '';
  return finalRes;
};

const getImplementedClassAbi = async (classHash: string, rpcProvider: any): Promise<Abi> => {
  const { abi } = await rpcProvider.getClassByHash(classHash);
  return abi;
};

const getContractType = async (address: string, rpcProvider: any): Promise<ContractAddressType> => {
  const { abi } = await rpcProvider.getClassAt(address);
  const getImplementationFn = abi.find((i: any) => isImplementationHashFunction(i.name) && i.type === 'function');
  return getImplementationFn ? 'Proxy' : 'Normal';
};

const isImplementationHashFunction = (functionName: string): boolean => {
  const regex = /get.*implementation.*hash/i;
  return regex.test(functionName);
};

const decimalToHex = (decimal: string): string => {
  const bigIntValue = BigInt(decimal);
  let hexString = bigIntValue.toString(16);
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }

  return '0x' + hexString;
};

export { getContractAbi, decimalToHex };
