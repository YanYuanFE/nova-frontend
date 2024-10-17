import { DEV_NODEURL } from '@/constants/config';
import { RpcProvider } from 'starknet';

function getDevProvider() {
  const provider = new RpcProvider({ nodeUrl: DEV_NODEURL });
  return provider;
}

export { getDevProvider };
