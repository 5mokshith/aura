'use client';

import { useState, useCallback, useRef } from 'react';
import { AuraError } from '@/app/lib/errorHandler';
import { RetryManager, RetryOptions, RetryState } from '@/app/lib/retry';

export function useRetry(options: RetryOptions = {}) {
  const managerRef = useRef(new RetryManager(options));
  const [retryStates, setRetryStates] = useState<Map<string, RetryState>>(new Map());

  const canRetry = useCallback((taskId: string, error: AuraError): boolean => {
    return managerRef.current.canRetry(taskId, error);
  }, []);

  const recordAttempt = useCallback((taskId: string, error: AuraError): RetryState => {
    const state = managerRef.current.recordAttempt(taskId, error);
    setRetryStates(new Map(managerRef.current['retryStates']));
    return state;
  }, []);

  const clearRetryState = useCallback((taskId: string): void => {
    managerRef.current.clearRetryState(taskId);
    setRetryStates(new Map(managerRef.current['retryStates']));
  }, []);

  const getRetryState = useCallback((taskId: string): RetryState | undefined => {
    return managerRef.current.getRetryState(taskId);
  }, []);

  const reset = useCallback((): void => {
    managerRef.current.reset();
    setRetryStates(new Map());
  }, []);

  return {
    canRetry,
    recordAttempt,
    clearRetryState,
    getRetryState,
    reset,
    retryStates,
  };
}
