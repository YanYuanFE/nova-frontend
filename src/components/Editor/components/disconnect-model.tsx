import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { shortenAddress } from '@/utils';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { LogOut } from 'lucide-react';

export function DisConnectModel() {
  const { disconnect } = useDisconnect();

  const { address } = useAccount();
  const shortAddr = shortenAddress(address);

  const buttonClasses =
    'font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={buttonClasses}>{shortAddr}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white rounded-full shadow-lg">
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="flex items-center px-4 py-2 text-sm text-red-600 rounded-full"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
