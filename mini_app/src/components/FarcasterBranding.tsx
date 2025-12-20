'use client';

import { checkIsMiniApp } from '@/utils/farcaster';

export function FarcasterBranding() {
  const isMiniApp = checkIsMiniApp();

  if (!isMiniApp) {
    return null;
  }

  return (
    <div className="text-center py-2 mb-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
        <span className="text-purple-700 font-semibold text-sm">🔮 Powered by Farcaster</span>
      </div>
    </div>
  );
}


