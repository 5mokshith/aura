'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowUp,
    Circle,
    Info,
    Square,
    Key,
    Settings,
    Search,
    Filter,
    ChevronRight,
    ChevronDown
} from 'lucide-react';

interface HistoryItem {
    id: string;
    title: string;
    timestamp: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'update' | 'maintenance';
    icon: 'arrow-up' | 'circle' | 'info' | 'square' | 'key' | 'settings';
    conversationId?: string;
    status: string;
    rawDate: Date;
}

interface FullHistoryListProps {
    initialItems: any[];
}

export function FullHistoryList({ initialItems }: FullHistoryListProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const mapTaskToHistoryItem = (task: any): HistoryItem => {
        let type: HistoryItem['type'] = 'info';
        if (task.status === 'success') type = 'success';
        else if (task.status === 'failed') type = 'error';
        else if (task.status === 'rerun') type = 'update';

        const icon: HistoryItem['icon'] =
            type === 'success' ? 'arrow-up' : type === 'error' ? 'circle' : 'info';

        return {
            id: task.id,
            title: task.title || 'Untitled Task',
            timestamp: new Date(task.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }),
            rawDate: new Date(task.created_at),
            type,
            icon,
            conversationId: task.conversation_id,
            status: task.status,
        };
    };

    const allItems = initialItems.map(mapTaskToHistoryItem);

    const filteredItems = allItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleItemClick = (conversationId?: string) => {
        if (conversationId) {
            router.push(`/?conversationId=${conversationId}`);
        }
    };

    const getIcon = (iconType: string) => {
        const iconClass = 'w-4 h-4';
        switch (iconType) {
            case 'arrow-up': return <ArrowUp className={iconClass} />;
            case 'circle': return <Circle className={iconClass} />;
            case 'info': return <Info className={iconClass} />;
            case 'square': return <Square className={iconClass} />;
            case 'key': return <Key className={iconClass} />;
            case 'settings': return <Settings className={iconClass} />;
            default: return <Info className={iconClass} />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-400 bg-green-400/10';
            case 'error': return 'text-red-400 bg-red-400/10';
            case 'info': return 'text-blue-400 bg-blue-400/10';
            case 'warning': return 'text-orange-400 bg-orange-400/10';
            case 'update': return 'text-yellow-400 bg-yellow-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusBadge = (status: string, type: string) => {
        let colorClass = 'bg-gray-500/10 text-gray-400';
        if (type === 'success') colorClass = 'bg-green-500/10 text-green-400';
        if (type === 'error') colorClass = 'bg-red-500/10 text-red-400';
        if (type === 'update') colorClass = 'bg-yellow-500/10 text-yellow-400';

        return (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Controls Header */}
            <div className="glass-panel-strong rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by task or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/40">Filter by:</span>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
                            <span>{filterType === 'all' ? 'All Events' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                            <ChevronDown className="w-3 h-3 text-white/50" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#0A0C14] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            {['all', 'success', 'error', 'info'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Items */}
            <div className="space-y-3 max-h-[65vh] overflow-y-auto">
                {filteredItems.length === 0 ? (
                    <div className="glass-panel-strong rounded-xl py-12 text-center text-white/30 text-sm">
                        No history found matching your criteria.
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.conversationId)}
                            className="
                group relative
                glass-panel-strong rounded-xl
                grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-4 items-center
                hover:bg-white/10 hover:border-white/20
                hover:scale-[1.02] hover:shadow-lg hover:shadow-neon-cyan/10
                transition-all duration-300 ease-out
                cursor-pointer
                transform-gpu
              "
                        >
                            {/* Date Column */}
                            <div className="w-40 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getIconColor(item.type)}`}>
                                    {getIcon(item.icon)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-white font-medium">
                                        {item.timestamp.split(',')[0]}
                                    </span>
                                    <span className="text-xs text-white/40">
                                        {item.timestamp.split(',')[1]}
                                    </span>
                                </div>
                            </div>

                            {/* Activity Column */}
                            <div className="min-w-0">
                                <p className="text-sm text-white/90 truncate group-hover:text-neon-cyan transition-colors font-medium">
                                    {item.title}
                                </p>
                            </div>

                            {/* Status Column */}
                            <div className="w-24 flex justify-center">
                                {getStatusBadge(item.status, item.type)}
                            </div>

                            {/* Action Column */}
                            <div className="w-8 flex justify-end text-white/20 group-hover:text-white/60 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
