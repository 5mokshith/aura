'use client';

import { LucideIcon } from 'lucide-react';

/**
 * ServiceMetricsCard Component
 * 
 * Display individual service metrics with activity count and trend indicator
 */

interface ServiceMetricsCardProps {
    name: string;
    icon: LucideIcon;
    count: number;
    trend: number; // Percentage change
    isActive: boolean;
    color: 'orange' | 'dark' | 'dark-blue' | 'dark-green' | 'dark-purple';
    iconColor?: string;
}

export function ServiceMetricsCard({
    name,
    icon: Icon,
    count,
    trend,
    isActive,
    color,
    iconColor = 'text-white'
}: ServiceMetricsCardProps) {
    const getBackgroundClass = () => {
        switch (color) {
            case 'orange':
                return 'bg-gradient-to-br from-orange-500 to-orange-600';
            case 'dark':
                return 'bg-gradient-to-br from-slate-800 to-slate-900';
            case 'dark-blue':
                return 'bg-gradient-to-br from-slate-800 to-blue-900';
            case 'dark-green':
                return 'bg-gradient-to-br from-slate-800 to-green-900';
            case 'dark-purple':
                return 'bg-gradient-to-br from-slate-800 to-purple-900';
            default:
                return 'bg-gradient-to-br from-slate-800 to-slate-900';
        }
    };

    const formatCount = (num: number): string => {
        return num.toLocaleString();
    };

    const formatTrend = (percent: number): string => {
        const sign = percent > 0 ? '+' : '';
        return `${sign}${percent}%`;
    };

    return (
        <div
            className={`relative rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getBackgroundClass()}`}
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <div
                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'
                        } animate-pulse`}
                />
                <span className="text-xs text-white/80">
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Icon */}
            <div className={`mb-4 ${iconColor}`}>
                <Icon className="w-10 h-10" />
            </div>

            {/* Service Name */}
            <h3 className="text-white text-lg font-semibold mb-1">{name}</h3>

            {/* Count */}
            <div className="text-4xl font-bold text-white mb-2">
                {formatCount(count)}
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-1">
                <span
                    className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}
                >
                    {formatTrend(trend)}
                </span>
                <span className="text-xs text-white/60">
                    than last {name === 'Calendar' ? 'month' : 'week'}
                </span>
            </div>
        </div>
    );
}
