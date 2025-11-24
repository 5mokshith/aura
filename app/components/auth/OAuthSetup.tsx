'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScopesList } from './ScopesList';
import { ConnectButton } from './ConnectButton';
import { AlertCircle, Sparkles } from 'lucide-react';

export function OAuthSetup() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null); // Clear any existing errors

    try {
      const response = await fetch('/api/auth/google/redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // Redirect to Google OAuth
        window.location.href = data.redirectUrl;
      } else {
        console.error('Failed to get OAuth URL:', data.error);
        setError(data.error?.message || 'Failed to initiate OAuth flow');
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      setError('Network error. Please check your connection and try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="relative group">
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative glass-panel-xl max-w-lg w-full p-8 sm:p-10 animate-slide-up rounded-2xl border border-white/10 shadow-2xl">
        {/* AURA Logo */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-neon-cyan/20 rounded-full blur-3xl -z-10"></div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-panel-md mb-6 shadow-neon-cyan ring-1 ring-white/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent opacity-50"></div>
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-neon-cyan font-display relative z-10">A</span>
            <Sparkles className="absolute top-2 right-2 w-4 h-4 text-neon-cyan/50 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white font-display mb-3 tracking-tight">AURA</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-500"></div>
            <p className="text-gray-300 text-sm font-medium tracking-wide uppercase">Agentic Unified Reasoning Assistant</p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-500"></div>
          </div>
        </div>

        {/* Connect Google Workspace Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-3">Connect Google Workspace</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Grant AURA access to your Google services to enable powerful AI automation capabilities.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 glass-panel-sm rounded-xl border border-red-500/30 bg-red-500/10 animate-shake">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-300 mb-1">Connection Failed</h3>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requested Permissions */}
        <ScopesList />

        {/* Connect Button */}
        <div className="mt-8">
          <ConnectButton onClick={handleConnect} isLoading={isConnecting} />
        </div>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Secure OAuth 2.0 Authentication</span>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">
            Encrypted &bull; Private &bull; Secure
          </p>
        </div>
      </div>
    </div>
  );
}