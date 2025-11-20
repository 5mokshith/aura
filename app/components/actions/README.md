# Quick Actions Components

This directory contains components for the Quick Actions Panel feature, which provides users with shortcuts to common tasks.

## Components

### QuickActionsPanel

The main container component that displays quick action buttons. It adapts to different screen sizes:
- **Desktop**: Horizontal layout at the top of the interface
- **Mobile**: Vertical drawer that slides in from the right

**Props:**
- `onActionClick: (prompt: string) => void` - Callback when an action is clicked, receives the pre-filled prompt
- `className?: string` - Optional additional CSS classes

**Features:**
- Responsive design with mobile drawer
- Glassmorphism styling
- Smooth animations
- Overlay backdrop on mobile
- Auto-closes drawer after action selection on mobile

**Usage:**
```tsx
import { QuickActionsPanel } from '@/app/components/actions';

function ChatPage() {
  const handleActionClick = (prompt: string) => {
    // Send prompt to chat interface
    console.log('Action clicked:', prompt);
  };

  return (
    <div>
      <QuickActionsPanel onActionClick={handleActionClick} />
      {/* Rest of your page */}
    </div>
  );
}
```

### QuickActionButton

Individual action button with icon and label. Features glassmorphism styling with neon glow effects on hover.

**Props:**
- `action: QuickAction` - The action configuration object
- `onClick: (prompt: string) => void` - Callback when button is clicked

**QuickAction Interface:**
```typescript
interface QuickAction {
  id: string;           // Unique identifier
  label: string;        // Display text
  icon: LucideIcon;     // Icon component from lucide-react
  prompt: string;       // Pre-filled prompt text
  color: 'cyan' | 'purple' | 'pink' | 'blue';  // Neon color theme
}
```

**Features:**
- Glassmorphism button styling
- Color-coded neon glow effects (cyan, purple, pink, blue)
- Hover animations with scale and glow
- Active state with scale-down effect
- Accessible with ARIA labels
- Touch-friendly minimum size (44x44px)

**Usage:**
```tsx
import { QuickActionButton, QuickAction } from '@/app/components/actions';
import { Mail } from 'lucide-react';

const action: QuickAction = {
  id: 'gmail',
  label: 'Open Gmail',
  icon: Mail,
  prompt: 'Show my latest emails',
  color: 'cyan',
};

function MyComponent() {
  return (
    <QuickActionButton
      action={action}
      onClick={(prompt) => console.log(prompt)}
    />
  );
}
```

## Default Actions

The panel includes 6 pre-configured actions:

1. **Open Gmail** (Cyan) - "Show my latest emails"
2. **Find a file** (Blue) - "Search my Drive"
3. **Create event** (Purple) - "Add calendar event"
4. **Summarize doc** (Pink) - "Summarize a document"
5. **New Google Doc** (Cyan) - "Create a new Google Doc"
6. **Draft email** (Purple) - "Draft an email"

## Styling

The components use:
- Glassmorphism CSS utilities from `app/styles/glassmorphism.css`
- Tailwind CSS for responsive design
- Custom neon color classes (cyan, purple, pink, blue)
- Smooth transitions and animations

## Responsive Behavior

### Desktop (≥768px)
- Horizontal layout
- All actions visible
- Fixed positioning at top of page

### Mobile (<768px)
- Toggle button in top-right corner
- Vertical drawer slides from right
- Overlay backdrop when open
- Auto-closes after action selection

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Touch-friendly button sizes (minimum 44x44px)
- High contrast neon colors for visibility
- Focus states with neon glow effects

## Requirements Satisfied

- **3.1**: Quick Actions Panel displays at top/left of interface
- **3.2**: Provides buttons for common tasks with pre-filled prompts
- **3.3**: Triggers chat with pre-filled prompts on click
- **3.4**: Glassmorphism styling with glowing effects on hover
- **3.5**: Remains accessible while scrolling (fixed positioning)
- **4.2**: Glassmorphism design with neon accents
- **4.3**: Neon accent colors for interactive elements
