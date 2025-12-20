/**
 * Analytics utilities for Farcaster MiniApp usage tracking
 */

import { checkIsMiniApp } from './farcaster';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const isMiniApp = checkIsMiniApp();
  
  const analyticsEvent: AnalyticsEvent = {
    event,
    properties: {
      ...properties,
      isMiniApp,
      timestamp: new Date().toISOString(),
    },
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', analyticsEvent);
  }

  // In production, you would send this to your analytics service
  // Example: sendToAnalyticsService(analyticsEvent);
}

/**
 * Track MiniApp-specific events
 */
export const AnalyticsEvents = {
  MINIAPP_LOADED: 'miniapp_loaded',
  WALLET_CONNECTED: 'wallet_connected',
  TRANSACTION_SENT: 'transaction_sent',
  TRANSACTION_SUCCESS: 'transaction_success',
  TRANSACTION_FAILED: 'transaction_failed',
  GAME_STARTED: 'game_started',
  STAGE_COMPLETED: 'stage_completed',
  NFT_MINTED: 'nft_minted',
  MARKETPLACE_PURCHASE: 'marketplace_purchase',
} as const;


