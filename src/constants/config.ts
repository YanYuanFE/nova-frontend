import { mainnet, sepolia } from "@starknet-react/chains";

export const ENVS = {
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  INFURA_API_KEY: '8d11ac6606954ccc8b0ddeb6c132e24b'
};


export const chainMap = {
  mainnet: {
    chain: mainnet,
    rpcUrl:
      'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/WBnHOmwS6g5-z7JgnqsrxTi8GL9H1YBk',
  },

  sepolia: {
    chain: sepolia,
    rpcUrl:
      'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/WBnHOmwS6g5-z7JgnqsrxTi8GL9H1YBk',
  },

  devnet:{
    chain:{
      name: 'devnet'
    },
    rpcUrl: 'https://devnet.norvos.xyz/'
  }
}

