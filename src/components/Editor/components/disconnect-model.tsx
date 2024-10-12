import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { shortenAddress } from '@/utils';
import { useAccount, useDisconnect } from '@starknet-react/core';
import toast from 'react-hot-toast';
import { ClipboardCopy, LogOut } from 'lucide-react';

export function DisConnectModel() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const handleCopy = () => {
    navigator.clipboard.writeText(address!);
    toast.success('Copied to clipboard!');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{shortenAddress(address)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white rounded-lg shadow-lg">
        <DropdownMenuItem
          onClick={handleCopy}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 border-gray-200" />
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
