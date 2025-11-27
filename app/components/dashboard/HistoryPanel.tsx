'use client';

import { ArrowUp, Circle, Info, Square, Key, Settings } from 'lucide-react';

/**
 * HistoryPanel Component
 * 
 * Display recent activity timeline with sync events and notifications
 */

interface HistoryItem {
    id: string;
    title: string;
    timestamp: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'update' | 'maintenance';
    icon: 'arrow-up' | 'circle' | 'info' | 'square' | 'key' | 'settings';
}

const sampleHistory: HistoryItem[] = [
    {
        id: '1',
        title: 'Files synced from Google Drive',
        timestamp: '22 DEC 7:20 PM',
        type: 'success',
        icon: 'arrow-up',
    },
    {
        id: '2',
        title: 'Sync failed for Asana tasks',
        timestamp: '21 DEC 11:00 PM',
        type: 'error',
        icon: 'circle',
    },
    {
        id: '3',
        title: 'New leads from Salesforce',
        timestamp: '21 DEC 9:34 PM',
        type: 'info',
        icon: 'info',
    },
    {
        id: '4',
        title: 'New messages in Slack channel',
        timestamp: '20 DEC 2:20 AM',
        type: 'warning',
        icon: 'square',
    },
    {
        id: '5',
        title: 'API keys for Dropbox updated',
        timestamp: '20 DEC 4:54 AM',
        type: 'update',
        icon: 'key',
    },
    {
        id: '6',
        title: 'System maintenance scheduled',
        timestamp: '17 DEC',
        type: 'maintenance',
        icon: 'settings',
    },
];

export function HistoryPanel() {
    const getIcon = (iconType: string) => {
        const iconClass = 'w-4 h-4';
        switch (iconType) {
            case 'arrow-up':
                return <ArrowUp className={iconClass} />;
            case 'circle':
                return <Circle className={iconClass} />;
            case 'info':
                return <Info className={iconClass} />;
            case 'square':
                return <Square className={iconClass} />;
            case 'key':
                return <Key className={iconClass} />;
            case 'settings':
                return <Settings className={iconClass} />;
            default:
                return <Info className={iconClass} />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'error':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'info':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'warning':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'update':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'maintenance':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="glass-panel-strong rounded-xl p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                    History
                </h2>
                <div className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">24%</span>
                    <span className="text-white/60 text-sm">this month</span>
                </div>
            </div>

            {/* Activity List */}
            <div className="space-y-4">
                {sampleHistory.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 group hover:bg-glass-light rounded-lg p-2 -mx-2 transition-colors cursor-pointer"
                    >
                        {/* Icon */}
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${getIconColor(
                                item.type
                            )}`}
                        >
                            {getIcon(item.icon)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium leading-tight mb-1">
                                {item.title}
                            </p>
                            <p className="text-white/50 text-xs">{item.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <button className="w-full mt-6 text-sm text-neon-cyan hover:text-neon-cyan/80 font-medium text-center transition-colors">
                View All Activity →
            </button>
        </div>
    );
}
