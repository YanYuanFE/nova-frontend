type CallbackReturnType = {
  functionName: string;
  stateMutability: string;
  inputs: any[];
  outputs: any[];
};

type ContractAddressType = 'Proxy' | 'Normal';

type FunctionStateMutability = 'view' | 'external';

export { type CallbackReturnType, type ContractAddressType, type FunctionStateMutability };
