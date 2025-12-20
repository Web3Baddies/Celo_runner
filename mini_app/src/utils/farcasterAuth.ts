/**
 * Farcaster Authentication utilities
 * Supports Quick Auth and Sign In with Farcaster
 */

import { sdk } from '@farcaster/miniapp-sdk';
import { checkIsMiniApp } from './farcaster';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get authentication token using Quick Auth
 * Returns cached token if still valid, otherwise fetches new one
 */
export async function getAuthToken(): Promise<string | null> {
  if (!checkIsMiniApp()) {
    return null;
  }

  // Return cached token if still valid (with 5 minute buffer)
  const now = Date.now();
  if (cachedToken && tokenExpiry > now + 5 * 60 * 1000) {
    return cachedToken;
  }

  try {
    const token = await sdk.quickAuth.getToken();
    cachedToken = token;
    // Tokens typically expire in 1 hour, set expiry to 55 minutes for safety
    tokenExpiry = now + 55 * 60 * 1000;
    return token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Sign In with Farcaster
 * Returns the credential for server-side verification
 */
export async function signInWithFarcaster() {
  if (!checkIsMiniApp()) {
    throw new Error('Not in MiniApp environment');
  }

  try {
    const credential = await sdk.actions.signIn();
    return credential;
  } catch (error) {
    console.error('Failed to sign in with Farcaster:', error);
    throw error;
  }
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No auth token available');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Clear cached token (useful for logout)
 */
export function clearAuthCache() {
  cachedToken = null;
  tokenExpiry = 0;
}


