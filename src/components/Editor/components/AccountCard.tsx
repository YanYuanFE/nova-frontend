import { DisConnectModal } from './disconnect-modal';
import ConnectModel from './connect-modal';
import { useQuery } from '@tanstack/react-query';
import { produceDevAccountList } from '@/utils/account';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllAccounts } from '@/hooks/useAccountProvider';
import { shortenAddress } from '@/utils';

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
    },
    staleTime: 1000 * 60 * 60 * 24
  });

  const handleChange = (value: string) => {
    const selectedAccount = devAccList?.find((acc: any) => acc.account.address === value);
    setDevAccount(selectedAccount?.account);
  };

  if (isLoading) return <div>Loading DevAccount...</div>;

  return (
    <div className="space-y-2 w-full">
      <h3 className="text-sm font-medium">Connect Account</h3>
      <div className="flex flex-row gap-2 items-center w-full">
        {env === 'devnet' ? (
          <Select value={devAccount?.address} onValueChange={handleChange}>
            <SelectTrigger className="rounded-xl w-96">
              <SelectValue placeholder="Select Devnet Account" />
            </SelectTrigger>
            <SelectContent>
              {devAccList?.map((acc: any, index: any) => (
                <SelectItem value={acc.account.address} key={index}>
                  {shortenAddress(acc?.account.address)}
                  {` (${acc?.balance} ETH)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : walletAccount ? (
          <DisConnectModal />
        ) : (
          <ConnectModel />
        )}
      </div>
    </div>
  );
};
