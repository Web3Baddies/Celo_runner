'use client';

import { useEffect, useState } from 'react';
import { initializeFarcasterSDK, checkIsMiniApp } from '@/utils/farcaster';

export function FarcasterSDK({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const isMiniApp = checkIsMiniApp();

  useEffect(() => {
    const initSDK = async () => {
      if (isMiniApp) {
        try {
          await initializeFarcasterSDK();
          setIsReady(true);
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setIsReady(true); // Continue anyway
        }
      } else {
        setIsReady(true);
      }
      setIsInitializing(false);
    };

    initSDK();
  }, [isMiniApp]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


