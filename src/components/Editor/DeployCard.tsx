import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { doDeclare, doDeploy } from '@/utils/deploy';
import { AccountBalanceDisplay } from './components/Account';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';

export const DeployCard = ({
  compileData
}: {
  compileData: {
    casmData: CompiledSierraCasm;
    sierraData: CompiledContract | string;
  };
}) => {
  console.log('000compileData:', compileData);
  const [network, setNetwork] = useState('devnet');
  const { account, balance } = useAccountAndBalance(network);

  const handleNetwork = (value: string) => {
    setNetwork(value);
  };

  const handleDeclare = () => {
    doDeclare(account!, compileData?.sierraData, compileData?.casmData);
  };

  const handleDeploy = () => {
    doDeploy(account!, compileData?.sierraData);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="m-6">
        <div className="font-bold mb-2">Entertainment</div>
        <Select value={network} onValueChange={handleNetwork}>
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue placeholder="Select Entertainment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devnet">Devnet</SelectItem>
            <SelectItem value="sepolia">Sepolia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="m-6">
        <AccountBalanceDisplay account={account!} balance={balance!} />
      </div>
      <div className="m-6">
        <div className="font-bold mb-2">Deployment</div>
        <div className="p-6 space-y-6">
          <div>
            <Button onClick={handleDeclare}>Declare</Button>
          </div>
          <div>
            <Button onClick={handleDeploy}>Deploy</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
