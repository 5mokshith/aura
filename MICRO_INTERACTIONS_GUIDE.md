# Micro-Interactions & Animations Guide

## Overview
Added extensive micro-interactions and animations throughout the app to create a delightful, engaging user experience.

## New Features

### 1. Dark Mode Toggle
**Location**: Settings > Preferences

**Features**:
- Three theme options: Light, Dark, System
- Animated theme cards with hover effects
- Smooth transitions between themes
- Persistent theme selection (localStorage)
- System preference detection
- Animated icons and glow effects

**Implementation**:
- `ThemeContext` - Global theme management
- `ThemeToggle` - Animated theme selector component

### 2. Animated Settings Components

#### AnimatedSwitch
- Glass morphism design
- Smooth toggle animations
- Icon animations on state change
- Ripple effect on click
- Hover lift effect
- Background glow when active

#### AnimatedSlider
- Interactive range slider
- Real-time value display
- Animated thumb indicator
- Gradient progress bar with shimmer
- Smooth drag interactions
- Scale animations on interaction

### 3. New Animation Classes

#### Bounce & Movement
- `animate-bounce-subtle` - Gentle vertical bounce
- `animate-wiggle` - Rotation wiggle effect
- `animate-float` - Smooth floating motion
- `animate-scale-pulse` - Breathing scale effect

#### Slide Animations
- `animate-slide-in-left` - Slide from left
- `animate-slide-in-right` - Slide from right
- `animate-fade-in-up` - Fade in with upward motion

#### Special Effects
- `animate-ripple` - Click ripple effect
- `animate-skeleton-shimmer` - Loading shimmer
- `animate-gradient-border` - Animated gradient border
- `shimmer` - Shimmer overlay effect
- `glow` - Glow effect for elements
- `gradient-text` - Animated gradient text

### 4. Enhanced Components

#### AnimatedButton
- Ripple effect on click
- Optional bounce animation
- Smooth hover transitions
- Multiple ripple support

#### AnimatedCard
- 3D tilt effect on hover
- Optional glow effect
- Float animation
- Shine overlay effect
- Smooth perspective transforms

#### AnimatedLoader
- Multiple variants: spinner, dots, pulse, bars
- Size options: sm, md, lg
- Optional loading text
- Smooth animations

#### AnimatedToast
- Slide-in animations
- Auto-dismiss with progress bar
- Type-based styling (success, error, warning, info)
- Close button with hover effect
- Icon animations

#### FloatingActionButton
- Expandable action menu
- Staggered animation for actions
- Pulse ring effect
- Smooth rotation on open/close
- Glass morphism design

### 5. Page Animations

#### Dashboard
- Staggered children animations
- Gradient text for headings
- Hover lift effects on cards
- Bounce animation on emoji
- Fade-in animations

#### Settings
- Smooth tab transitions
- Card entrance animations
- Interactive preference controls
- Icon animations

### 6. Global Enhancements

#### Hover Effects
- `hover-lift` - Lift on hover with shadow
- Smooth transitions on all interactive elements
- Scale transformations
- Shadow depth changes

#### Focus States
- Smooth focus ring transitions
- Consistent focus indicators
- Accessible keyboard navigation

#### Loading States
- Skeleton shimmer animations
- Smooth spinner rotations
- Pulsing effects

### 7. Micro-Interactions

#### Button Interactions
- Ripple effect on click
- Scale on hover
- Smooth color transitions
- Active state feedback

#### Card Interactions
- 3D tilt on mouse move
- Glow on hover
- Lift effect
- Shine overlay

#### Input Interactions
- Focus glow effect
- Smooth border transitions
- Placeholder animations

#### Switch/Toggle Interactions
- Smooth knob movement
- Background color transition
- Scale feedback
- Glow when active

#### Slider Interactions
- Thumb scale on drag
- Progress gradient animation
- Value display animation
- Track glow effect

## Usage Examples

### Using Theme Toggle
```tsx
import { ThemeToggle } from "@/components/settings/ThemeToggle";

<ThemeToggle />
```

### Using Animated Switch
```tsx
import { AnimatedSwitch } from "@/components/settings/AnimatedSwitch";
import { Bell } from "lucide-react";

<AnimatedSwitch
  label="Notifications"
  description="Enable desktop notifications"
  defaultChecked={true}
  icon={<Bell className="h-5 w-5" />}
  onChange={(checked) => console.log(checked)}
/>
```

### Using Animated Slider
```tsx
import { AnimatedSlider } from "@/components/settings/AnimatedSlider";
import { Volume2 } from "lucide-react";

<AnimatedSlider
  label="Volume"
  description="Adjust sound volume"
  min={0}
  max={100}
  defaultValue={50}
  unit="%"
  icon={<Volume2 className="h-5 w-5" />}
  onChange={(value) => console.log(value)}
/>
```

### Using Animated Button
```tsx
import { AnimatedButton } from "@/components/ui/animated-button";

<AnimatedButton ripple bounce>
  Click Me
</AnimatedButton>
```

### Using Animated Card
```tsx
import { AnimatedCard } from "@/components/ui/animated-card";

<AnimatedCard tilt glow float>
  <CardContent>
    Your content here
  </CardContent>
</AnimatedCard>
```

### Using Animated Loader
```tsx
import { AnimatedLoader } from "@/components/shared/AnimatedLoader";

<AnimatedLoader
  size="md"
  variant="spinner"
  text="Loading..."
/>
```

## Performance Considerations

- All animations use CSS transforms for GPU acceleration
- Animations respect `prefers-reduced-motion`
- Debounced mouse move events for tilt effects
- Optimized re-renders with proper state management
- Lazy loading for heavy components

## Accessibility

- All animations can be disabled via system preferences
- Focus indicators maintained
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## Browser Support

- Modern browsers with CSS transform support
- Graceful degradation for older browsers
- Fallbacks for unsupported features
