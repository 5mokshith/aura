import { AppShell } from '@/app/components/layout/AppShell';
import { FullHistoryList } from '@/app/components/history/FullHistoryList';
import { getAllHistory } from '@/app/actions/chat';
import { getUserSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'History | AURA',
    description: 'View your past activity and conversations.',
};

export default async function HistoryPage() {
    const session = await getUserSession();

    if (!session) {
        redirect('/');
    }

    const history = await getAllHistory(session.userId);

    return (
        <AppShell>
            <div className="max-w-5xl mx-auto w-full space-y-8 p-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Activity History
                    </h1>
                    <p className="text-white/60">
                        View and manage your past conversations and tasks.
                    </p>
                </div>

                <FullHistoryList initialItems={history} />
            </div>
        </AppShell>
    );
}
