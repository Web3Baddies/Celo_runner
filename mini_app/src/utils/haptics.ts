/**
 * Haptic feedback utilities for Farcaster MiniApp
 */

import { sdk } from '@farcaster/miniapp-sdk';
import { checkIsMiniApp } from './farcaster';

/**
 * Trigger light impact haptic feedback
 */
export function hapticImpact() {
  if (checkIsMiniApp()) {
    try {
      sdk.haptics.impact();
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }
}

/**
 * Trigger notification haptic feedback
 */
export function hapticNotification() {
  if (checkIsMiniApp()) {
    try {
      sdk.haptics.notification();
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }
}

/**
 * Trigger selection haptic feedback
 */
export function hapticSelection() {
  if (checkIsMiniApp()) {
    try {
      sdk.haptics.selection();
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }
}


