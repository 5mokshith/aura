'use client';

import { ProfileSection } from '@/app/components/settings/ProfileSection';
import { ApiKeyManager } from '@/app/components/settings/ApiKeyManager';
import { PreferencesForm } from '@/app/components/settings/PreferencesForm';
import { DangerZone } from '@/app/components/settings/DangerZone';
import { Settings as SettingsIcon } from 'lucide-react';

/**
 * Settings Page
 * 
 * Display profile information, API key management, preferences form, and danger zone section
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-neon-cyan" />
            <h1 className="text-4xl font-display font-bold text-white">
              Settings
            </h1>
          </div>
          <p className="text-white/60">
            Manage your account, preferences, and security settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <ProfileSection />

          {/* API Key Manager */}
          <ApiKeyManager />

          {/* Preferences Form */}
          <PreferencesForm />

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
