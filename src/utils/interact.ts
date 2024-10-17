import { Abi, Contract } from 'starknet';
import { getRpcProvider } from './provider';
import { CallbackReturnType, FunctionStateMutability } from '@/types/contract';
import { getContractAbi } from './abi';
import toast from 'react-hot-toast';

const getFunctionList = (abi: Abi | undefined): any[] => {
  if (!abi) return [];

  const allFunctions = abi.flatMap((item: any) => {
    if (item.type === 'function') {
      return [item];
    } else if (item.type === 'interface') {
      return item?.items || [];
    } else {
      return [];
    }
  });

  const functions = allFunctions.filter((item: any) => item.type === 'function');
  console.log('getFunctionList', functions);
  return functions;
};

const read = async (value: CallbackReturnType, address: string, intearctNetwork: string) => {
  const rpcProvider = getRpcProvider(intearctNetwork);
  const abi = await getContractAbi(address, rpcProvider);
  const contract = new Contract(abi!, address, rpcProvider);

  const res = await contract.call(value.functionName, value.inputs);
  console.log(value.functionName, ' result:', res);
  const showRes = stringifyResult(res);
  return { type: value.outputs[0]?.type, value: showRes };
};

const write = async (value: CallbackReturnType, address: string, intearctNetwork: string, account?: any) => {
  const rpcProvider = getRpcProvider(intearctNetwork);
  const abi = await getContractAbi(address, rpcProvider);
  const contract = new Contract(abi!, address, rpcProvider);

  if (!account) {
    toast.error('Please connect your wallet');
    return;
  }

  contract.connect(account);
  const tx_res = await contract.invoke(value.functionName, value.inputs);
  const tx_hash = tx_res?.transaction_hash;

  const res = await rpcProvider.waitForTransaction(tx_hash);

  return res?.value;
};

const stringifyResult = (result: any) => {
  if (result === null || result === undefined) {
    return '';
  }
  if (typeof result === 'object') {
    return JSON.stringify(result, (_, value) => (typeof value === 'bigint' ? value.toString() : value));
  } else {
    return result.toString();
  }
};

const getStateMutability = (func: any): FunctionStateMutability => {
  if ('state_mutability' in func) {
    return (func as any).state_mutability as FunctionStateMutability;
  }
  if ('stateMutability' in func) {
    return (func as any).stateMutability as FunctionStateMutability;
  }
  return 'external';
};

export { read, write, getFunctionList, getStateMutability };
