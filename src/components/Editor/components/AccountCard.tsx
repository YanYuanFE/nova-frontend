import { AccountInterface } from 'starknet';
import { DisConnectModel } from './disconnect-model';
import ConnectModel from './connect-model';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';

export const AccountCard = ({
  env,
  account,
  onStatus
}: {
  env: string;
  account: AccountInterface | undefined;
  onStatus: any;
}) => {
  useCallback(() => {
    console.log('account', account);
    if (account) {
      onStatus('declare');
    } else {
      onStatus('start');
    }
  }, [account]);
  return (
    <div className="space-y-2">
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
      </div>
    </div>
  );
};
