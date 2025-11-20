import { ChatInterface } from './components/chat/ChatInterface';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ChatInterface className="h-screen" />
    </main>
  );
}
