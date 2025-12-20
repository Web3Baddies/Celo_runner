'use client';

import { useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { checkIsMiniApp } from '@/utils/farcaster';

export function useFarcasterNavigation() {
  const isMiniApp = checkIsMiniApp();

  const goBack = useCallback(() => {
    if (isMiniApp) {
      try {
        sdk.back();
      } catch (error) {
        console.error('Failed to navigate back:', error);
        // Fallback to browser back
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      }
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, [isMiniApp]);

  return {
    goBack,
    isMiniApp,
  };
}


