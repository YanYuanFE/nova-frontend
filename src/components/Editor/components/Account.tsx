import ConnectModal from '@/components/ConnectModal';
import { Input } from '@/components/ui/input';
import { AccountInterface } from 'starknet';

export const AccountBalanceDisplay = ({
  account,
  balance
}: {
  account: AccountInterface | undefined;
  balance: string;
}) => {
  return (
    <>
      <div className="font-bold mb-2">Account</div>
      {account ? <Input value={account?.address} /> : <ConnectModal />}
      <span>balance: {balance}</span>
    </>
  );
};
