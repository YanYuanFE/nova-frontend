import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { AccountBalanceDisplay } from './components/Account';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';
import { ConstructorForm } from 'starknet-abi-forms';
import { useContractData } from '@/hooks/useContractData';

export const DeployCard = ({
  compileData
}: {
  compileData: {
    casmData: CompiledSierraCasm;
    sierraData: CompiledContract | string;
  };
}) => {
  console.log('000compileData:', compileData);
  const { contractData } = useContractData({ compileData });
  const [network, setNetwork] = useState('devnet');
  const { account, balance } = useAccountAndBalance(network);

  const handleNetwork = (value: string) => {
    setNetwork(value);
  };

  const handleDeclare = async () => {
    await declare(account!, contractData?.sierra, contractData?.classHash, contractData?.compiledClassHash);
  };

  const handleDeploy = async () => {
    await deploy(account!, contractData?.classHash, []);
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <div className="font-bold">Deployment</div>
      <div className="">
        <div className="font-bold mb-2">Environment</div>
        <Select value={network} onValueChange={handleNetwork}>
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue placeholder="Select Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devnet">Devnet</SelectItem>
            <SelectItem value="sepolia">Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <AccountBalanceDisplay account={account!} balance={balance!} />
      </div>
      <div className="">
        <div className="space-y-6">
          <div>
            <Button onClick={handleDeclare}>Declare</Button>
          </div>
          <div>
            <ConstructorForm abi={null} callBackFn={handleDeploy} />
          </div>
        </div>
      </div>
    </div>
  );
};
