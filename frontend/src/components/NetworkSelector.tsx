'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { celo, celoSepolia } from 'wagmi/chains';
import { useState } from 'react';

export function NetworkSelector() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (targetChainId: number) => {
    if (chainId === targetChainId) return;
    
    setIsSwitching(true);
    try {
      switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleSwitch(celo.id)}
        disabled={isSwitching || chainId === celo.id}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          chainId === celo.id
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Mainnet
      </button>
      <button
        onClick={() => handleSwitch(celoSepolia.id)}
        disabled={isSwitching || chainId === celoSepolia.id}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          chainId === celoSepolia.id
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Testnet
      </button>
    </div>
  );
}

