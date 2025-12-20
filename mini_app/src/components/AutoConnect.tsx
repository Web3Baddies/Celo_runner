'use client';

import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { checkIsMiniApp } from '@/utils/farcaster';

/**
 * Auto-connect component that handles automatic wallet connection in Farcaster MiniApp mode
 * Must be rendered inside WagmiProvider
 */
export function AutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const isMiniApp = checkIsMiniApp();

  // Auto-connect in MiniApp mode
  useEffect(() => {
    if (isMiniApp && !isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isMiniApp, isConnected, connectors, connect]);

  return null;
}


