'use client';

import { PageLayout } from '@/app/components/layout/PageLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [expandedPermission, setExpandedPermission] = useState<string | null>('calendar');

  const togglePermission = (permission: string) => {
    setExpandedPermission(expandedPermission === permission ? null : permission);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#050609] text-white p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Integrations</h1>
            <p className="text-gray-400 mt-2">Manage your connected Google Workspace account and permissions.</p>
          </div>

          {/* Connected Account */}
          <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">user@google.com</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-500">Connected</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#1A1D24] border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all">
                Disconnect
              </button>
            </div>
          </div>

          {/* Granted Permissions */}
          <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Granted Permissions</h2>

            <div className="space-y-3">
              {/* Google Calendar Access */}
              <div className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePermission('calendar')}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">Google Calendar Access</span>
                  {expandedPermission === 'calendar' ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedPermission === 'calendar' && (
                  <div className="px-4 pb-4 pt-2 bg-[#0B0D12]/50">
                    <p className="text-sm text-gray-400">
                      AURA uses this permission to read your calendar events, create new events, and manage your schedule to automate your workflows.
                    </p>
                  </div>
                )}
              </div>

              {/* Google Drive Access */}
              <div className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePermission('drive')}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">Google Drive Access</span>
                  {expandedPermission === 'drive' ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedPermission === 'drive' && (
                  <div className="px-4 pb-4 pt-2 bg-[#0B0D12]/50">
                    <p className="text-sm text-gray-400">
                      AURA uses this permission to access, organize, and manage your Google Drive files to help automate document workflows.
                    </p>
                  </div>
                )}
              </div>

              {/* Gmail Access */}
              <div className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePermission('gmail')}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">Gmail Access</span>
                  {expandedPermission === 'gmail' ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedPermission === 'gmail' && (
                  <div className="px-4 pb-4 pt-2 bg-[#0B0D12]/50">
                    <p className="text-sm text-gray-400">
                      AURA uses this permission to read, send, and manage your emails to automate email-related tasks and workflows.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
