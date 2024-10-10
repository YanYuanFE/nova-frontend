import { DEV_NODEURL } from '@/constants/config';
import { Provider } from 'starknet';

function getDevProvider() {
  const provider = new Provider({ nodeUrl: DEV_NODEURL });
  return provider;
}

export { getDevProvider };
