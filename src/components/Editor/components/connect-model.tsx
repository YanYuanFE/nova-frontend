import { useAccount, useConnect } from '@starknet-react/core';
import { useStarknetkitConnectModal } from 'starknetkit';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DisConnectModel } from './disconnect-model';
import { Button } from '@/components/ui/button';

export default function ConnectModel() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
    modalTheme: 'light'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const { connector } = await starknetkitConnectModal();

      await connect({ connector });
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  if (address) {
    return <DisConnectModel />;
  }

  return (
    <>
      {isLoading ? (
        <Button disabled className="rounded-xl opacity-50 cursor-not-allowed">
          Connecting...
        </Button>
      ) : (
        <Button onClick={handleConnect} className="rounded-xl">
          Connect Wallet
        </Button>
      )}
    </>
  );
}
