import { getDevBanlance, produceDevAccount } from '@/utils/account';
import { useAccount } from '@starknet-react/core';
import { useMemo, useState } from 'react';
import { AccountInterface } from 'starknet';

export const useAccountAndBalance = (env: string) => {
  const { account: walletAccount } = useAccount();
  const [account, setAccount] = useState<AccountInterface | null>();
  const [balance, setBalance] = useState<string>();

  useMemo(() => {
    const setupAccount = async () => {
      if (env === 'devnet') {
        const devAcc = await produceDevAccount();
        console.log('devAcc:', devAcc);
        const devBalance = await getDevBanlance(devAcc!.address);
        setAccount(devAcc!);
        setBalance(devBalance);
      } else if (env === 'wallet') {
        setAccount(walletAccount);
        setBalance('');
      }
    };

    setupAccount();
  }, [env, walletAccount]);

  return { account, balance };
};
