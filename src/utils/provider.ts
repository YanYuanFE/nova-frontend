import { chainMap } from '@/constants/config';
import { RpcProvider } from 'starknet';

// function getDevProvider() {
//   const provider = new RpcProvider({ nodeUrl: DEV_NODEURL });
//   return provider;
// }

const getRpcProvider = (network: string) => {
  const rpcProvider = new RpcProvider({
    nodeUrl: chainMap[network as keyof typeof chainMap]?.rpcUrl
  });
  return rpcProvider;
};

export { getRpcProvider };
