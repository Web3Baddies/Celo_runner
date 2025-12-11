import { http, createConfig } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { Celo_Mainnet } from './contracts';

// Custom Celo Sepolia chain config
export const Celo_Mainnet = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'celo-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org/'],
    },
    public: {
      http: ['https://forno.celo.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://explorer.celo.org',
    },
  },
  testnet: true,
} as const;

// WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const config = createConfig({
  chains: [celoSepolia, celoAlfajores, Celo_Mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [celoSepolia.id]: http(),
    [celoAlfajores.id]: http(),
    [Celo_Mainnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
