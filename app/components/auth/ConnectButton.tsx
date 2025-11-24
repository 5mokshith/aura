'use client';

import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { ArrowRight, Shield } from 'lucide-react';

interface ConnectButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ConnectButton({ onClick, isLoading }: ConnectButtonProps) {
  return (
    <div className="relative group">
      {/* Button Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-purple rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>

      <button
        onClick={onClick}
        disabled={isLoading}
        className="relative w-full bg-black/50 backdrop-blur-xl border border-white/10 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="text-gray-200">Connecting Securely...</span>
          </>
        ) : (
          <>
            <div className="p-1.5 rounded-lg bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors">
              <Shield className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg font-medium tracking-wide">Connect Google Workspace</span>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </>
        )}
      </button>
    </div>
  );
}