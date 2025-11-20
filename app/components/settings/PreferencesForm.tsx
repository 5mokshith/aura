'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';

/**
 * PreferencesForm Component
 * 
 * Add theme selector and notification toggle
 * Requirements: 8.3
 */

type Theme = 'dark' | 'light';

interface Preferences {
  theme: Theme;
  notificationsEnabled: boolean;
}

export function PreferencesForm() {
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'dark',
    notificationsEnabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // TODO: Load from localStorage or API
      const stored = localStorage.getItem('aura-preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: Preferences) => {
    setSaving(true);
    
    try {
      // TODO: Save to API endpoint
      // await fetch('/api/user/preferences', {
      //   method: 'POST',
      //   body: JSON.stringify(newPreferences),
      // });
      
      // For now, save to localStorage
      localStorage.setItem('aura-preferences', JSON.stringify(newPreferences));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (theme: Theme) => {
    const newPreferences = { ...preferences, theme };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Apply theme to document
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleNotificationsToggle = () => {
    const newPreferences = {
      ...preferences,
      notificationsEnabled: !preferences.notificationsEnabled,
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Preferences
      </h2>

      <div className="space-y-6">
        {/* Theme Selector */}
        <div>
          <label className="block text-sm text-white/60 mb-3">
            Theme
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`glass-panel rounded-lg p-4 flex items-center gap-3 transition-all duration-300 ${
                preferences.theme === 'dark'
                  ? 'border-neon-purple shadow-neon-purple bg-glass-medium'
                  : 'border-white/20 hover:bg-glass-medium'
              }`}
            >
              <Moon className="w-5 h-5 text-neon-purple" />
              <div className="text-left">
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-xs text-white/60">Default theme</p>
              </div>
            </button>

            <button
              onClick={() => handleThemeChange('light')}
              className={`glass-panel rounded-lg p-4 flex items-center gap-3 transition-all duration-300 ${
                preferences.theme === 'light'
                  ? 'border-neon-cyan shadow-neon-cyan bg-glass-medium'
                  : 'border-white/20 hover:bg-glass-medium'
              }`}
            >
              <Sun className="w-5 h-5 text-neon-cyan" />
              <div className="text-left">
                <p className="text-white font-medium">Light Mode</p>
                <p className="text-xs text-white/60">Coming soon</p>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div>
          <label className="block text-sm text-white/60 mb-3">
            Notifications
          </label>
          
          <button
            onClick={handleNotificationsToggle}
            className="glass-panel rounded-lg p-4 w-full flex items-center justify-between hover:bg-glass-medium transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {preferences.notificationsEnabled ? (
                <Bell className="w-5 h-5 text-neon-cyan" />
              ) : (
                <BellOff className="w-5 h-5 text-white/40" />
              )}
              <div className="text-left">
                <p className="text-white font-medium">
                  {preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-white/60">
                  Receive notifications for task completions
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                preferences.notificationsEnabled
                  ? 'bg-neon-cyan/30 border-neon-cyan'
                  : 'bg-white/10 border-white/20'
              } border`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 ${
                  preferences.notificationsEnabled
                    ? 'translate-x-6 bg-neon-cyan'
                    : 'translate-x-0 bg-white/60'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Save Status */}
        {saved && (
          <div className="glass-panel rounded-lg p-3 border-l-4 border-green-500 animate-slide-up">
            <p className="text-sm text-green-400">
              ✓ Preferences saved successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
