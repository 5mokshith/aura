'use client';

import { AlertCircle, X } from 'lucide-react';

export interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function InlineError({ message, onDismiss, className = '' }: InlineErrorProps) {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg
        bg-red-500/10 border border-red-500/30
        ${className}
      `}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-red-200">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-400/60 hover:text-red-400 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export interface InlineWarningProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function InlineWarning({ message, onDismiss, className = '' }: InlineWarningProps) {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg
        bg-yellow-500/10 border border-yellow-500/30
        ${className}
      `}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm text-yellow-200">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-yellow-400/60 hover:text-yellow-400 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
