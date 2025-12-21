'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useFarcasterWallet } from '@/hooks/useFarcasterWallet';
import { NetworkSelector } from './NetworkSelector';
import { hapticSelection } from '@/utils/haptics';
import { checkIsMiniApp } from '@/utils/farcaster';

export function FarcasterWallet() {
  const { address, isConnected, balanceFormatted, symbol, network } = useFarcasterWallet();
  const { disconnect } = useDisconnect();
  const isMiniApp = checkIsMiniApp();

  const handleDisconnect = () => {
    hapticSelection();
    disconnect();
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Not connected</p>
        {!isMiniApp && (
          <p className="text-sm text-gray-500 mt-2">
            Connect your wallet to start playing
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-purple-900">Wallet Connected</h3>
          <p className="text-sm text-purple-700 mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        {!isMiniApp && (
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Disconnect
          </button>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-purple-700">Balance:</span>
          <span className="font-bold text-purple-900">
            {balanceFormatted} {symbol}
          </span>
        </div>
        
        <div className="mt-3">
          <NetworkSelector />
        </div>
        
        <div className="mt-2 text-xs text-purple-600">
          Network: <span className="font-semibold">{network}</span>
        </div>
      </div>
    </div>
  );
}


