'use client';
import React from 'react';

import { mainnet, sepolia } from '@starknet-react/chains';
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  InjectedConnector,
  infuraProvider
} from '@starknet-react/core';
import { ENVS } from '@/constants/config';

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
      new InjectedConnector({
        options: { id: 'okxwallet' }
      })
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: 'onlyIfNoConnectors',
    // Randomize the order of the connectors.
    order: 'random'
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={infuraProvider({apiKey: ENVS.INFURA_API_KEY})}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
