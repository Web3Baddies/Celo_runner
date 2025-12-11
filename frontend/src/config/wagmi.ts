import { http, createConfig } from 'wagmi';
import { celoAlfajores, celoSepolia, celo} from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { Celo_Mainnet } from './contracts';

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
