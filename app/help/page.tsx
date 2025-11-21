import { PageLayout } from '@/app/components/layout/PageLayout';

export default function HelpPage() {
    return (
        <PageLayout>
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Help & Documentation</h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Learn how to get the most out of AURA AI
                    </p>
                    <div className="glass-panel rounded-xl p-8 text-left">
                        <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li>• Use natural language to describe what you want AURA to do</li>
                            <li>• AURA can access your Gmail, Drive, Docs, Sheets, and Calendar</li>
                            <li>• View your task history in the Activity panel on the right</li>
                            <li>• Manage your Google Workspace integrations in Settings</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
