'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScopesList } from './ScopesList';
import { ConnectButton } from './ConnectButton';
import { AlertCircle } from 'lucide-react';

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
    <div className="glass-panel-xl max-w-md w-full p-8 animate-slide-up">
      {/* AURA Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel-md mb-4 shadow-neon-cyan">
          <span className="text-2xl font-bold text-neon-cyan font-display">A</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-display mb-2">AURA</h1>
        <p className="text-gray-300 text-sm">Agentic Unified Reasoning Assistant</p>
      </div>

      {/* Connect Google Workspace Heading */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">Connect Google Workspace</h2>
        <p className="text-gray-400 text-sm">
          Grant AURA access to your Google services to enable AI-powered automation
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 glass-panel-sm rounded-lg border border-red-500/30 bg-red-500/10">
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
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure OAuth 2.0 Authentication
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Your credentials are encrypted and never stored in plain text
        </p>
      </div>
    </div>
  );
}