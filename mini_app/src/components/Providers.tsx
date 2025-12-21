'use client';

import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/context/WalletContext";
import { WagmiProvider } from "@/components/WagmiProvider";
import { FarcasterProvider } from "@/context/FarcasterContext";
import { FarcasterErrorBoundary } from "@/components/FarcasterErrorBoundary";
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FarcasterErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <FarcasterProvider>
            <ThirdwebProvider>
              <WalletProvider>
                {children}
              </WalletProvider>
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    borderRadius: '12px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#7B61FF',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF6B6B',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </ThirdwebProvider>
          </FarcasterProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </FarcasterErrorBoundary>
  );
}
