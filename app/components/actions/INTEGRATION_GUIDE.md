# QuickActionsPanel Integration Guide

This guide shows how to integrate the QuickActionsPanel with the ChatInterface component.

## Basic Integration

### Option 1: Wrap ChatInterface with QuickActionsPanel

```tsx
// app/page.tsx or your main chat page
import { ChatInterface } from './components/chat/ChatInterface';
import { QuickActionsPanel } from './components/actions';

export default function HomePage() {
  const handleQuickAction = (prompt: string) => {
    // The prompt will be sent to the chat
    // You can either:
    // 1. Trigger the chat input directly
    // 2. Use a ref to call ChatInterface methods
    // 3. Use state management to pass the prompt
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Quick Actions at the top */}
      <QuickActionsPanel 
        onActionClick={handleQuickAction}
        className="mt-4 mx-4"
      />
      
      {/* Chat Interface below */}
      <ChatInterface className="flex-1" />
    </main>
  );
}
```

### Option 2: Using State to Pass Prompts

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from './components/chat/ChatInterface';
import { QuickActionsPanel } from './components/actions';

export default function HomePage() {
  const [quickActionPrompt, setQuickActionPrompt] = useState<string | null>(null);

  const handleQuickAction = (prompt: string) => {
    setQuickActionPrompt(prompt);
  };

  // When a quick action is triggered, send it to chat
  useEffect(() => {
    if (quickActionPrompt) {
      // This will be handled by ChatInterface's onSendMessage
      setQuickActionPrompt(null);
    }
  }, [quickActionPrompt]);

  const handleSendMessage = async (message: string) => {
    // Your API call logic here
    console.log('Sending message:', message);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <QuickActionsPanel 
        onActionClick={handleQuickAction}
        className="mt-4 mx-4"
      />
      
      <ChatInterface 
        className="flex-1"
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}
```

### Option 3: Using Refs (Advanced)

```tsx
'use client';

import { useRef } from 'react';
import { ChatInterface } from './components/chat/ChatInterface';
import { QuickActionsPanel } from './components/actions';

export default function HomePage() {
  const chatRef = useRef<{ sendMessage: (msg: string) => void }>(null);

  const handleQuickAction = (prompt: string) => {
    // Directly trigger the chat to send the message
    chatRef.current?.sendMessage(prompt);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <QuickActionsPanel 
        onActionClick={handleQuickAction}
        className="mt-4 mx-4"
      />
      
      <ChatInterface 
        ref={chatRef}
        className="flex-1"
      />
    </main>
  );
}
```

## Layout Recommendations

### Full-Width Layout (Recommended)

```tsx
<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
  {/* Quick Actions Panel - Full Width */}
  <div className="sticky top-0 z-40 px-4 pt-4">
    <QuickActionsPanel onActionClick={handleQuickAction} />
  </div>

  {/* Main Content Area */}
  <div className="flex-1 flex">
    {/* Chat Interface */}
    <div className="flex-1">
      <ChatInterface />
    </div>

    {/* Task Visualizer (Optional) */}
    <div className="hidden lg:block w-80">
      <TaskVisualizer />
    </div>
  </div>
</div>
```

### Sidebar Layout

```tsx
<div className="min-h-screen flex">
  {/* Left Sidebar with Quick Actions */}
  <aside className="hidden lg:flex w-64 flex-col gap-4 p-4 glass-sidebar">
    <h2 className="text-lg font-display text-white">Quick Actions</h2>
    <QuickActionsPanel onActionClick={handleQuickAction} />
  </aside>

  {/* Main Chat Area */}
  <main className="flex-1">
    <ChatInterface />
  </main>

  {/* Right Sidebar with Task Visualizer */}
  <aside className="hidden xl:block w-80">
    <TaskVisualizer />
  </aside>
</div>
```

## Styling Customization

### Custom Colors

You can customize the quick action colors by modifying the `quickActions` array in `QuickActionsPanel.tsx`:

```tsx
const quickActions: QuickAction[] = [
  {
    id: 'custom',
    label: 'Custom Action',
    icon: YourIcon,
    prompt: 'Your custom prompt',
    color: 'cyan', // or 'purple', 'pink', 'blue'
  },
];
```

### Custom Positioning

```tsx
// Fixed at top
<QuickActionsPanel 
  onActionClick={handleQuickAction}
  className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
/>

// Sticky at top
<QuickActionsPanel 
  onActionClick={handleQuickAction}
  className="sticky top-4 z-40"
/>

// Absolute positioning
<QuickActionsPanel 
  onActionClick={handleQuickAction}
  className="absolute top-20 left-4 right-4"
/>
```

## Mobile Considerations

The QuickActionsPanel automatically adapts to mobile:
- **Desktop**: Horizontal layout with all actions visible
- **Mobile**: Toggle button + slide-in drawer

No additional configuration needed!

## Accessibility

The components are built with accessibility in mind:
- Keyboard navigation support
- ARIA labels for screen readers
- Touch-friendly button sizes (44x44px minimum)
- High contrast neon colors
- Focus states with visual feedback

## Performance Tips

1. **Memoize the callback**: Use `useCallback` for `onActionClick` to prevent unnecessary re-renders

```tsx
const handleQuickAction = useCallback((prompt: string) => {
  // Your logic here
}, []);
```

2. **Lazy load on mobile**: Only render the panel when needed on mobile devices

```tsx
const [showQuickActions, setShowQuickActions] = useState(false);

// Only render on desktop or when explicitly shown on mobile
{(isDesktop || showQuickActions) && (
  <QuickActionsPanel onActionClick={handleQuickAction} />
)}
```

## Testing

Example test for integration:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickActionsPanel } from './QuickActionsPanel';

test('triggers callback with correct prompt', () => {
  const mockCallback = jest.fn();
  render(<QuickActionsPanel onActionClick={mockCallback} />);
  
  const gmailButton = screen.getByLabelText('Open Gmail');
  fireEvent.click(gmailButton);
  
  expect(mockCallback).toHaveBeenCalledWith('Show my latest emails');
});
```

## Troubleshooting

### Actions not triggering chat

Make sure the `onActionClick` callback is properly connected to your chat submission logic.

### Mobile drawer not opening

Check that the glassmorphism CSS is properly imported in your global styles.

### Styling issues

Ensure `app/styles/glassmorphism.css` is imported in `app/styles/globals.css`:

```css
@import './glassmorphism.css';
```

## Next Steps

After integration, you can:
1. Customize the default actions to match your use cases
2. Add analytics tracking to action clicks
3. Implement action history/favorites
4. Add keyboard shortcuts for quick actions
5. Create custom action groups for different user roles
