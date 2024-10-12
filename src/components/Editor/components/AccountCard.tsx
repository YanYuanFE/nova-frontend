import { DisConnectModel } from './disconnect-model';
import ConnectModel from './connect-model';
import { useQuery } from '@tanstack/react-query';
import { produceDevAccountList } from '@/utils/account';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllAccounts } from '@/hooks/useAccountProvider';

export const AccountCard = ({ env }: { env: string }) => {
  const { walletAccount, devAccount, setDevAccount } = useAllAccounts();

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

  const handleChange = (value: string) => {
    const selectedAccount = devAccList?.find((acc: any) => acc.address === value);
    setDevAccount(selectedAccount);
  };

  if (isLoading) return <div>Loading DevAccount...</div>;

  return (
    <div className="space-y-2 w-full">
      <h3 className="text-sm font-medium">Connect Account</h3>
      <div className="flex flex-row gap-2 items-center w-full">
        {env === 'devnet' ? (
          <Select value={devAccount?.address} onValueChange={handleChange}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select Devnet Account" />
            </SelectTrigger>
            <SelectContent>
              {devAccList?.map((acc: any, index: any) => (
                <SelectItem value={acc.address} key={index}>
                  {acc.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : walletAccount ? (
          <DisConnectModel />
        ) : (
          <ConnectModel />
        )}
      </div>
    </div>
  );
};
