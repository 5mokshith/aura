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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
                Preferences
            </h2>

            <div className="space-y-6">
                {/* Appearance Section */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                        Appearance
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`bg-white/5 backdrop-blur-md border rounded-lg p-4 flex items-center gap-3 transition-all duration-300 ${preferences.theme === 'dark'
                                ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-purple-500/10'
                                : 'border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <Moon className={`w-5 h-5 ${preferences.theme === 'dark' ? 'text-purple-400' : 'text-white/60'}`} />
                            <div className="text-left">
                                <p className="text-white font-medium text-sm">Dark Mode</p>
                                <p className="text-xs text-white/50">Adjust the appearance of the application</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`bg-white/5 backdrop-blur-md border rounded-lg p-4 flex items-center gap-3 transition-all duration-300 ${preferences.theme === 'light'
                                ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-cyan-500/10'
                                : 'border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <Sun className={`w-5 h-5 ${preferences.theme === 'light' ? 'text-cyan-400' : 'text-white/60'}`} />
                            <div className="text-left">
                                <p className="text-white font-medium text-sm">Light Mode</p>
                                <p className="text-xs text-white/50">Coming soon</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Notifications Toggle */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                        Notifications
                    </label>

                    <button
                        onClick={handleNotificationsToggle}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 w-full flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            {preferences.notificationsEnabled ? (
                                <Bell className="w-5 h-5 text-cyan-400" />
                            ) : (
                                <BellOff className="w-5 h-5 text-white/40" />
                            )}
                            <div className="text-left">
                                <p className="text-white font-medium text-sm">
                                    {preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                                <p className="text-xs text-white/50">
                                    Receive notifications for task completions
                                </p>
                            </div>
                        </div>

                        {/* Toggle Switch */}
                        <div
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${preferences.notificationsEnabled
                                ? 'bg-cyan-500/20 border-cyan-500/50'
                                : 'bg-white/10 border-white/20'
                                } border`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 shadow-md ${preferences.notificationsEnabled
                                    ? 'translate-x-6 bg-cyan-400'
                                    : 'translate-x-0 bg-white/60'
                                    }`}
                            />
                        </div>
                    </button>
                </div>

                {/* Save Status */}
                {saved && (
                    <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg p-3 border-l-4 border-l-green-500 animate-slide-up">
                        <p className="text-sm text-green-400 font-medium">
                            ✓ Preferences saved successfully
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
