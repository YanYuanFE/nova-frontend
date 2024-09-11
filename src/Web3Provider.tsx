import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {http, WagmiProvider} from 'wagmi';
import {mainnet} from 'wagmi/chains';
import { ReactNode } from 'react';
import { ENVS } from '@/constants/config.ts';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const chains = [mainnet];

export const wagmiConfig = getDefaultConfig({
    appName: 'Dapp Start',
    projectId: ENVS.WALLET_CONNECT_PROJECT_ID,
    chains: chains as any,
    transports: {
        [mainnet.id]: http(),
    },
})

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
