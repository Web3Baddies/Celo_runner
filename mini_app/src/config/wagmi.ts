/**
 * Wagmi configuration with Farcaster MiniApp connector
 * Supports both Celo Mainnet (default) and Celo Sepolia Testnet
 */

import { http, createConfig } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  transports: {
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
  connectors: [miniAppConnector()],
  // Default to mainnet
  ssr: false,
});

// Export default chain (mainnet)
export const defaultChain = celo;
