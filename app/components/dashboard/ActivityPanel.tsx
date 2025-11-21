'use client';

import { useState } from 'react';
import { useTaskHistory, TaskHistoryItem } from '../../hooks/useTaskHistory';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function ActivityPanel() {
    const [filter, setFilter] = useState<'all' | 'completed'>('all');
    const { data, isLoading, error, refetch } = useTaskHistory({
        limit: 10,
        status: filter === 'completed' ? 'success' : undefined,
    });

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-medium text-green-500">Completed</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs font-medium text-red-500">Error</span>
                    </div>
                );
            case 'in-progress':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                        <span className="text-xs font-medium text-amber-500">In Progress</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-blue-500">Pending</span>
                    </div>
                );
        }
    };

    return (
        <aside className="w-80 lg:w-96 h-screen fixed right-0 top-0 bg-[#0B0D12] border-l border-white/5 p-6 overflow-y-auto z-40">
            {/* Header & Filters */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Activity</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'all'
                            ? 'bg-[#6366F1] text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'completed'
                            ? 'bg-[#6366F1] text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm mb-4">Unable to load activity</p>
                        <button
                            onClick={() => refetch()}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                            Try again
                        </button>
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">
                        No recent activity
                    </div>
                ) : (
                    data?.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            formatTimeAgo={formatTimeAgo}
                            getStatusBadge={getStatusBadge}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}

interface TaskCardProps {
    task: TaskHistoryItem;
    formatTimeAgo: (dateString: string) => string;
    getStatusBadge: (status: string) => React.ReactElement;
}

function TaskCard({ task, formatTimeAgo, getStatusBadge }: TaskCardProps) {
    const isInProgress = task.status === 'in-progress';
    const isCompleted = task.status === 'success';
    const isFailed = task.status === 'failed';

    return (
        <article className="p-5 rounded-xl bg-[#1A1D24] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug pr-4">{task.title}</h3>
                <div className="shrink-0">
                    {getStatusBadge(task.status)}
                </div>
            </div>

            {task.output_summary && (
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{task.output_summary}</p>
            )}

            {/* Progress Bar for in-progress tasks */}
            {isInProgress && (
                <div className="mb-4">
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-1/3" />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                    {isInProgress ? 'Started ' : isCompleted ? 'Completed ' : isFailed ? 'Failed ' : ''}
                    {task.created_at ? formatTimeAgo(task.created_at) : 'Unknown'}
                </span>

                {/* Action Links */}
                {isCompleted && (
                    <button className="text-[#6366F1] hover:text-[#818cf8] font-medium transition-colors">
                        View Draft
                    </button>
                )}

                {isFailed && (
                    <button className="text-[#6366F1] hover:text-[#818cf8] font-medium transition-colors">
                        Retry
                    </button>
                )}
            </div>
        </article>
    );
}
