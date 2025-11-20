# Glassmorphism Design System

This document describes the glassmorphism design system implemented for AURA, including reusable components, CSS utilities, and usage guidelines.

## Overview

The AURA glassmorphism design system provides a modern, futuristic UI with frosted glass effects, neon accents, and smooth animations. All components are built with accessibility in mind and follow WCAG 2.1 Level AA standards.

## Design Tokens

### Colors

#### Neon Accent Colors
- **Cyan**: `#00f0ff` - Primary accent color
- **Purple**: `#a855f7` - Secondary accent color
- **Pink**: `#ec4899` - Tertiary accent color
- **Blue**: `#3b82f6` - Quaternary accent color

#### Glass Background Colors
- **Light**: `rgba(255, 255, 255, 0.1)` - Default glass background
- **Medium**: `rgba(255, 255, 255, 0.15)` - Medium opacity glass
- **Strong**: `rgba(255, 255, 255, 0.2)` - Strong glass effect
- **Dark**: `rgba(0, 0, 0, 0.2)` - Dark glass overlay
- **Darker**: `rgba(0, 0, 0, 0.3)` - Darker glass overlay

### Backdrop Blur

- **glass**: `20px` - Default blur
- **glass-md**: `24px` - Medium blur
- **glass-lg**: `32px` - Large blur
- **glass-strong**: `40px` - Strong blur
- **glass-xl**: `48px` - Extra large blur

### Shadows

#### Glass Shadows
- **glass**: `0 8px 32px rgba(0, 0, 0, 0.1)` - Default shadow
- **glass-sm**: `0 4px 16px rgba(0, 0, 0, 0.08)` - Small shadow
- **glass-md**: `0 12px 40px rgba(0, 0, 0, 0.12)` - Medium shadow
- **glass-lg**: `0 16px 48px rgba(0, 0, 0, 0.15)` - Large shadow
- **glass-strong**: `0 8px 32px rgba(0, 0, 0, 0.2)` - Strong shadow
- **glass-xl**: `0 20px 60px rgba(0, 0, 0, 0.25)` - Extra large shadow

#### Neon Glow Shadows
- **neon-cyan**: `0 0 20px rgba(0, 240, 255, 0.5)`
- **neon-purple**: `0 0 20px rgba(168, 85, 247, 0.5)`
- **neon-pink**: `0 0 20px rgba(236, 72, 153, 0.5)`
- **neon-blue**: `0 0 20px rgba(59, 130, 246, 0.5)`

### Animations

- **fade-in**: `0.3s ease-in-out` - Fade in animation
- **slide-up**: `0.4s ease-out` - Slide up animation
- **slide-down**: `0.4s ease-out` - Slide down animation
- **glow-pulse**: `2s ease-in-out infinite` - Pulsing glow effect
- **scale-in**: `0.3s ease-out` - Scale in animation

## CSS Utility Classes

### Glass Panels

```css
.glass-panel          /* Default glass panel */
.glass-panel-sm       /* Small glass panel */
.glass-panel-md       /* Medium glass panel */
.glass-panel-strong   /* Strong glass panel */
.glass-panel-xl       /* Extra large glass panel */
```

### Glass Buttons

```css
.glass-button         /* Default glass button */
.glass-button-cyan    /* Cyan neon glass button */
.glass-button-purple  /* Purple neon glass button */
.glass-button-pink    /* Pink neon glass button */
.glass-button-blue    /* Blue neon glass button */
```

### Message Bubbles

```css
.message-user         /* User message bubble (right-aligned) */
.message-assistant    /* Assistant message bubble (left-aligned) */
```

### Task Cards

```css
.task-card            /* Default task card */
.task-card-pending    /* Pending task card */
.task-card-running    /* Running task card (with glow pulse) */
.task-card-completed  /* Completed task card */
.task-card-failed     /* Failed task card */
```

### Status Indicators

```css
.status-pending       /* Pending status badge */
.status-running       /* Running status badge (with glow pulse) */
.status-completed     /* Completed status badge */
.status-failed        /* Failed status badge */
```

### Other Utilities

```css
.glass-input          /* Glass input field */
.glass-card           /* Glass card */
.glass-modal          /* Glass modal */
.glass-overlay        /* Glass overlay */
.glass-sidebar        /* Glass sidebar */
.glass-header         /* Glass header */
.floating-input-bar   /* Floating input bar */
```

## React Components

### Button

A reusable button component with glassmorphism styling and neon glow effects.

```tsx
import { Button } from '@/app/components/ui';

// Default button
<Button onClick={handleClick}>Click Me</Button>

// Cyan neon button
<Button variant="cyan" onClick={handleClick}>
  Cyan Button
</Button>

// Large purple button
<Button variant="purple" size="lg" onClick={handleClick}>
  Large Purple Button
</Button>

// Loading state
<Button variant="pink" isLoading>
  Loading...
</Button>

// Disabled button
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: `'default' | 'cyan' | 'purple' | 'pink' | 'blue'` (default: `'default'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `isLoading`: `boolean` - Shows loading spinner
- All standard HTML button attributes

