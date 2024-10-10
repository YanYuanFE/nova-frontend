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
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Connect Account</h3>
      <div className="flex flex-row gap-2 items-center">
        {!account ? <Input value={''} /> : <ConnectModal />}
        <span>balance: {balance}</span>
      </div>
    </div>
  );
};
