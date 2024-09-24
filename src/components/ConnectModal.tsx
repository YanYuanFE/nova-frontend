import { useAccount, useConnect } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { useStarknetkitConnectModal } from "starknetkit";
import { shortenAddress } from '@/utils';


export default function ConnectModal() {
  const { account } = useAccount()
  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any
  })
 
  const connectWallet = async() => {
    const { connector } = await starknetkitConnectModal()
    await connect({ connector: connector as any })
  }

  
  return (
    <Button onClick={connectWallet}>{account ? shortenAddress(account.address) : 'Connect Wallet'}</Button>
  );
}