### Input

A reusable input component with glassmorphism styling and neon focus effects.

```tsx
import { Input } from '@/app/components/ui';

// Basic input
<Input
  type="text"
  placeholder="Enter text"
/>

// Input with label
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

// Required input
<Input
  label="Password"
  type="password"
  isRequired
/>

// Input with helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Input with error
<Input
  label="Email"
  type="email"
  errorText="Invalid email address"
/>
```

**Props:**
- `label`: `string` - Input label
- `helperText`: `string` - Helper text below input
- `errorText`: `string` - Error message (shows error state)
- `isRequired`: `boolean` - Marks field as required
- All standard HTML input attributes

### Modal

A reusable modal dialog with glassmorphism styling and accessibility features.

```tsx
import { Modal } from '@/app/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-4 mt-4">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="default" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  </div>
</Modal>

// Large modal without close button
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Large Modal"
  size="lg"
  showCloseButton={false}
>
  <p>Modal content...</p>
</Modal>
```

**Props:**
- `isOpen`: `boolean` - Controls modal visibility
- `onClose`: `() => void` - Close handler
- `title`: `string` - Modal title
- `size`: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `showCloseButton`: `boolean` (default: `true`)
- `closeOnOverlayClick`: `boolean` (default: `true`)
- `closeOnEscape`: `boolean` (default: `true`)
- `className`: `string` - Additional CSS classes

**Features:**
- Focus trapping
- Keyboard navigation (Tab, Shift+Tab, Escape)
- ARIA attributes for accessibility
- Prevents body scroll when open
- Restores focus on close

## Accessibility Features

All components follow WCAG 2.1 Level AA standards:

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators with 2px cyan outline
- Tab order follows logical flow
- Escape key closes modals

### Touch-Friendly
- Minimum 44x44px touch targets
- Touch feedback animations
- No tap highlight color

### Screen Reader Support
- Proper ARIA labels and roles
- Live regions for dynamic content
- Semantic HTML structure

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Disables animations when requested

### High Contrast
- Increased border widths in high contrast mode
- Enhanced focus indicators

### Color Contrast
- All text meets 4.5:1 contrast ratio
- Status colors are distinguishable

## Responsive Design

All components are mobile-first and responsive:

### Breakpoints
- `xs`: 320px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Responsive Utilities
```css
.hide-mobile      /* Hidden on mobile, visible on tablet+ */
.show-mobile      /* Visible on mobile, hidden on tablet+ */
.hide-tablet      /* Hidden on tablet only */
.show-tablet      /* Visible on tablet only */
.hide-desktop     /* Hidden on desktop */
.show-desktop     /* Visible on desktop only */
```

## Usage Guidelines

### Do's
✅ Use glassmorphism for panels, cards, and overlays
✅ Apply neon accents for interactive elements
✅ Use smooth animations (200-400ms)
✅ Ensure minimum 44x44px touch targets
✅ Provide keyboard navigation
✅ Include ARIA labels

### Don'ts
❌ Don't overuse neon colors
❌ Don't create animations longer than 500ms
❌ Don't use glass effects on small text
❌ Don't forget focus indicators
❌ Don't ignore reduced motion preferences

## Examples

### Glass Panel with Content
```tsx
<div className="glass-panel p-6 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Panel Title</h2>
  <p className="text-white/80">Panel content goes here...</p>
</div>
```

### Neon Button with Icon
```tsx
<Button variant="cyan" className="gap-2">
  <MailIcon className="w-5 h-5" />
  Send Email
</Button>
```

### Task Card with Status
```tsx
<div className="task-card-running">
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold">Task Title</h3>
    <span className="status-running">Running</span>
  </div>
  <p className="text-sm text-white/70">Task description...</p>
</div>
```

### Floating Input Bar
```tsx
<div className="floating-input-bar">
  <Input
    type="text"
    placeholder="Type your message..."
    className="bg-transparent border-none"
  />
  <Button variant="cyan">Send</Button>
</div>
```

## Performance Considerations

- Use `backdrop-filter` with caution (can be GPU-intensive)
- Limit the number of animated elements on screen
- Use `will-change` sparingly
- Optimize images with Next.js Image component
- Lazy load heavy components

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with `-webkit-` prefixes)
- Mobile browsers: Full support

## Resources

- [Tailwind CSS Configuration](../../../tailwind.config.ts)
- [Glassmorphism CSS](../../styles/glassmorphism.css)
- [Global Styles](../../styles/globals.css)
- [Design Document](.kiro/specs/aura-ui-system/design.md)
- [Requirements](.kiro/specs/aura-ui-system/requirements.md)
