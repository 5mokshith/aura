'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface TokenExpiredPromptProps {
  isOpen: boolean;
  onClose?: () => void;
  autoRedirect?: boolean;
}

export function TokenExpiredPrompt({ isOpen, onClose, autoRedirect = false }: TokenExpiredPromptProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleReconnect = () => {
    router.push('/auth/setup');
  };

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Prompt */}
      <div className="relative w-full max-w-md bg-gray-900/90 backdrop-blur-md border border-yellow-500/30 rounded-lg shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-start gap-3 p-6 border-b border-white/10">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Connection Expired</h2>
            <p className="text-sm text-white/60">Your Google Workspace connection has expired</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-white/90 mb-4">
            Your Google Workspace connection has expired. Please reconnect your account to continue using AURA.
          </p>

          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-200">
            <strong>What happens next:</strong>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>You'll be redirected to Google's sign-in page</li>
              <li>Grant permissions to AURA</li>
              <li>Return to continue your work</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          {!autoRedirect && onClose && (
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              Later
            </button>
          )}

          <button
            onClick={handleReconnect}
            className="px-4 py-2 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect Now
          </button>
        </div>
      </div>
    </div>
  );
}

export interface TokenExpiringWarningProps {
  expiresIn: number; // milliseconds
  onReconnect: () => void;
  onDismiss?: () => void;
}

export function TokenExpiringWarning({ expiresIn, onReconnect, onDismiss }: TokenExpiringWarningProps) {
  const minutes = Math.floor(expiresIn / 1000 / 60);

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-yellow-200">
          Your Google connection expires in {minutes} minute{minutes !== 1 ? 's' : ''}. 
          Reconnect now to avoid interruptions.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm text-yellow-400/60 hover:text-yellow-400 transition-colors"
          >
            Dismiss
          </button>
        )}
        <button
          onClick={onReconnect}
          className="px-3 py-1 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded border border-yellow-500/30 transition-colors"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
}
