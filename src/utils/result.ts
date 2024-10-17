import { shortString } from 'starknet';
import { decimalToHex } from './abi';

const interactSwitchRes = (type: string, value: string) => {
  if (type === 'core::felt252') {
    if (!isValidShortStringInput(value)) return value;

    return shortString.decodeShortString(value);
  }
  if (type === 'core::starknet::contract_address::ContractAddress') {
    return decimalToHex(value);
  }
  return value;
};

const isValidShortStringInput = (input: string): boolean => {
  const cleanedInput = input.toLowerCase().replace(/^0x/, '');

  const isValidHex = /^[0-9a-f]+$/.test(cleanedInput);
  const isValidDecimal = /^\d+$/.test(cleanedInput);

  if (!isValidHex && !isValidDecimal) {
    return false;
  }

  let bigIntValue: bigint;
  try {
    bigIntValue = isValidHex ? BigInt(`0x${cleanedInput}`) : BigInt(cleanedInput);
  } catch {
    return false;
  }

  const max248BitNumber = BigInt('0x' + 'f'.repeat(62));
  if (bigIntValue < 0 || bigIntValue > max248BitNumber) {
    return false;
  }

  const hexString = bigIntValue.toString(16).padStart(2, '0');
  const decodedString = Buffer.from(hexString, 'hex').toString('utf8');

  return decodedString.length <= 31;
};

export { interactSwitchRes };
