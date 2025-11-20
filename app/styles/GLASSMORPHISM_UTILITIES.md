# Glassmorphism Design System Utilities

This document provides a comprehensive reference for all glassmorphism utilities configured in the AURA UI system.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Glass Panel Utilities](#glass-panel-utilities)
3. [Glass Button Utilities](#glass-button-utilities)
4. [Neon Glow Effects](#neon-glow-effects)
5. [Message Bubbles](#message-bubbles)
6. [Task Cards](#task-cards)
7. [Status Indicators](#status-indicators)
8. [Animations](#animations)
9. [Tailwind Utilities](#tailwind-utilities)

## Color Palette

### Neon Accent Colors

#### Cyan
- **Primary**: `#00f0ff` (var(--neon-cyan))
- **Tailwind**: `neon-cyan-{50-900}`
- **Usage**: Primary interactive elements, running tasks, focus states

#### Purple
- **Primary**: `#a855f7` (var(--neon-purple))
- **Tailwind**: `neon-purple-{50-900}`
- **Usage**: Secondary actions, agent badges, highlights

#### Pink
- **Primary**: `#ec4899` (var(--neon-pink))
- **Tailwind**: `neon-pink-{50-900}`
- **Usage**: Tertiary actions, warnings, special highlights

#### Blue
- **Primary**: `#3b82f6` (var(--neon-blue))
- **Tailwind**: `neon-blue-{50-900}`
- **Usage**: Information, links, secondary highlights

### Glass Background Colors

- `glass-light`: rgba(255, 255, 255, 0.1)
- `glass-medium`: rgba(255, 255, 255, 0.15)
- `glass-strong`: rgba(255, 255, 255, 0.2)
- `glass-dark`: rgba(0, 0, 0, 0.2)
- `glass-darker`: rgba(0, 0, 0, 0.3)

## Glass Panel Utilities

### Base Panels

#### `.glass-panel`
Standard glass panel with medium blur
```css
background-color: var(--glass-light);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

#### `.glass-panel-sm`
Lighter glass panel with less blur
```css
backdrop-filter: blur(12px);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
```

#### `.glass-panel-md`
Medium glass panel
```css
backdrop-filter: blur(24px);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
```

#### `.glass-panel-strong`
Strong glass panel with heavy blur
```css
backdrop-filter: blur(40px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
```

#### `.glass-panel-xl`
Extra large glass panel with maximum blur
```css
backdrop-filter: blur(48px);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
```

### Specialized Panels

- `.glass-card` - Card with hover effects
- `.glass-modal` - Modal dialog styling
- `.glass-overlay` - Backdrop overlay
- `.glass-sidebar` - Sidebar panel
- `.glass-header` - Header bar

## Glass Button Utilities

### Base Button
`.glass-button` - Standard glass button with hover effects

### Neon Variants
- `.glass-button-cyan` - Cyan neon border and glow on hover
- `.glass-button-purple` - Purple neon border and glow on hover
- `.glass-button-pink` - Pink neon border and glow on hover
- `.glass-button-blue` - Blue neon border and glow on hover

### States
- `:hover` - Scale up (1.05) with enhanced glow
- `:active` - Scale down (0.95)
- `:disabled` - 50% opacity, no transform

## Neon Glow Effects

### Cyan Glows
- `.glow-cyan-sm` - Small cyan glow (10px)
- `.glow-cyan` - Medium cyan glow (20px)
- `.glow-cyan-lg` - Large cyan glow (30px)

### Purple Glows
- `.glow-purple-sm` - Small purple glow
- `.glow-purple` - Medium purple glow
- `.glow-purple-lg` - Large purple glow

### Pink Glows
- `.glow-pink-sm` - Small pink glow
- `.glow-pink` - Medium pink glow
- `.glow-pink-lg` - Large pink glow

### Blue Glows
- `.glow-blue-sm` - Small blue glow
- `.glow-blue` - Medium blue glow
- `.glow-blue-lg` - Large blue glow

## Message Bubbles

### `.message-user`
Right-aligned user message bubble
- Max width: 70%
- Border radius: 1rem (except top-right: 0.125rem)
- Animation: slideUp

### `.message-assistant`
Left-aligned assistant message bubble
- Max width: 85%
- Border radius: 1rem (except top-left: 0.125rem)
- Stronger blur (40px)
- Animation: slideUp

## Task Cards

### `.task-card`
Base task card with cyan left border

### Status Variants
- `.task-card-pending` - Gray left border
- `.task-card-running` - Cyan left border with glow pulse animation
- `.task-card-completed` - Green left border (#22c55e)
- `.task-card-failed` - Red left border (#ef4444)

### Hover Effects
All task cards have:
- Transform: translateY(-2px)
- Enhanced shadow
- Lighter background

## Status Indicators

### `.status-pending`
Gray badge for pending tasks

### `.status-running`
Cyan badge with glow pulse animation

### `.status-completed`
Green badge for completed tasks

### `.status-failed`
Red badge for failed tasks

## Animations

### Fade Animations
- `animate-fade-in` - 300ms fade in
- `animate-fade-in-fast` - 200ms fade in
- `animate-fade-in-slow` - 500ms fade in

### Slide Animations
- `animate-slide-up` - Slide up from 20px
- `animate-slide-up-fast` - Fast slide up (300ms)
- `animate-slide-down` - Slide down from -20px
- `animate-slide-left` - Slide from right
- `animate-slide-right` - Slide from left

### Glow Animations
- `animate-glow-pulse` - Cyan glow pulse (2s infinite)
- `animate-glow-pulse-cyan` - Cyan glow with glass shadow
- `animate-glow-pulse-purple` - Purple glow with glass shadow
- `animate-glow-pulse-pink` - Pink glow with glass shadow

### Other Animations
- `animate-scale-in` - Scale from 0.9 to 1
- `animate-bounce-subtle` - Subtle bounce effect
- `animate-shimmer` - Shimmer effect (2s infinite)

## Tailwind Utilities

### Backdrop Blur
- `backdrop-blur-xs` - 2px
- `backdrop-blur-sm` - 4px
- `backdrop-blur-md` - 12px
- `backdrop-blur-glass` - 20px
- `backdrop-blur-glass-md` - 24px
- `backdrop-blur-glass-lg` - 32px
- `backdrop-blur-glass-strong` - 40px
- `backdrop-blur-glass-xl` - 48px

### Box Shadows

#### Glass Shadows
- `shadow-glass-sm` - Small glass shadow
- `shadow-glass` - Standard glass shadow
- `shadow-glass-md` - Medium glass shadow
- `shadow-glass-lg` - Large glass shadow
- `shadow-glass-strong` - Strong glass shadow
- `shadow-glass-xl` - Extra large glass shadow

#### Neon Shadows
- `shadow-neon-cyan-{sm,DEFAULT,lg,xl}` - Cyan glow shadows
- `shadow-neon-purple-{sm,DEFAULT,lg,xl}` - Purple glow shadows
- `shadow-neon-pink-{sm,DEFAULT,lg,xl}` - Pink glow shadows
- `shadow-neon-blue-{sm,DEFAULT,lg,xl}` - Blue glow shadows

#### Combined Shadows
- `shadow-glass-glow-cyan` - Glass shadow + cyan glow
- `shadow-glass-glow-purple` - Glass shadow + purple glow
- `shadow-glass-glow-pink` - Glass shadow + pink glow

### Border Utilities
- `border-glass` - Standard glass border
- `border-glass-strong` - Strong glass border
- `border-neon-cyan` - Cyan neon border
- `border-neon-purple` - Purple neon border
- `border-neon-pink` - Pink neon border

### Background Images
- `bg-glass-gradient` - Light glass gradient
- `bg-glass-gradient-strong` - Strong glass gradient
- `bg-shimmer-gradient` - Shimmer effect gradient

## Usage Examples

### Basic Glass Card
```tsx
<div className="glass-panel rounded-lg p-6">
  <h2 className="text-xl font-bold">Card Title</h2>
  <p>Card content</p>
</div>
```

### Neon Button
```tsx
<button className="glass-button-cyan">
  Click Me
</button>
```

### Task Card with Status
```tsx
<div className="task-card-running">
  <h3>Running Task</h3>
  <span className="status-running">Running</span>
</div>
```

### Using Tailwind Utilities
```tsx
<div className="bg-glass-light backdrop-blur-glass border border-glass rounded-xl p-4 shadow-glass-glow-cyan">
  <p className="text-neon-cyan-400">Neon text</p>
</div>
```

### Animated Element
```tsx
<div className="glass-card animate-slide-up">
  <p>This card slides up on mount</p>
</div>
```

## CSS Variables Reference

```css
/* Glassmorphism colors */
--glass-light: rgba(255, 255, 255, 0.1);
--glass-medium: rgba(255, 255, 255, 0.15);
--glass-strong: rgba(255, 255, 255, 0.2);
--glass-dark: rgba(0, 0, 0, 0.2);
--glass-darker: rgba(0, 0, 0, 0.3);

/* Neon colors */
--neon-cyan: #00f0ff;
--neon-cyan-rgb: 0, 240, 255;
--neon-purple: #a855f7;
--neon-purple-rgb: 168, 85, 247;
--neon-pink: #ec4899;
--neon-pink-rgb: 236, 72, 153;
--neon-blue: #3b82f6;
--neon-blue-rgb: 59, 130, 246;

/* Glass blur values */
--blur-glass: 20px;
--blur-glass-strong: 40px;

/* Transition durations */
--transition-fast: 200ms;
--transition-normal: 300ms;
--transition-slow: 400ms;
```

## Best Practices

1. **Layering**: Use stronger glass effects for foreground elements
2. **Contrast**: Ensure text has sufficient contrast against glass backgrounds
3. **Performance**: Limit backdrop-filter usage on mobile devices
4. **Consistency**: Use the predefined utilities for consistent styling
5. **Accessibility**: Maintain WCAG 2.1 Level AA contrast ratios
6. **Animation**: Use subtle animations (200-400ms) for smooth interactions
7. **Hover States**: Always provide visual feedback for interactive elements
8. **Mobile**: Consider reducing blur intensity on mobile for better performance

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit-backdrop-filter)
- Mobile browsers: Supported with fallbacks

Note: The `-webkit-backdrop-filter` prefix is included for Safari compatibility.
