import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { AccountBalanceDisplay } from './components/Account';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';
import { ConstructorForm } from 'starknet-abi-forms';
import { useContractData } from '@/hooks/useContractData';
import { shortenAddress } from '@/utils';
import { ExternalLink } from 'lucide-react';
import { useNetwork } from '@starknet-react/core';

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
  const [env, setEnv] = useState('wallet');
  const { account, balance } = useAccountAndBalance(env);
  const [contractAddress, setContractAddress] = useState<string>('');
  const { chain } = useNetwork();

  const handleNetwork = (value: string) => {
    setEnv(value);
  };

  const handleDeclare = async () => {
    console.log('ddd', contractData);
    await declare(account!, contractData?.sierra, contractData?.classHash, contractData?.compiledClassHash, compileData?.casmData);
  };

  const handleDeploy = async () => {
    const res =await deploy(account!, contractData?.classHash, []);
    console.log('res:', res);
    if (res) {
      setContractAddress(res.contract_address[0]);
    }
  };

  console.log('chain:', chain);

  return (
    <div className="flex flex-col p-4 gap-6">
      <div className="font-bold">Deployment</div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Environment</div>
        <Select value={env} onValueChange={handleNetwork}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devnet">Devnet</SelectItem>
            <SelectItem value="wallet">Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <AccountBalanceDisplay account={account!} balance={balance!} />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Declare Contract</h3>
        <Button onClick={handleDeclare} className='w-full'>Declare</Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Deploy Contract</h3>
        <ConstructorForm abi={(compileData?.sierraData as any)?.abi} callBackFn={handleDeploy} />
      </div>
      {
        contractAddress ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Deployed Contract Address</h3>
            <div className="flex items-center gap-2">
              {shortenAddress(contractAddress)} <span className="cursor-pointer" onClick={() => {
                window.open(`https://space-abi.vercel.app/${chain.network}/${contractAddress}`, '_blank');
              }}>
              <ExternalLink size={16} />
              </span>
            </div>
          </div>
        ) : null
      }
    </div>
  );
};
