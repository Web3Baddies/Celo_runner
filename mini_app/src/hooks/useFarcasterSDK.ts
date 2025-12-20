'use client';

import { useFarcaster } from '@/context/FarcasterContext';

export function useFarcasterSDK() {
  const { isMiniApp, isSDKReady, sdk } = useFarcaster();

  return {
    isMiniApp,
    isSDKReady,
    sdk,
    isAvailable: isMiniApp && isSDKReady,
  };
}


