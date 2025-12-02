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
        };
      case 'delete-logs':
        return {
          title: 'Delete All Execution Logs',
          message: 'This will permanently delete all execution logs and task history. This action cannot be undone.',
          confirmText: 'Delete Logs',
        };
      case 'delete-account':
        return {
          title: 'Delete Account',
          message: 'This will permanently delete your account, all data, and disconnect all services. This action cannot be undone.',
          confirmText: 'Delete Account',
        };
      default:
        return null;
    }
  };

  const content = getDialogContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {content.title}
        </h3>

        {/* Warning Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{content.message}</p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Danger Zone
          </h2>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="space-y-3">
          {/* Disconnect Google Account */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Disconnect Google Account
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Remove access to your Google Workspace services
                </p>
              </div>
              <button
                onClick={() => setActiveAction('disconnect')}
                className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline whitespace-nowrap flex items-center gap-1"
              >
                <Unlink className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>

          {/* Delete All Logs */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Delete All Execution Logs
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Permanently remove all task history and execution logs
                </p>
              </div>
              <button
                onClick={() => setActiveAction('delete-logs')}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline whitespace-nowrap flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Logs
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Delete Account
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => setActiveAction('delete-account')}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline whitespace-nowrap flex items-center gap-1"
              >
                <UserX className="w-4 h-4" />
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
