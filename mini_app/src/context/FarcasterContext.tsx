'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { checkIsMiniApp } from '@/utils/farcaster';

interface FarcasterContextType {
  isMiniApp: boolean;
  isSDKReady: boolean;
  sdk: typeof sdk | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isMiniApp: false,
  isSDKReady: false,
  sdk: null,
});

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const isMiniApp = checkIsMiniApp();

  useEffect(() => {
    const initSDK = async () => {
      if (isMiniApp) {
        try {
          await sdk.actions.ready();
          setIsSDKReady(true);
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setIsSDKReady(true); // Continue anyway
        }
      } else {
        setIsSDKReady(true);
      }
    };

    initSDK();
  }, [isMiniApp]);

  return (
    <FarcasterContext.Provider
      value={{
        isMiniApp,
        isSDKReady,
        sdk: isMiniApp ? sdk : null,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}


