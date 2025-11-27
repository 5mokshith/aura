'use client';

import { lazy, Suspense } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

// Lazy load settings components
const ProfileSection = lazy(() => import('@/app/components/settings/ProfileSection').then(mod => ({ default: mod.ProfileSection })));
const PreferencesForm = lazy(() => import('@/app/components/settings/PreferencesForm').then(mod => ({ default: mod.PreferencesForm })));
const DangerZone = lazy(() => import('@/app/components/settings/DangerZone').then(mod => ({ default: mod.DangerZone })));

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
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-32 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <ProfileSection />
          </Suspense>

          {/* Preferences Form */}
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-48 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <PreferencesForm />
          </Suspense>

          {/* Danger Zone */}
          <Suspense fallback={
            <div className="glass-panel rounded-xl p-6 h-48 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }>
            <DangerZone />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
