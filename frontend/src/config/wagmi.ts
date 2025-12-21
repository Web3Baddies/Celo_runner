/**
 * Wagmi configuration with support for Celo Mainnet (default) and Celo Sepolia Testnet
 */

import { http, createConfig } from 'wagmi';
import { celo, celoSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const config = createConfig({
  chains: [celo, celoSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
  // Default to mainnet
  ssr: false,
});

// Export default chain (mainnet)
export const defaultChain = celo;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
