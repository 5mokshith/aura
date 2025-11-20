# Responsive Design & Accessibility Guide

This document provides comprehensive guidance on the responsive design and accessibility features implemented in the AURA UI system.

## Table of Contents

1. [Responsive Design](#responsive-design)
2. [Touch-Friendly Interactions](#touch-friendly-interactions)
3. [Keyboard Navigation](#keyboard-navigation)
4. [WCAG 2.1 Level AA Compliance](#wcag-21-level-aa-compliance)
5. [Usage Examples](#usage-examples)
6. [Testing Guidelines](#testing-guidelines)

---

## Responsive Design

### Breakpoints

The AURA system uses mobile-first responsive breakpoints:

```typescript
{
  xs: 320px,   // Extra small devices (phones)
  sm: 640px,   // Small devices (large phones)
  md: 768px,   // Medium devices (tablets)
  lg: 1024px,  // Large devices (desktops)
  xl: 1280px,  // Extra large devices (large desktops)
  '2xl': 1536px // 2X large devices (ultra-wide)
}
```

### Responsive Utilities

#### CSS Classes

```css
/* Hide/Show based on screen size */
.hide-mobile    /* Hidden on mobile, visible on tablet+ */
.show-mobile    /* Visible on mobile, hidden on tablet+ */
.hide-tablet    /* Hidden on tablet only */
.show-tablet    /* Visible on tablet only */
.hide-desktop   /* Hidden on desktop+ */
.show-desktop   /* Visible on desktop+ */

/* Responsive text sizes */
.text-responsive-sm   /* 0.75rem → 0.875rem */
.text-responsive-base /* 0.875rem → 1rem */
.text-responsive-lg   /* 1rem → 1.125rem → 1.25rem */
.text-responsive-xl   /* 1.125rem → 1.25rem → 1.5rem */
.text-responsive-2xl  /* 1.25rem → 1.5rem → 1.875rem */

/* Responsive spacing */
.spacing-responsive-sm /* 0.5rem → 0.75rem → 1rem */
.spacing-responsive-md /* 0.75rem → 1rem → 1.5rem */
.spacing-responsive-lg /* 1rem → 1.5rem → 2rem */

/* Responsive grids */
.responsive-grid-1 /* 1 column on all screens */
.responsive-grid-2 /* 1 col mobile, 2 cols tablet+ */
.responsive-grid-3 /* 1 col mobile, 2 cols tablet, 3 cols desktop+ */
.responsive-grid-4 /* 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols xl+ */
.responsive-grid-5 /* 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols xl, 5 cols 2xl+ */
```

#### React Hooks

```typescript
import { useBreakpoint, useIsMobile, useIsTablet, useIsDesktop } from '@/app/hooks/useResponsive';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  const isMobile = useIsMobile();     // true if < 768px
  const isTablet = useIsTablet();     // true if 768px - 1023px
  const isDesktop = useIsDesktop();   // true if >= 1024px

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

#### Utility Functions

```typescript
import { responsivePadding, responsiveText, responsiveGrid } from '@/app/lib/responsive';

// Generate responsive class names
const padding = responsivePadding('p-4', 'md:p-6', 'lg:p-8');
const text = responsiveText('text-sm', 'md:text-base', 'lg:text-lg');
const grid = responsiveGrid(1, 2, 3); // 1 col mobile, 2 tablet, 3 desktop
```

---

## Touch-Friendly Interactions

### Minimum Touch Target Sizes

All interactive elements meet WCAG 2.1 minimum touch target size of **44x44 pixels**.

#### CSS Classes

```css
/* Touch target utilities */
.touch-target     /* 44x44px minimum */
.touch-target-lg  /* 48x48px */
.touch-target-xl  /* 56x56px */

/* Touch-friendly buttons */
.glass-button     /* Automatically 44px min-height */
.icon-button-touch /* 44x44px icon button */

/* Touch feedback */
.touch-active     /* Scale down on active */
.touch-ripple     /* Ripple effect on touch */
.no-select-touch  /* Prevent text selection */
```

### Touch Gestures

#### React Hooks

```typescript
import { useSwipe, useLongPress, useDoubleTap, usePinch } from '@/app/hooks/useTouch';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);

  // Swipe gestures
  useSwipe(ref, {
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
    onSwipeUp: () => console.log('Swiped up'),
    onSwipeDown: () => console.log('Swiped down'),
  });

  // Long press
  useLongPress(ref, () => console.log('Long pressed'), 500);

  // Double tap
  useDoubleTap(ref, () => console.log('Double tapped'));

  // Pinch to zoom
  usePinch(ref, (scale) => console.log('Pinch scale:', scale));

  return <div ref={ref}>Swipeable content</div>;
}
```

### Touch Feedback

```typescript
import { useTouchRipple, useTouchFeedback } from '@/app/hooks/useTouch';

function Button() {
  const ref = useRef<HTMLButtonElement>(null);

  // Add ripple effect
  useTouchRipple(ref);

  // Add scale/opacity feedback
  useTouchFeedback(ref, {
    scale: 0.97,
    opacity: 0.9,
    duration: 100,
  });

  return <button ref={ref}>Touch me</button>;
}
```

---

## Keyboard Navigation

### Focus Management

All interactive elements are keyboard accessible with visible focus indicators.

#### CSS Classes

```css
/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-to-content /* Visible only on keyboard focus */

/* Keyboard shortcuts display */
.keyboard-shortcut /* Display keyboard shortcut hints */
.keyboard-hint     /* Small keyboard hint badges */
```

### Keyboard Shortcuts

#### Default Shortcuts

```typescript
// Navigation
Ctrl + I    - Focus chat input
Ctrl + ,    - Open settings
Ctrl + T    - Open timeline
Ctrl + F    - Open files
Ctrl + L    - Open logs
Ctrl + B    - Toggle sidebar

// Actions
Enter       - Send message / Activate
Shift+Enter - New line in input
Escape      - Cancel / Close
Ctrl + S    - Save
Ctrl + R    - Refresh

// Accessibility
Tab         - Navigate forward
Shift+Tab   - Navigate backward
Shift + ?   - Show keyboard shortcuts
```

#### React Hooks

```typescript
import { useKeyboardShortcuts, useEscapeKey, useEnterKey } from '@/app/hooks/useKeyboard';

function MyComponent() {
  // Register multiple shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      callback: () => console.log('Save'),
      description: 'Save document',
    },
    {
      key: 'Escape',
      callback: () => console.log('Close'),
      description: 'Close modal',
    },
  ]);

  // Single key handlers
  useEscapeKey(() => console.log('Escape pressed'));
  useEnterKey(() => console.log('Enter pressed'));

  return <div>Press Ctrl+S to save</div>;
}
```

### Focus Trap (for Modals)

```typescript
import { useFocusTrap } from '@/app/hooks/useKeyboard';

function Modal({ isOpen }: { isOpen: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  // Trap focus within modal when open
  useFocusTrap(ref, isOpen);

  return (
    <div ref={ref} role="dialog" aria-modal="true">
      <button>First focusable</button>
      <button>Last focusable</button>
    </div>
  );
}
```

### List Navigation

```typescript
import { useListNavigation } from '@/app/hooks/useKeyboard';

function List() {
  const ref = useRef<HTMLUListElement>(null);

  // Enable arrow key navigation
  useListNavigation(ref, {
    orientation: 'vertical',
    loop: true,
  });

  return (
    <ul ref={ref}>
      <li tabIndex={0}>Item 1</li>
      <li tabIndex={0}>Item 2</li>
      <li tabIndex={0}>Item 3</li>
    </ul>
  );
}
```

---

## WCAG 2.1 Level AA Compliance

### Color Contrast

All text meets WCAG 2.1 Level AA contrast requirements:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio

#### Utilities

```typescript
import { getContrastRatio, meetsWCAG_AA, hexToRgb } from '@/app/lib/accessibility';

// Check contrast ratio
const foreground = hexToRgb('#ffffff');
const background = hexToRgb('#000000');
const ratio = getContrastRatio(foreground, background); // 21:1

// Verify WCAG compliance
const isAccessible = meetsWCAG_AA(foreground, background); // true
```

### Screen Reader Support

#### ARIA Live Regions

```typescript
import { useAnnounce, useLiveRegion } from '@/app/hooks/useAccessibility';

function StatusUpdates() {
  const announce = useAnnounce();
  const announceLive = useLiveRegion('polite');

  const handleUpdate = () => {
    // Announce to screen readers
    announce('Task completed successfully', 'polite');
    
    // Or use live region
    announceLive('Processing...');
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

#### ARIA Attributes

```typescript
import { useAriaId, useAriaDescribedBy, useAccessibleFormField } from '@/app/hooks/useAccessibility';

function FormField() {
  const {
    fieldProps,
    labelProps,
    errorProps,
    descriptionProps,
  } = useAccessibleFormField('Email', {
    required: true,
    error: 'Invalid email',
    description: 'Enter your email address',
  });

  return (
    <div>
      <label {...labelProps}>Email *</label>
      <input type="email" {...fieldProps} />
      {descriptionProps && <span {...descriptionProps}>Enter your email address</span>}
      {errorProps && <span {...errorProps}>Invalid email</span>}
    </div>
  );
}
```

### Reduced Motion Support

```typescript
import { usePrefersReducedMotion } from '@/app/hooks/useAccessibility';

function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={prefersReducedMotion ? '' : 'animate-slide-up'}
    >
      Content
    </div>
  );
}
```

### High Contrast Mode

```typescript
import { usePrefersHighContrast } from '@/app/hooks/useAccessibility';

function ThemedComponent() {
  const prefersHighContrast = usePrefersHighContrast();

  return (
    <div
      className={prefersHighContrast ? 'border-2' : 'border'}
    >
      Content
    </div>
  );
}
```

---

## Usage Examples

### Responsive Card Component

```typescript
import { useIsMobile } from '@/app/hooks/useResponsive';
import { useTouchRipple } from '@/app/hooks/useTouch';
import { useAccessibleFormField } from '@/app/hooks/useAccessibility';

function Card({ title, description }: { title: string; description: string }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  useTouchRipple(ref);

  return (
    <div
      ref={ref}
      className={`
        glass-card
        touch-target
        ${isMobile ? 'p-4' : 'p-6'}
      `}
      role="article"
      tabIndex={0}
    >
      <h3 className="text-responsive-lg">{title}</h3>
      <p className="text-responsive-base">{description}</p>
    </div>
  );
}
```

### Accessible Modal

```typescript
import { useFocusTrap } from '@/app/hooks/useKeyboard';
import { useEscapeKey } from '@/app/hooks/useKeyboard';
import { useAccessibleModal } from '@/app/hooks/useAccessibility';

function Modal({ isOpen, onClose, title, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const { modalProps, titleProps } = useAccessibleModal(isOpen, title);

  useFocusTrap(ref, isOpen);
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div className="glass-overlay">
      <div ref={ref} {...modalProps} className="glass-modal">
        <h2 {...titleProps}>{title}</h2>
        {children}
        <button onClick={onClose} className="modal-close-touch">
          <span className="sr-only">Close</span>
          ×
        </button>
      </div>
    </div>
  );
}
```

---

## Testing Guidelines

### Responsive Design Testing

1. **Test on multiple screen sizes**:
   - Mobile: 320px - 767px
   - Tablet: 768px - 1023px
   - Desktop: 1024px+

2. **Test orientation changes**:
   - Portrait and landscape modes

3. **Test zoom levels**:
   - 100%, 150%, 200% zoom

### Touch Testing

1. **Verify touch target sizes**:
   - All interactive elements ≥ 44x44px

2. **Test touch gestures**:
   - Swipe, long press, double tap, pinch

3. **Test on actual devices**:
   - iOS and Android devices

### Keyboard Testing

1. **Tab through all interactive elements**:
   - Verify logical tab order
   - Check focus indicators are visible

2. **Test keyboard shortcuts**:
   - Verify all shortcuts work
   - Check for conflicts

3. **Test with keyboard only**:
   - Complete all tasks without mouse

### Accessibility Testing

1. **Screen reader testing**:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

2. **Color contrast testing**:
   - Use browser DevTools
   - Use contrast checker tools

3. **Automated testing**:
   - Run accessibility audit
   - Check WCAG compliance

```typescript
import { auditAccessibility } from '@/app/lib/accessibility';

// Run accessibility audit
const issues = auditAccessibility(document.body);
console.log('Accessibility issues:', issues);
```

### Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

## Support

For questions or issues related to responsive design and accessibility, please refer to the main documentation or contact the development team.
