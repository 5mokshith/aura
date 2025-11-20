'use client';

import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { ArrowRight, Shield } from 'lucide-react';

interface ConnectButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ConnectButton({ onClick, isLoading }: ConnectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full glass-button-cyan text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Shield className="w-5 h-5 text-neon-cyan" />
          <span>Connect Google Workspace</span>
          <ArrowRight className="w-5 h-5 text-neon-cyan group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}