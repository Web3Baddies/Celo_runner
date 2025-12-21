'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';
import { checkIsMiniApp, getDefaultNetwork } from '@/utils/farcaster';

export function useFarcasterWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
    enabled: !!address,
  });
  const isMiniApp = checkIsMiniApp();

  return {
    address,
    isConnected,
    isMiniApp,
    chainId,
    balance: balance?.value ?? BigInt(0),
    balanceFormatted: balance?.formatted ?? '0',
    symbol: balance?.symbol ?? 'CELO',
    network: chainId === 42220 ? 'mainnet' : 'testnet',
  };
}


