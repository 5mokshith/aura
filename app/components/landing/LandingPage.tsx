'use client';

import Link from 'next/link';
import { Mail, Calendar, FileText, Zap } from 'lucide-react';


export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050609] text-white">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0D12]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-purple-500" fill="currentColor" />
                        <span className="text-xl font-bold">AURA</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                            How It Works
                        </Link>
                        <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                            Security
                        </Link>
                        <Link href="/dashboard" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Put Your Google Workspace on <br />
                        <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                            Autopilot
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        AURA is an AI agent that understands your workspace as it manages e-mails,
                        schedules meetings, and more.
                    </p>
                    <Link
                        href="/api/auth/google/redirect"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Zap className="w-5 h-5" />
                        Connect Google Account
                    </Link>
                </div>

                {/* Abstract Wave Visual */}
                <div className="max-w-4xl mx-auto mt-16 relative">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-transparent border border-white/5 relative">
                        {/* Animated gradient waves */}
                        <div className="absolute inset-0 opacity-70">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 animate-pulse"></div>
                            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-purple-600/40 to-transparent blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-600/40 to-transparent blur-3xl"></div>
                        </div>
                        {/* Wave pattern overlay */}
                        <div className="absolute inset-0 opacity-30">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute left-0 right-0 h-12 border-b border-purple-500/20"
                                    style={{
                                        top: `${12.5 * i}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        What AURA Can Do for You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Automate Inbox */}
                        <div className="p-8 rounded-xl bg-[#1A1D24] border border-white/5 hover:border-purple-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <Mail className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Automate Your Inbox</h3>
                            <p className="text-gray-400">
                                Smart email triage, draft generation, and priority routing.
                            </p>
                        </div>

                        {/* Effortless Scheduling */}
                        <div className="p-8 rounded-xl bg-[#1A1D24] border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Effortless Scheduling</h3>
                            <p className="text-gray-400">
                                Find optimal times, coordinate events, and schedule recurring tasks.
                            </p>
                        </div>

                        {/* Organize Documents */}
                        <div className="p-8 rounded-xl bg-[#1A1D24] border border-white/5 hover:border-cyan-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                <FileText className="w-6 h-6 text-cyan-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Organize Your Documents</h3>
                            <p className="text-gray-400">
                                Find files faster, collaborate smarter, and automate workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-6 bg-[#0B0D12]/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Connect Securely</h3>
                            <p className="text-gray-400">
                                Link via Google OAuth with enterprise-grade security using OAuth.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Describe Your Task</h3>
                            <p className="text-gray-400">
                                Use natural language to tell AURA what you need it to do—it's in plain English.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Let AURA Work</h3>
                            <p className="text-gray-400">
                                AURA works in the background, intelligently taking action in real-time or as a cron job.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
                    © 2025 AURA. Built with AI for the future of work.
                </div>
            </footer>
        </div>
    );
}
