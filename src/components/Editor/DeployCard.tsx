import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { AccountInterface, CompiledContract, CompiledSierraCasm, extractContractHashes } from 'starknet';
import { useContractData } from '@/hooks/useContractData';
import {  X } from 'lucide-react';
import ConstructorCard from './components/constructor-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AccountCard } from './components/AccountCard';
import { useNetwork } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { useAllAccounts } from '@/hooks/useAccountProvider';
import { ScrollArea } from '../ui/scroll-area';
import FunctionForm from './components/FunctionForm';

export const DeployCard = ({
  compileData,
  onClose
}: {
  compileData: {
    casmData: CompiledSierraCasm;
    sierraData: CompiledContract | string;
  };
  onClose: () => void;
}) => {
  const [env, setEnv] = useState<string>('wallet');
  const [account, setAccount] = useState<AccountInterface | undefined>(undefined);
  const [contractAddress, setContractAddress] = useState<string>('');
  const { contractData } = useContractData({ compileData });
  const [isDeclaring, setIsDeclaring] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { walletAccount, devAccount } = useAllAccounts();
  const { chain } = useNetwork();
  const [classHash, setClassHash] = useState<string>('');

  useEffect(() => {
    switch (env) {
      case 'wallet':
        setAccount(walletAccount);
        break;
      case 'devnet':
        setAccount(devAccount);
        break;
    }
  }, [env, account, walletAccount, devAccount]);

  const handleDeclare = async () => {
    if (!account) {
      toast.error('Please choose account first');
      return;
    }

    console.log('selectAccount:', account);
    setIsDeclaring(true);
    const { classHash } = extractContractHashes({
      contract: contractData?.sierra,
      casm: compileData?.casmData
    });
    try {
      try {
        console.log('contractHashes:', classHash);
        const classRes = await account.getClassByHash(classHash);
        console.log('Class already exists', classRes);
        if (classRes) {
          setClassHash(classHash);
          toast.success('Contract has been declared');
        }
      } catch (error) {
        const res = await declare(account!, contractData);
        console.log('txReceipt:', res);
        setClassHash(contractData?.classHash);
        toast.success('Declare success');
        // toast.error('Declare failed');
      }
    } catch (error: any) {
      console.log('declare error:', error?.message);
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
    <ScrollArea className="h-[calc(100vh-44px)]">
      <div className="flex flex-col p-4 gap-6 max-w-[450px]">
        <div className="flex items-center justify-between">
          <div className="font-bold text-2xl">Deployment</div>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
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
              <AccountCard env={env} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className=" font-bold text-lg">Declare Contract</h3>
          <div className="p-4 bg-card shadow-lg rounded-lg">
            <Button loading={isDeclaring} onClick={handleDeclare} className="w-full">
              Declare
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className=" font-bold text-lg">Deploy Contract</h3>
          <ConstructorCard
            abi={contractData?.abi}
            onDeploy={handleDeploy}
            isDeploying={isDeploying}
            classHash={classHash}
          />
        </div>
        {contractAddress ? (
          <FunctionForm contractAddress={contractAddress} account={account} network={env === 'devnet' ? 'devnet' : chain.network} />
        ) : null}
      </div>
    </ScrollArea>
  );
};
