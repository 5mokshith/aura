'use client';

import { useState } from 'react';
import { AlertTriangle, Unlink, Trash2, UserX } from 'lucide-react';

/**
 * DangerZone Component
 * 
 * Add disconnect Google account button, delete logs button, delete account button
 * Implement confirmation dialogs for all actions
 * Requirements: 8.3, 8.4, 8.5
 */

type DangerAction = 'disconnect' | 'delete-logs' | 'delete-account' | null;

interface ConfirmDialogProps {
  action: DangerAction;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

function ConfirmDialog({ action, onConfirm, onCancel, isProcessing }: ConfirmDialogProps) {
  const getDialogContent = () => {
    switch (action) {
      case 'disconnect':
        return {
          title: 'Disconnect Google Account',
          message: 'Are you sure you want to disconnect your Google Workspace account? You will need to reconnect to use AURA again.',
          confirmText: 'Disconnect',
          icon: <Unlink className="w-6 h-6 text-red-400" />,
        };
      case 'delete-logs':
        return {
          title: 'Delete All Execution Logs',
          message: 'This will permanently delete all execution logs and task history. This action cannot be undone.',
          confirmText: 'Delete Logs',
          icon: <Trash2 className="w-6 h-6 text-red-400" />,
        };
      case 'delete-account':
        return {
          title: 'Delete Account',
          message: 'This will permanently delete your account, all data, and disconnect all services. This action cannot be undone.',
          confirmText: 'Delete Account',
          icon: <UserX className="w-6 h-6 text-red-400" />,
        };
      default:
        return null;
    }
  };

  const content = getDialogContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-strong rounded-xl p-6 max-w-md w-full animate-slide-up border-2 border-red-500/50">
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          {content.icon}
          <h3 className="text-xl font-display font-bold text-white">
            {content.title}
          </h3>
        </div>

        {/* Warning Message */}
        <div className="glass-panel rounded-lg p-4 border-l-4 border-red-500 mb-6">
          <p className="text-white/90">{content.message}</p>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm text-white/60 mb-2">
            Type <strong className="text-red-400">CONFIRM</strong> to proceed
          </label>
          <input
            type="text"
            id="confirm-input"
            className="glass-input w-full px-4 py-2 rounded-lg text-white focus:outline-none"
            placeholder="CONFIRM"
            disabled={isProcessing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="glass-button flex-1 py-3 hover:bg-glass-medium"
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              const input = document.getElementById('confirm-input') as HTMLInputElement;
              if (input?.value === 'CONFIRM') {
                onConfirm();
              } else {
                alert('Please type CONFIRM to proceed');
              }
            }}
            className="glass-button flex-1 py-3 bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DangerZone() {
  const [activeAction, setActiveAction] = useState<DangerAction>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDisconnect = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual disconnect endpoint
      // await fetch('/api/auth/disconnect', { method: 'POST' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Google account disconnected successfully');
      setActiveAction(null);

      // Redirect to setup page
      window.location.href = '/auth/setup';
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLogs = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual delete logs endpoint
      // await fetch('/api/db/delete-logs', { method: 'DELETE' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('All execution logs deleted successfully');
      setActiveAction(null);
    } catch (error) {
      console.error('Error deleting logs:', error);
      alert('Failed to delete logs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual delete account endpoint
      // await fetch('/api/auth/delete-account', { method: 'DELETE' });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Account deleted successfully');
      setActiveAction(null);

      // Redirect to home or login
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    switch (activeAction) {
      case 'disconnect':
        handleDisconnect();
        break;
      case 'delete-logs':
        handleDeleteLogs();
        break;
      case 'delete-account':
        handleDeleteAccount();
        break;
    }
  };

  return (
    <>
      <div className="glass-panel-strong rounded-xl p-6 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-display font-bold text-white">
            Danger Zone
          </h2>
        </div>

        <p className="text-white/60 mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="space-y-3">
          {/* Disconnect Google Account */}
          <div className="glass-panel rounded-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">
                  Disconnect Google Account
                </h3>
                <p className="text-sm text-white/60">
                  Remove access to your Google Workspace services
                </p>
              </div>
              <button
                onClick={() => setActiveAction('disconnect')}
                className="glass-button px-4 py-2 border-orange-500/50 hover:bg-orange-500/20 text-orange-400 whitespace-nowrap"
              >
                <Unlink className="w-4 h-4 inline mr-2" />
                Disconnect
              </button>
            </div>
          </div>

          {/* Delete All Logs */}
          <div className="glass-panel rounded-lg p-4 border-l-4 border-red-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">
                  Delete All Execution Logs
                </h3>
                <p className="text-sm text-white/60">
                  Permanently remove all task history and execution logs
                </p>
              </div>
              <button
                onClick={() => setActiveAction('delete-logs')}
                className="glass-button px-4 py-2 border-red-500/50 hover:bg-red-500/20 text-red-400 whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete Logs
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="glass-panel rounded-lg p-4 border-l-4 border-red-600">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-white/60">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => setActiveAction('delete-account')}
                className="glass-button px-4 py-2 border-red-600/50 hover:bg-red-600/20 text-red-500 whitespace-nowrap"
              >
                <UserX className="w-4 h-4 inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {activeAction && (
        <ConfirmDialog
          action={activeAction}
          onConfirm={handleConfirm}
          onCancel={() => setActiveAction(null)}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
}
