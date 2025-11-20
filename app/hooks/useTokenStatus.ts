'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface TokenStatus {
  isValid: boolean;
  isExpired: boolean;
  expiresIn?: number;
  needsRefresh: boolean;
  expirationText?: string;
}

export function useTokenStatus(userId?: string) {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkTokenStatus = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/token-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to check token status');
      }

      setTokenStatus(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setTokenStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const reconnect = useCallback(() => {
    router.push('/auth/setup');
  }, [router]);

  // Check token status on mount and periodically
  useEffect(() => {
    checkTokenStatus();

    // Check every 5 minutes
    const interval = setInterval(checkTokenStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkTokenStatus]);

  // Show reconnect prompt if token is expired
  useEffect(() => {
    if (tokenStatus?.isExpired) {
      // Token is expired, user needs to reconnect
      console.warn('OAuth token expired, user needs to reconnect');
    }
  }, [tokenStatus]);

  return {
    tokenStatus,
    isLoading,
    error,
    checkTokenStatus,
    reconnect,
  };
}
