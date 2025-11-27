'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

/**
 * LiveAnalytics Component
 * 
 * Display multi-line chart showing Google Workspace activity over time
 */

// Sample data for demonstration
const generateAnalyticsData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
        day,
        Gmail: Math.floor(Math.random() * 200) + 150,
        'Google Drive': Math.floor(Math.random() * 150) + 100,
        Calendar: Math.floor(Math.random() * 100) + 50,
        Docs: Math.floor(Math.random() * 180) + 120,
        Sheets: Math.floor(Math.random() * 120) + 80,
    }));
};

export function LiveAnalytics() {
    const [data] = useState(generateAnalyticsData());

    return (
        <div className="glass-panel-strong rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-1">
                        Live Analytics
                    </h2>
                    <p className="text-sm text-white/60">Google Workspace Activity</p>
                </div>

                {/* Time Range Dropdown */}
                <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-glass-light border border-white/20 text-white text-sm hover:bg-glass-medium transition-colors">
                        Last 7 Days
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis
                            dataKey="day"
                            stroke="#ffffff60"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#ffffff60"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Gmail"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Google Drive"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Calendar"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ fill: '#f59e0b', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Docs"
                            stroke="#eab308"
                            strokeWidth={2}
                            dot={{ fill: '#eab308', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Sheets"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#ef4444', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>updated 4 min ago</span>
            </div>
        </div>
    );
}
