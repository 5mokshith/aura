'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLayout } from '@/app/components/layout/PageLayout';
import { CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TaskDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'logs' | 'output' | 'errors'>('logs');

    // Mock data - in production, fetch from API using params.id
    const task = {
        id: params.id as string,
        title: 'Monthly Sales Report Generation',
        status: 'success',
        agent: 'Data Analyst Agent',
        startTime: '2023-10-27 10:00:00 AM',
        endTime: '2023-10-27 10:02:30 AM',
        duration: '2 minutes 30 seconds',
        trigger: 'Triggered by \'New Form Entry\' from Google Forms.',
        executionSteps: [
            { id: 1, title: 'Initialize and Authenticate', completed: true },
            { id: 2, title: 'Fetch Data from Google Sheet', completed: true },
            { id: 3, title: 'Process and Analyze Data', completed: true },
            { id: 4, title: 'Generate Report in Google Docs', completed: true },
            { id: 5, title: 'Send Notification via Gmail', completed: true },
        ],
        logs: [
            { time: '10:00:00', level: 'INFO', message: 'Task started. Triggered by Google Form entry.' },
            { time: '10:00:01', level: 'INFO', message: 'Authenticating with Google Workspace APIs...' },
            { time: '10:00:15', level: 'INFO', message: 'Successfully authenticated.' },
            { time: '10:00:16', level: 'INFO', message: 'Fetching data from Google Sheet: \'sales_data.csv\'.' },
            { time: '10:01:05', level: 'INFO', message: 'Data fetched successfully. 1,532 rows read.' },
            { time: '10:01:06', level: 'INFO', message: 'Starting data processing and analysis.' },
            { time: '10:01:45', level: 'WARN', message: 'Found 12 rows with missing \'region\' data. Proceeding with imputation.' },
            { time: '10:01:50', level: 'INFO', message: 'Data analysis complete. Generating report in Google Docs.' },
            { time: '10:02:00', level: 'INFO', message: 'Report generated. Sending notification via Gmail to management@example.com.' },
            { time: '10:02:25', level: 'INFO', message: 'Report generated. Sending notification via Gmail to management@example.com.' },
            { time: '10:02:30', level: 'INFO', message: 'Task completed successfully.' },
        ],
    };

    const getStatusBadge = () => {
        switch (task.status) {
            case 'success':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Success</span>
                    </div>
                );
            case 'in-progress':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-500">In Progress</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">Failed</span>
                    </div>
                );
        }
    };

    return (
        <PageLayout>
            <div className="min-h-screen bg-[#050609] text-white p-6 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <button onClick={() => router.push('/timeline')} className="hover:text-white transition-colors">
                            All Tasks
                        </button>
                        <span>/</span>
                        <span className="text-white">{task.title}</span>
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{task.title}</h1>
                                {getStatusBadge()}
                            </div>
                            <p className="text-gray-400 text-sm">Task ID: {task.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded-lg bg-[#1A1D24] border border-white/10 hover:border-white/20 text-white transition-all">
                                Clone
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-[#1A1D24] border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all">
                                Delete
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558DD] text-white transition-all">
                                Re-run Task
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Task Summary & Execution Flow */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Task Summary */}
                            <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Task Summary</h2>
                                <p className="text-sm text-gray-400 mb-6">{task.trigger}</p>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        <p className="text-sm text-white">Success</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Agent Used</p>
                                        <p className="text-sm text-white">{task.agent}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Start Time</p>
                                        <p className="text-sm text-white">{task.startTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">End Time</p>
                                        <p className="text-sm text-white">{task.endTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                                        <p className="text-sm text-white">{task.duration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Execution Flow */}
                            <div className="bg-[#1A1D24] border border-white/5 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Execution Flow</h2>
                                <div className="space-y-3">
                                    {task.executionSteps.map((step) => (
                                        <div key={step.id} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.completed ? 'bg-green-500' : 'bg-gray-700'
                                                }`}>
                                                {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <p className={`text-sm ${step.completed ? 'text-white' : 'text-gray-500'}`}>
                                                {step.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Logs/Output/Errors */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#1A1D24] border border-white/5 rounded-xl overflow-hidden">
                                {/* Tabs */}
                                <div className="flex items-center gap-1 border-b border-white/5 px-6">
                                    <button
                                        onClick={() => setActiveTab('logs')}
                                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'logs'
                                                ? 'text-[#6366F1]'
                                                : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Logs
                                        {activeTab === 'logs' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('output')}
                                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'output'
                                                ? 'text-[#6366F1]'
                                                : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Output
                                        {activeTab === 'output' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('errors')}
                                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'errors'
                                                ? 'text-[#6366F1]'
                                                : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Error Details
                                        {activeTab === 'errors' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366F1]" />
                                        )}
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    {activeTab === 'logs' && (
                                        <div className="font-mono text-xs space-y-1">
                                            {task.logs.map((log, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <span className="text-gray-500 shrink-0">{log.time}</span>
                                                    <span className={`shrink-0 ${log.level === 'INFO' ? 'text-blue-400' :
                                                            log.level === 'WARN' ? 'text-amber-400' :
                                                                'text-red-400'
                                                        }`}>
                                                        [{log.level}]
                                                    </span>
                                                    <span className="text-gray-300">{log.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'output' && (
                                        <div className="text-gray-400 text-sm">
                                            <p>No output data available for this task.</p>
                                        </div>
                                    )}
                                    {activeTab === 'errors' && (
                                        <div className="text-gray-400 text-sm">
                                            <p>No errors encountered during execution.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
