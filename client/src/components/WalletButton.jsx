import { Button } from '@mui/material';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Button variant="contained" onClick={() => disconnect()}>
        Disconnect {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending || connectors.length === 0}
    >
      {isPending ? 'Connecting...' : 'Connect wallet'}
    </Button>
  );
}
