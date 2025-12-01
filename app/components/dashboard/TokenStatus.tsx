'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * TokenStatus Component
 * 
 * Display access token expiration, refresh token status, and reconnect button
 * Requirements: 7.2, 7.5
 */

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  isExpired: boolean;
  expiresInSeconds: number;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
}

export function TokenStatus() {
  const router = useRouter();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenStatus();
    
    // Refresh token status every 30 seconds
    const interval = setInterval(fetchTokenStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getUserIdFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find(row => row.startsWith('aura_user_id='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  };

  const fetchTokenStatus = async () => {
    try {
      // Get user ID from session (placeholder - implement based on your auth)
      const userId = getUserIdFromCookie();

      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/db/get-tokens?userId=${encodeURIComponent(userId)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setTokenData(result.data);
        setError(null);
      } else {
        setError(result.error?.message || 'Failed to fetch token status');
      }
    } catch (err: any) {
      console.error('Error fetching token status:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = () => {
    router.push('/auth/setup');
  };

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Token Status
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Token Status
        </h2>
        <div className="flex flex-col items-center gap-4 py-8">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-white/70 text-center">
            {error || 'No Google Workspace connection found'}
          </p>
          <button
            onClick={handleReconnect}
            className="glass-button-cyan text-white font-medium"
          >
            Connect Google Workspace
          </button>
        </div>
      </div>
    );
  }

  const isExpiringSoon = tokenData.expiresInSeconds < 600; // Less than 10 minutes

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Token Status
      </h2>

      <div className="space-y-4">
        {/* Access Token Status */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-neon-cyan" />
                <h3 className="text-lg font-semibold text-white">
                  Access Token
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {tokenData.isExpired ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">Expired</span>
                    </>
                  ) : isExpiringSoon ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">
                        Expires in {formatTimeRemaining(tokenData.expiresInSeconds)}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">
                        Valid (expires in {formatTimeRemaining(tokenData.expiresInSeconds)})
                      </span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-white/60">
                  Expires: {new Date(tokenData.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Token Status */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-semibold text-white">
              Refresh Token
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">Active</span>
          </div>
          
          <p className="text-sm text-white/60 mt-2">
            Last updated: {new Date(tokenData.updatedAt).toLocaleString()}
          </p>
        </div>

        {/* Scopes */}
        <div className="glass-panel rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Granted Permissions
          </h3>
          <div className="flex flex-wrap gap-2">
            {tokenData.scopes.map((scope, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-glass-light text-xs text-white/80 border border-white/20"
              >
                {scope.split('/').pop()?.replace('.', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Reconnect Button */}
        {(tokenData.isExpired || isExpiringSoon) && (
          <button
            onClick={handleReconnect}
            className="w-full glass-button-cyan text-white font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reconnect Google Workspace
          </button>
        )}
      </div>
    </div>
  );
}
