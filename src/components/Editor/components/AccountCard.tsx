import { AccountInterface } from 'starknet';
import { DisConnectModel } from './disconnect-model';
import ConnectModel from './connect-model';
import { useQuery } from '@tanstack/react-query';
import { produceDevAccountList } from '@/utils/account';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export const AccountCard = ({ env, account }: { env: string; account: AccountInterface | undefined }) => {
  const [devAcc, setDevAcc] = useState<AccountInterface | undefined>(account);

  const { data: devAccList, isLoading } = useQuery({
    queryKey: [env],
    queryFn: async () => {
      if (env === 'devnet') {
        const res = await produceDevAccountList();
        return res;
      }
      return [];
    }
  });

  console.log('000 devAccList:', devAccList);

  const handleChange = (value: string) => {
    const selectedAccount = devAccList?.find((acc) => acc.address === value);
    setDevAcc(selectedAccount);
  };

  if (isLoading) return <div>Loading DevAccount...</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Connect Account</h3>
      <div className="flex flex-row gap-2 items-center">
        {env === 'devnet' ? (
          <Select value={devAcc?.address} onValueChange={handleChange}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select Devnet Account" />
            </SelectTrigger>
            <SelectContent>
              {devAccList?.map((acc, index) => (
                <SelectItem value={acc.address} key={index}>
                  {acc.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : account ? (
          <DisConnectModel />
        ) : (
          <ConnectModel />
        )}
      </div>
    </div>
  );
};
