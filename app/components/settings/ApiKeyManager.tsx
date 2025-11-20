'use client';

import { useState } from 'react';
import { Key, RefreshCw, Copy, Check } from 'lucide-react';

/**
 * ApiKeyManager Component
 * 
 * Display masked API key, implement regenerate functionality, show confirmation dialog
 * Requirements: 8.2, 8.4
 */

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('aura_sk_***************xyz');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    
    try {
      // TODO: Implement actual API key regeneration endpoint
      // const response = await fetch('/api/auth/regenerate-key', {
      //   method: 'POST',
      // });
      // const result = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock new key
      const newKey = `aura_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(newKey);
      
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error regenerating API key:', error);
      alert('Failed to regenerate API key. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        API Key
      </h2>

      <div className="space-y-4">
        {/* API Key Display */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-5 h-5 text-neon-purple" />
            <p className="text-sm text-white/60">Current API Key</p>
          </div>
          
          <div className="flex items-center gap-2">
            <code className="flex-1 text-white font-mono text-sm bg-black/30 px-3 py-2 rounded">
              {apiKey}
            </code>
            
            <button
              onClick={handleCopy}
              className="glass-button p-2 hover:bg-glass-medium transition-all duration-200"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-white/60" />
              )}
            </button>
          </div>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="glass-button-purple w-full flex items-center justify-center gap-2 py-3"
          disabled={isRegenerating}
        >
          <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate API Key'}</span>
        </button>

        {/* Warning Message */}
        <div className="glass-panel rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-yellow-200">
            <strong>Warning:</strong> Regenerating your API key will invalidate the current key immediately. 
            Any applications using the old key will stop working.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-strong rounded-xl p-6 max-w-md w-full animate-slide-up">
            <h3 className="text-xl font-display font-bold text-white mb-4">
              Confirm API Key Regeneration
            </h3>
            
            <p className="text-white/80 mb-6">
              Are you sure you want to regenerate your API key? This action cannot be undone, 
              and your current key will be invalidated immediately.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="glass-button flex-1 py-3 hover:bg-glass-medium"
                disabled={isRegenerating}
              >
                Cancel
              </button>
              
              <button
                onClick={handleRegenerate}
                className="glass-button-purple flex-1 py-3 bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
                disabled={isRegenerating}
              >
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
