import { getUserSession } from '@/lib/auth-server';
import { getRecentConversation } from '@/app/actions/chat';
import { ChatInterfaceWithRealtime } from './components/chat/ChatInterfaceWithRealtime';
import { AppShell } from './components/layout/AppShell';
import { Message } from './types/chat';

export default async function HomePage(props: { searchParams: Promise<{ conversationId?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await getUserSession();
  const userId = session?.userId;

  let initialMessages: Message[] = [];
  if (userId && searchParams.conversationId) {
    const conversation = await getRecentConversation(userId, searchParams.conversationId);
    if (conversation) {
      initialMessages = conversation.messages;
    }
  }

  return (
    <AppShell>
      <ChatInterfaceWithRealtime
        userId={userId}
        initialMessages={initialMessages}
        className="h-full"
      />
    </AppShell>
  );
}
