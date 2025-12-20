'use client';

import { useState, useCallback } from 'react';
import { getAuthToken, signInWithFarcaster, clearAuthCache } from '@/utils/farcasterAuth';

export function useFarcasterAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const getToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = await getAuthToken();
      setToken(authToken);
      return authToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get auth token');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await signInWithFarcaster();
      return credential;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign in');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthCache();
    setToken(null);
    setError(null);
  }, []);

  return {
    token,
    isLoading,
    error,
    getToken,
    signIn,
    logout,
    isAuthenticated: !!token,
  };
}


