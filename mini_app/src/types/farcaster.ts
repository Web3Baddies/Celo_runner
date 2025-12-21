/**
 * TypeScript types for Farcaster MiniApp integration
 */

export interface FarcasterConfig {
  isMiniApp: boolean;
  isSDKReady: boolean;
}

export interface NetworkConfig {
  id: number;
  name: string;
  isMainnet: boolean;
}

export interface WalletState {
  address: string | undefined;
  isConnected: boolean;
  chainId: number;
  balance: bigint;
  balanceFormatted: string;
  symbol: string;
}

export interface TransactionState {
  txHash: string | undefined;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export interface CastShare {
  hash: string;
  author: {
    fid: number;
    username: string;
  };
  text: string;
}

export interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}


