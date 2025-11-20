'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  disabled?: boolean;
  countdown?: number; // Countdown in seconds before retry is available
  className?: string;
}

export function RetryButton({ onRetry, disabled = false, countdown, className = '' }: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(countdown);

  useEffect(() => {
    if (countdown && countdown > 0) {
      setRemainingTime(countdown);

      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdown]);

  const handleRetry = async () => {
    if (disabled || isRetrying || (remainingTime && remainingTime > 0)) {
      return;
    }

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const isDisabled = disabled || isRetrying || (remainingTime !== undefined && remainingTime > 0);

  return (
    <button
      onClick={handleRetry}
      disabled={isDisabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        bg-purple-500/20 hover:bg-purple-500/30
        border border-purple-500/30
        text-purple-300 text-sm font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isRetrying ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
      {remainingTime && remainingTime > 0 ? (
        <span>Retry in {remainingTime}s</span>
      ) : isRetrying ? (
        <span>Retrying...</span>
      ) : (
        <span>Retry</span>
      )}
    </button>
  );
}

export interface AutoRetryIndicatorProps {
  attempt: number;
  maxAttempts: number;
  nextRetryIn?: number; // milliseconds
}

export function AutoRetryIndicator({ attempt, maxAttempts, nextRetryIn }: AutoRetryIndicatorProps) {
  const [countdown, setCountdown] = useState(nextRetryIn ? Math.ceil(nextRetryIn / 1000) : 0);

  useEffect(() => {
    if (nextRetryIn && nextRetryIn > 0) {
      setCountdown(Math.ceil(nextRetryIn / 1000));

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextRetryIn]);

  return (
    <div className="flex items-center gap-2 text-sm text-white/60">
      <RefreshCw className="w-4 h-4 animate-spin" />
      <span>
        Retrying automatically... (Attempt {attempt}/{maxAttempts})
        {countdown > 0 && ` in ${countdown}s`}
      </span>
    </div>
  );
}
