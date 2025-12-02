'use client';

import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

/**
 * PreferencesForm Component
 * 
 * Add theme selector and notification toggle
 * Requirements: 8.3
 */

type Theme = 'dark' | 'light';

interface Preferences {
    theme: Theme;
}

export function PreferencesForm() {
    const [preferences, setPreferences] = useState<Preferences>({
        theme: 'dark',
    });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            // Load from localStorage
            const stored = localStorage.getItem('aura-preferences');
            if (stored) {
                const loadedPrefs = JSON.parse(stored);
                setPreferences(loadedPrefs);

                // Apply theme on load
                if (loadedPrefs.theme === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    document.documentElement.classList.add('dark');
                }
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const savePreferences = async (newPreferences: Preferences) => {
        try {
            // Save to localStorage
            localStorage.setItem('aura-preferences', JSON.stringify(newPreferences));
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    const handleThemeToggle = () => {
        const newTheme: Theme = preferences.theme === 'light' ? 'dark' : 'light';
        const newPreferences = { theme: newTheme };
        setPreferences(newPreferences);
        savePreferences(newPreferences);

        // Apply theme to document
        if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    const isLightMode = preferences.theme === 'light';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Preferences
            </h2>

            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                    Appearance
                </p>

                {/* Light Mode Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sun className="w-5 h-5 text-orange-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Adjust the appearance of the application</p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        onClick={handleThemeToggle}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isLightMode ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        aria-label="Toggle light mode"
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isLightMode ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
