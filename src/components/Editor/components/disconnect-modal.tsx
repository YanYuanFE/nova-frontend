import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAccount, useBalance, useDisconnect } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { ChevronDown, ClipboardCopy, LogOut } from 'lucide-react';
import { shortenAddress } from '@/utils';
import { useEffect } from 'react';

export function DisConnectModal() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data, isLoading, isError, error } = useBalance({ address: address });

  useEffect(() => {
    console.log('address:', address);
    console.log('Loading:', isLoading);
    console.log('Error:', isError);
    console.log('Data:', data);
  }, [address, isLoading, isError, data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address!);
    toast.success('Copied to clipboard!');
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError && error) return <div>Error:{error?.message}</div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button type="button" className="flex justify-center items-center">
          <span className="flex-1 text-center overflow-hidden truncate">
            {shortenAddress(address!)}
            {` (${data?.formatted ? parseFloat(data.formatted).toFixed(2) : '0.00'} ${data?.symbol})`}
          </span>
          <ChevronDown className={'opacity-50 self-end pb-1'} size={19} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[264px] rounded-lg shadow-lg">
        <DropdownMenuItem onClick={handleCopy} className="flex items-center px-4 py-2 text-sm w-full">
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 border-gray-200 w-full" />
        <DropdownMenuItem onClick={() => disconnect()} className="flex items-center px-4 py-2 text-sm w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
