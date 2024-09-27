import { getDevBanlance, produceDevAccount } from '@/utils/deploy';
import { useAccount } from '@starknet-react/core';
import { useMemo, useState } from 'react';
import { AccountInterface } from 'starknet';

export const useAccountAndBalance = (network: string) => {
  const { account: sepoliaAccount } = useAccount();
  const [account, setAccount] = useState<AccountInterface>();
  const [balance, setBalance] = useState<string>();

  useMemo(() => {
    const setupAccount = async () => {
      if (network === 'devnet') {
        const devAcc = await produceDevAccount();
        const devBalance = await getDevBanlance(devAcc!.address);
        setAccount(devAcc!);
        setBalance(devBalance);
      } else if (network === 'sepolia') {
        setAccount(sepoliaAccount);
        setBalance('');
      }
    };

    setupAccount();
  }, [network, sepoliaAccount]);

  return { account, balance };
};
