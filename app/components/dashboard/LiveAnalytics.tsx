'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

/**
 * LiveAnalytics Component
 * 
 * Display multi-line chart showing Google Workspace activity over time
 */

// Sample data for demonstration
const generateAnalyticsData = (days: number) => {
    const dayLabels: string[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dayLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    return dayLabels.map((day) => ({
        day,
        Gmail: Math.floor(Math.random() * 200) + 150,
        'Google Drive': Math.floor(Math.random() * 150) + 100,
        Calendar: Math.floor(Math.random() * 100) + 50,
        Docs: Math.floor(Math.random() * 180) + 120,
        Sheets: Math.floor(Math.random() * 120) + 80,
    }));
};

interface LiveAnalyticsProps {
    data?: {
        day: string;
        Gmail: number;
        'Google Drive': number;
        Calendar: number;
        Docs: number;
        Sheets: number;
    }[];
}

type TimeRange = {
    label: string;
    days: number;
};

const timeRanges: TimeRange[] = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 14 Days', days: 14 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
];

export function LiveAnalytics({ data }: LiveAnalyticsProps) {
    const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[0]);
    const [chartData, setChartData] = useState(generateAnalyticsData(7));

    // Update chart data when range changes
    useEffect(() => {
        if (data && data.length) {
            // If real data is provided, filter it based on the selected range
            const filteredData = data.slice(-selectedRange.days);
            setChartData(filteredData);
        } else {
            // Otherwise, generate sample data
            setChartData(generateAnalyticsData(selectedRange.days));
        }
    }, [selectedRange, data]);

    const handleRangeSelect = (range: TimeRange) => {
        setSelectedRange(range);
    };

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
                <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
                        <span>{selectedRange.label}</span>
                        <ChevronDown className="w-3 h-3 text-white/50" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-40 bg-[#0A0C14] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {timeRanges.map((range) => (
                            <button
                                key={range.days}
                                onClick={() => handleRangeSelect(range)}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedRange.days === range.days
                                        ? 'text-white bg-blue-600'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
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
