import { AccountInterface } from 'starknet';
import { DisConnectModel } from './disconnect-model';
import ConnectModel from './connect-model';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

export const AccountCard = ({
  env,
  account,
  balance,
  onStatus
}: {
  env: string;
  account: AccountInterface | undefined;
  balance: string;
  onStatus: any;
}) => {
  useEffect(() => {
    console.log('account', account);
    if (account) {
      onStatus('declare');
    } else {
      onStatus('start');
    }
  }, [account]);
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Connect Account</h3>
      <div className="flex flex-row gap-2 items-center">
        {account ? (
          env === 'devnet' ? (
            <Input readOnly value={account.address} />
          ) : (
            <DisConnectModel />
          )
        ) : (
          <ConnectModel />
        )}
        <span>balance: {balance}</span>
      </div>
    </div>
  );
};
