import { Button } from '../ui/button';
import { useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';
import { useContractData } from '@/hooks/useContractData';
import { shortenAddress } from '@/utils';
import { ExternalLink, Loader2 } from 'lucide-react';
import ConstructorCard from './components/constructor-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AccountCard } from './components/AccountCard';
import toast from 'react-hot-toast';
import Enviroment from './components/Enviroment';
import { useNetwork } from '@starknet-react/core';

type Status = 'start' | 'declare' | 'deploy' | 'done';

export const DeployCard = ({
  compileData
}: {
  compileData: {
    casmData: CompiledSierraCasm;
    sierraData: CompiledContract | string;
  };
}) => {
  const [env, setEnv] = useState<string>('wallet');
  const [contractAddress, setContractAddress] = useState<string>('');
  const { contractData } = useContractData({ compileData });
  const { account } = useAccountAndBalance(env);
  const [isDeclareing, setIsDeclareing] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { account, balance } = useAccountAndBalance(env);
  const [status, setStatus] = useState<Status>('start');
  const { chain } = useNetwork();
  console.log(account, balance, 'ccc');
  console.log('111contractData:', contractData);

  const handleDeclare = async () => {
    setIsDeclareing(true);
    console.log('ddd', contractData);
    await declare(account!, contractData);
    setIsDeclareing(false);
  };

  const handleDeploy = async (calldata: any[]) => {
    setIsDeploying(true);
    const res = await deploy(account!, contractData?.classHash, calldata);
    console.log('res:', res);
    if (res) {
      setContractAddress(res.contract_address[0]);
    }
    setIsDeploying(false);
  };

  const handleNetwork = (value: string) => {
    setEnv(value);
  };

  return (
    <div className="flex flex-col p-4 gap-6 h-[600px] overflow-y-auto">
      <div className="font-bold text-2xl">Deployment</div>
      <div className="space-y-2">
        <h3 className=" font-bold text-lg">Environment</h3>
        <div className="p-4 bg-neutral-500 shadow-lg rounded-lg w-full">
          <Select value={env} onValueChange={handleNetwork}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="devnet">Devnet</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4">
            <AccountCard env={env} account={account!} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className=" font-bold text-lg">Declare Contract</h3>
        <div className="p-4 bg-neutral-500 shadow-lg rounded-lg ">
          <Button disabled={isDeclareing} onClick={handleDeclare} className="w-full">
            {isDeclareing ? <Loader2 className="h-5 w-5 text-gray-300 animate-spin" /> : <span>Declare</span>}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className=" font-bold text-lg">Deploy Contract</h3>
        <ConstructorCard abi={contractData?.abi} onDeploy={handleDeploy} isDeploying={isDeploying} />
      </div>
      {contractAddress ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Deployed Contract Address</h3>
          <div className="flex items-center gap-2">
            {shortenAddress(contractAddress)}
            <span
              className="cursor-pointer"
              onClick={() => {
                window.open(`https://space-abi.vercel.app/${chain.network}/${contractAddress}`, '_blank');
              }}
            >
              <ExternalLink size={16} />
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
