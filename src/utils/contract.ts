import {
  type CairoAssembly,
  type InvokeFunctionResponse,
  type AccountInterface,
  BigNumberish,
  CompiledContract
} from 'starknet';

interface Contract {
  name: string;
  compiledClassHash: string;
  classHash: string;
  sierraClassHash: string;
  sierra: CompiledContract | string;
  casm: CairoAssembly;
  abi: Abi;
  address: string;
}

interface Input {
  name: string;
  type: string;
}

type Output = Input;

export type CallDataObj = BigNumberish[] | CallDataObj[];

interface AbiElement {
  type: string;
  name: string;
  inputs: Input[];
  outputs?: Output[];
  state_mutability?: string;
  calldata?: CallDataObj[];
  items?: AbiElement[];
  callFunction?: (account: AccountInterface) => Promise<InvokeFunctionResponse>;
}

type Abi = AbiElement[];

type Contracts = Record<string, Contract>;

type CallDataObject = Record<
  string,
  {
    name: string;
    value: string;
    type: string | undefined;
  }
>;

// TODO: felt252
enum ParameterType {
  FieldElement = 'felt',
  VarFelt = 'felt*',
  String = 'string',
  Complex = 'complex',
  Uint256 = 'Uint256'
}

interface ParameterMetadata {
  name: string;
  type: `${ParameterType}`;
  names?: string[];
  structName?: string;
  propertyCount?: number;
}

interface FunctionReturnType {
  [key: string]: string | number | string[] | FunctionReturnType[];
}

export type {
  Abi,
  AbiElement,
  CallDataObject,
  Contract,
  Contracts,
  FunctionReturnType,
  Input,
  Output,
  ParameterMetadata
};

function getConstructor(abi: Abi) {
  if (!abi) return null;
  return abi.find((item) => item.name === 'constructor') as AbiElement;
}
export { ParameterType, getConstructor };
