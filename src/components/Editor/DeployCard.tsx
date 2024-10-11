import { Button } from '../ui/button';
import { useState } from 'react';
import { declare, deploy } from '@/utils/deploy';
import { useAccountAndBalance } from '@/hooks/useAccountAndBalance';
import { CompiledContract, CompiledSierraCasm } from 'starknet';
import { useContractData } from '@/hooks/useContractData';
import { shortenAddress } from '@/utils';
import { ExternalLink } from 'lucide-react';
import ConstructorCard from './components/constructor-card';
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
  const { account, balance } = useAccountAndBalance(env);
  const [status, setStatus] = useState<Status>('start');
  const { chain } = useNetwork();
  console.log(account, balance, 'ccc');
  console.log('111contractData:', contractData);

  const handleDeclare = async () => {
    console.log('ddd', contractData);
    await declare(
      account!,
      contractData?.sierra,
      contractData?.classHash,
      contractData?.casm,
      contractData?.compiledClassHash
    );

    setStatus('deploy');
  };

  const handleDeploy = async (calldata: any[]) => {
    const res = await deploy(account!, contractData?.classHash, calldata);
    console.log('res:', res);
    if (res) {
      setContractAddress(res.contract_address[0]);
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6 h-[600px] overflow-y-auto">
      <div className="font-bold text-2xl">Deployment</div>
      <div className="space-y-">
        <h3 className=" font-bold text-lg">1、Environment</h3>
        <Enviroment account={account!} balance={balance!} env={env} setEnv={setEnv} setStatus={setStatus} />
      </div>
      <div className="space-y-2">
        <h3 className=" font-bold text-lg">2、Declare Contract</h3>
        <div className="p-4 bg-neutral-500 shadow-lg rounded-lg ">
          <Button onClick={handleDeclare} className="w-full" disabled={status !== 'declare'}>
            Declare
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className=" font-bold text-lg">3、Deploy Contract</h3>
        <ConstructorCard abi={contractData?.abi} onDeploy={handleDeploy} status={status} />
      </div>
      {contractAddress ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Deployed Contract Address</h3>
          <div className="flex items-center gap-2">
            {shortenAddress(contractAddress)}{' '}
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
