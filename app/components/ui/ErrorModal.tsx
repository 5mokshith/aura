'use client';

import { useEffect } from 'react';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';
import { AuraError } from '@/app/lib/errorHandler';

export interface ErrorModalProps {
  error: AuraError | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onReconnect?: () => void;
}

export function ErrorModal({ error, isOpen, onClose, onRetry, onReconnect }: ErrorModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !error) return null;

  const showRetryButton = error.recoverable && (error.code === 'TASK_FAILED' || error.code === 'EXECUTION_FAILED');
  const showReconnectButton = error.code === 'TOKEN_EXPIRED' || error.code === 'PERMISSION_DENIED' || error.code === 'MISSING_SCOPES';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-md border border-red-500/30 rounded-lg shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Error Occurred</h2>
              <p className="text-sm text-white/60">{error.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-white/90 mb-4">{error.userMessage}</p>

          {error.details && (
            <details className="mb-4">
              <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-white/70 overflow-auto max-h-32">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            </details>
          )}

          {!error.recoverable && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-yellow-200">
              This error cannot be automatically recovered. Please contact support if the issue persists.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            Close
          </button>

          {showReconnectButton && onReconnect && (
            <button
              onClick={() => {
                onClose();
                onReconnect();
              }}
              className="px-4 py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reconnect
            </button>
          )}

          {showRetryButton && onRetry && (
            <button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="px-4 py-2 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
