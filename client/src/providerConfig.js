import { argentWallet, ledgerWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import { darkTheme, getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { sepolia } from 'wagmi/chains';

const { wallets } = getDefaultWallets();

export const walletConfig = getDefaultConfig({
  appName: 'WareWise',
  projectId: '88f595d1b268506c5d56cf25b3d3eabf',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [sepolia],
  ssr: true,
});

export const queryClient = new QueryClient();
export const walletTheme = darkTheme();
