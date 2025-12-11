"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  useActiveAccount, 
  useActiveWallet, 
  useActiveWalletChain, 
  useSwitchActiveWalletChain,
  useDisconnect,
} from "thirdweb/react";
import { Wallet, Account } from "thirdweb/wallets";
import { defineChain } from "thirdweb";

// Define Celo Sepolia chain
export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo Mainnet",
  rpc: "https://forno.celo.org/",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18
  }
});

interface WalletContextType {
  isConnected: boolean;
  account: Account | undefined;
  wallet: Wallet | undefined;
  disconnect: () => void;
  chainId: number | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const { disconnect: disconnectWallet } = useDisconnect();
  
  const [isConnected, setIsConnected] = useState(false);

  // Update connection state based on account presence
  useEffect(() => {
    setIsConnected(!!account);
  }, [account]);

  // Auto-switch to Celo Mainnet if connected to wrong chain
  useEffect(() => {
    if (isConnected && activeChain && activeChain.id !== celoMainnet.id) {
      console.log(`Wrong chain detected (${activeChain.id}). Switching to Celo Mainnet...`);
      switchChain(celoMainnet).catch((err) => {
        console.error("Failed to switch chain:", err);
      });
    }
  }, [isConnected, activeChain, switchChain]);

  const handleDisconnect = () => {
    if (wallet) {
      disconnectWallet(wallet);
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      account,
      wallet,
      disconnect: handleDisconnect,
      chainId: activeChain?.id
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
