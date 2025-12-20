/**
 * Farcaster MiniApp SDK utilities
 * Provides environment detection and SDK initialization helpers
 */

import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Check if the app is running inside a Farcaster MiniApp
 */
export function checkIsMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Check if Farcaster SDK is available
    return typeof sdk !== 'undefined' && !!sdk.wallet?.getEthereumProvider;
  } catch {
    return false;
  }
}

/**
 * Initialize the Farcaster SDK
 * Must be called after the app is fully loaded
 */
export async function initializeFarcasterSDK(): Promise<void> {
  try {
    if (checkIsMiniApp()) {
      // Call ready() to hide splash screen and display content
      await sdk.actions.ready();
    }
  } catch (error) {
    console.error("Failed to initialize Farcaster SDK:", error);
    // Continue execution even if SDK initialization fails
  }
}

/**
 * Get the Ethereum provider from Farcaster SDK
 * Returns null if not in MiniApp environment
 */
export function getFarcasterProvider() {
  if (!checkIsMiniApp()) {
    return null;
  }
  try {
    return sdk.wallet.getEthereumProvider();
  } catch (error) {
    console.error("Failed to get Farcaster provider:", error);
    return null;
  }
}

/**
 * Network detection utilities
 */
export const FARCASTER_NETWORKS = {
  MAINNET: 42220, // Celo Mainnet
  TESTNET: 11142220, // Celo Sepolia Testnet
} as const;

export type FarcasterNetwork = typeof FARCASTER_NETWORKS[keyof typeof FARCASTER_NETWORKS];

/**
 * Get the current network ID
 * Defaults to mainnet
 */
export function getDefaultNetwork(): FarcasterNetwork {
  return FARCASTER_NETWORKS.MAINNET;
}

/**
 * Check if a network ID is valid
 */
export function isValidNetwork(networkId: number): networkId is FarcasterNetwork {
  return Object.values(FARCASTER_NETWORKS).includes(networkId as FarcasterNetwork);
}

