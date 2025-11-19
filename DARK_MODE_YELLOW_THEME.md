# Dark Mode with Yellow Accents Theme

## Changes Made

### 1. Default Dark Mode
- App now defaults to dark mode on first load
- Dark theme is set as the default in ThemeContext
- Proper theme persistence with localStorage

### 2. Removed Gradient Background
- Removed the animated gradient background
- Replaced with clean solid dark background
- Added subtle yellow accent orbs for depth
- Minimal grid pattern with yellow tint

### 3. Yellow Accent Colors
- **Primary Color**: Yellow (#facc15 / hsl(48 96% 53%))
- Used throughout the app for:
  - Buttons (primary variant)
  - Progress bars
  - Badges
  - Focus rings
  - Active states
  - Hover effects

### 4. Updated Components

#### Buttons
- Primary buttons now use yellow background
- Yellow glow on hover
- Yellow shadow effects

#### Progress Bars
- Gradient from yellow-400 to amber-500
- Yellow glow when active

#### Badges
- Yellow background for default variant
- Yellow shadow on hover

#### Switches & Sliders
- Yellow accents when active
- Yellow progress indicators
- Yellow glow effects

#### Theme Toggle
- Yellow background glow when selected
- Yellow accent orbs

### 5. Color Palette

#### Dark Mode (Default)
```css
--background: 240 10% 3.9% (very dark blue-gray)
--foreground: 0 0% 98% (almost white)
--primary: 48 96% 53% (bright yellow)
--primary-foreground: 240 10% 3.9% (dark text on yellow)
```

#### Light Mode
```css
--background: 0 0% 100% (white)
--foreground: 240 10% 3.9% (dark gray)
--primary: 48 96% 53% (bright yellow)
--primary-foreground: 240 10% 3.9% (dark text on yellow)
```

### 6. Glassmorphism Updates
- Dark glass effects by default
- Light glass effects when in light mode
- Yellow tinted borders and glows
- Proper backdrop blur support

### 7. Theme Switching
- Three modes: Light, Dark, System
- Smooth transitions between themes
- Proper CSS class application
- Data attribute support for better targeting

## Visual Features

### Dark Mode
- Deep dark background (#0a0a0f approximately)
- High contrast with white text
- Yellow accents for interactive elements
- Subtle yellow ambient lighting

### Yellow Accents
- Buttons glow yellow on hover
- Progress bars animate with yellow gradient
- Active states highlighted in yellow
- Focus rings are yellow
- Badges use yellow background

### Glassmorphism
- Frosted glass effect on cards
- Backdrop blur for depth
- Subtle borders
- Shadow effects

## Usage

The theme automatically loads as dark mode. Users can change it in Settings > Preferences > Appearance.

### Theme Options:
1. **Dark** (Default) - Dark background with yellow accents
2. **Light** - Light background with yellow accents
3. **System** - Follows system preference

## Browser Support
- Modern browsers with CSS custom properties
- Backdrop filter support
- CSS class-based dark mode
- Graceful degradation for older browsers
