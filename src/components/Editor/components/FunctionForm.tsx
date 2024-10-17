import { getContractAbi } from '@/utils/abi';
import { getFunctionList } from '@/utils/interact';
import { getRpcProvider } from '@/utils/provider';
import { useQuery } from '@tanstack/react-query';
import FunctionItem from './FunctionItem';
import { shortenAddress } from '@/utils';
import { ExternalLink } from 'lucide-react';

export default function FunctionForm({
  account,
  contractAddress,
  network
}: {
  account: any;
  contractAddress: string;
  network: string;
}) {
  const { data: functionsData, isLoading } = useQuery({
    queryKey: ['functions', contractAddress],
    queryFn: async () => {
      console.log('contractAddress:', contractAddress, 'network:', network);
      const rpcProvider = getRpcProvider(network);
      console.log('00000rpcProvider:', rpcProvider);
      const abi = await getContractAbi(contractAddress, rpcProvider);
      console.log('11111abi:', abi);
      const res = getFunctionList(abi);
      console.log('22222res:', res);
      return res;
    }
  });

  if (isLoading) {
    return <div>Loading Functions ...</div>;
  }
  return (
    <div className="space-y-2">
      <h3 className=" font-bold text-lg">Interact Contract</h3>
      <div className="p-4 bg-card shadow-lg rounded-lg">
        {functionsData?.map((fn: any, index: number) => {
          return (
            <FunctionItem
              key={index}
              fnMsg={fn}
              account={account}
              contractAddress={contractAddress}
              network={network}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {shortenAddress(contractAddress)}
        <span
          className="cursor-pointer"
          onClick={() => {
            window.open(`https://space-abi.vercel.app/${network}/${contractAddress}`, '_blank');
          }}
        >
          <ExternalLink size={16} />
        </span>
      </div>
    </div>
  );
}
