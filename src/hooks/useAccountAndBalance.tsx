import { getDevBanlance, produceDevAccount } from '@/utils/account';
import { useAccount } from '@starknet-react/core';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AccountInterface } from 'starknet';

interface AccountData {
  account: AccountInterface | undefined;
  balance: string;
}

export const useAccountAndBalance = (env: string) => {
  const { account: walletAccount } = useAccount();

  const { data }: UseQueryResult<AccountData, Error> = useQuery<AccountData, Error>({
    queryKey: [env,walletAccount],
    queryFn: async (): Promise<AccountData> => {
      if (env === 'devnet') {
        const devAcc = await produceDevAccount();
        console.log('devAcc:', devAcc);
        const devBalance = await getDevBanlance(devAcc!.address);
        return { account: devAcc!, balance: devBalance };
      } else if (env === 'wallet') {
        return { account: walletAccount, balance: '' };
      }
      return { account: undefined, balance: '' };
    },
    initialData: { account: undefined, balance: '' }
  });

  console.log('qureydata:', data);

  return { account: data?.account, balance: data?.balance };
};
