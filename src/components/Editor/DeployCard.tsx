import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';
import { useContractData } from '@/hooks/useContractData';
import { shortenAddress } from '@/utils';
import { ExternalLink } from 'lucide-react';
import ConstructorCard from './components/constructor-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AccountCard } from './components/AccountCard';
import { useNetwork } from '@starknet-react/core';
import toast from 'react-hot-toast';

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
  const [isDeclaring, setIsDeclaring] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { account } = useAccountAndBalance(env);
  const { chain } = useNetwork();

  useEffect(() => {
    console.log('Updated isDeclareing:', isDeclaring);
  }, [isDeclaring]);

  const handleDeclare = async () => {
    if (!account) {
      toast.error('Please choose account first');
      return;
    }
    setIsDeclaring(true);
    try {
      const res = await declare(account!, contractData);
      console.log('txReceipt:', res);
      toast.success('Declare success');
    } catch (error) {
      toast.error('Declare failed');
    } finally {
      setIsDeclaring(false);
    }
  };

  const handleDeploy = async (calldata: any[]) => {
    setIsDeploying(true);
    try {
      const res = await deploy(account!, contractData?.classHash, calldata);
      console.log('deploy res:', res);
      if (res) {
        setContractAddress(res.contract_address[0]);
      }

      toast.success('Deploy success');
    } catch (error) {
      toast.error('Deploy failed');
    } finally {
      setIsDeploying(false);
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
        <div className="p-4 bg-card shadow-lg rounded-lg w-full">
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
        <div className="p-4 bg-card shadow-lg rounded-lg ">
          <Button loading={isDeclaring} onClick={handleDeclare} className="w-full">
            Declare
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
