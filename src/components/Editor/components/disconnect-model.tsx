import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/utils';
import { useAccount, useConnect, useDisconnect, useNetwork } from '@starknet-react/core';
import { ClipboardCopy } from 'lucide-react';
import toast from 'react-hot-toast';

export function DisConnectModel() {
  const { disconnect } = useDisconnect();
  const { connector } = useConnect();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const handleCopy = () => {
    navigator.clipboard.writeText(address!);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div>
        <span className="inline-block font-semibold mr-3 ">{connector?.name}</span>
        <span>{chain?.name}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">{shortenAddress(address)}</span>
        <Button onClick={handleCopy} className="mr-2 bg-transparent hover:bg-transparent">
          <ClipboardCopy className="mr-2 h-4 w-4" />
        </Button>
      </div>
      <div className="w-full">
        <Button onClick={() => disconnect()} variant="outline" className="mr-2 w-full">
          Disconnect
        </Button>
      </div>
    </div>
  );
}
