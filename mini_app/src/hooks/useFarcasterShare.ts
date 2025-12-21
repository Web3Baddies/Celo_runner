'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { checkIsMiniApp } from '@/utils/farcaster';

interface CastShare {
  hash: string;
  author: {
    fid: number;
    username: string;
  };
  text: string;
}

export function useFarcasterShare() {
  const [sharedCast, setSharedCast] = useState<CastShare | null>(null);
  const isMiniApp = checkIsMiniApp();

  useEffect(() => {
    if (!isMiniApp) return;

    // Listen for shared casts
    sdk.context.cast_share?.then((cast) => {
      if (cast) {
        setSharedCast(cast as CastShare);
      }
    }).catch((error) => {
      console.error('Failed to get shared cast:', error);
    });
  }, [isMiniApp]);

  return {
    sharedCast,
    isMiniApp,
    hasSharedCast: !!sharedCast,
  };
}


