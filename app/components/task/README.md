# Task Visualization Components

This directory contains the task visualization components for the AURA UI system, implementing glassmorphism design with real-time task tracking.

## Components

### TaskVisualizer

The main component that displays active tasks in a sidebar (desktop) or bottom drawer (mobile).

**Features:**
- Right sidebar layout on desktop (320px-384px width)
- Bottom drawer on mobile (collapsible)
- Real-time task status updates
- Timeline view of subtasks
- Responsive and touch-friendly

**Usage:**
```tsx
import { TaskVisualizer } from '@/app/components/task';

function MyPage() {
  const activeTask = {
    id: 'task_123',
    title: 'Send email and create document',
    overallStatus: 'running',
    subtasks: [
      {
        id: 'step_1',
        description: 'Search for email template',
        status: 'completed',
        agent: 'worker',
        googleService: 'drive',
      },
      {
        id: 'step_2',
        description: 'Send email to team',
        status: 'running',
        agent: 'worker',
        googleService: 'gmail',
      },
      {
        id: 'step_3',
        description: 'Create summary document',
        status: 'pending',
        agent: 'worker',
        googleService: 'docs',
      },
    ],
  };

  return <TaskVisualizer activeTask={activeTask} />;
}
```

### TaskCard

A glassmorphism card component for displaying task information with status, services, and agents.

**Features:**
- Glassmorphism styling with colored left border
- Status-based animations (glow pulse for running tasks)
- Google service icons
- Agent badges
- Progress bar (optional)
- Timing information
- Click handler support

**Usage:**
```tsx
import { TaskCard } from '@/app/components/task';

function TaskList() {
  return (
    <TaskCard
      task={{
        id: 'task_456',
        title: 'Create quarterly report',
        status: 'running',
        googleServices: ['docs', 'sheets', 'drive'],
        agents: ['planner', 'worker'],
        progress: 65,
        startTime: new Date(),
      }}
      showProgress
      onClick={() => console.log('Task clicked')}
    />
  );
}
```

### StatusBadge

A versatile status indicator component with multiple variants.

**Features:**
- Four status types: pending, running, completed, failed
- Animated icons (spinning loader for running)
- Glow pulse animation for running status
- Progress ring (optional)
- Multiple sizes: sm, md, lg
- Variants: Badge, Dot, Label, Card

**Usage:**
```tsx
import { StatusBadge, StatusDot, StatusLabel, StatusCard } from '@/app/components/task';

// Standard badge
<StatusBadge status="running" showProgress progress={75} />

// Minimal dot indicator
<StatusDot status="completed" size="md" />

// Text label only
<StatusLabel status="failed" />

// Large status card
<StatusCard
  status="running"
  title="Processing your request"
  description="This may take a few moments..."
/>
```

## Status Types

All components support these status types:

- **pending**: Gray color, clock icon
- **running**: Cyan color, spinning loader, glow pulse animation
- **completed**: Green color, checkmark icon
- **failed**: Red color, X icon

## Google Services

Supported Google Workspace services with icons:

- **gmail**: 📧 (Red accent)
- **drive**: 📁 (Blue accent)
- **docs**: 📄 (Blue accent)
- **sheets**: 📊 (Green accent)
- **calendar**: 📅 (Purple accent)

## Agent Types

Three agent types with color coding:

- **planner**: Purple (neon-purple)
- **worker**: Cyan (neon-cyan)
- **evaluator**: Pink (neon-pink)

## Responsive Behavior

### Desktop (≥768px)
- TaskVisualizer appears as a fixed right sidebar
- Width: 320px (md) to 384px (lg)
- Collapsible with button
- Smooth transitions

### Mobile (<768px)
- TaskVisualizer appears as a bottom drawer
- Collapsible with handle
- Max height: 70vh
- Touch-friendly interactions

## Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation support
- Focus states
- Screen reader friendly
- Minimum touch target sizes (44x44px)

## Styling

Components use:
- Tailwind CSS utilities
- Custom glassmorphism classes from `app/styles/glassmorphism.css`
- CSS variables from `app/styles/globals.css`
- Neon accent colors (cyan, purple, pink)
- Smooth animations and transitions

## TypeScript Types

All components are fully typed using interfaces from:
- `app/types/chat.ts` - TaskStep, GoogleService, AgentType
- `app/types/agent.ts` - Additional agent types

## Examples

See the components in action in:
- Main chat page: `/` (TaskVisualizer in sidebar)
- Timeline page: `/timeline` (TaskCard in list)
- Dashboard: `/dashboard` (StatusBadge for services)
