import PropTypes from 'prop-types';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { queryClient, walletConfig } from './providerConfig';

export function Providers({ children }) {
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
