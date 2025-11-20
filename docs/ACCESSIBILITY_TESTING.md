# Accessibility Testing Guide

## Overview

This guide provides instructions for testing the AURA UI system for WCAG 2.1 Level AA compliance.

## Automated Testing Tools

### Built-in Testing Utilities

The application includes built-in accessibility testing utilities available in development mode.

#### Running Tests in Browser Console

Open the browser console and run:

```javascript
// Run full WCAG 2.1 Level AA audit
testAccessibility();

// Download audit report
downloadAuditReport('text'); // or 'json'

// Test specific WCAG criterion
testWCAGCriteria('2.4.7'); // Focus Visible

// Test color contrast
testColorContrast('#ffffff', '#000000');

// Test keyboard navigation
testKeyboardNavigation();

// Test screen reader compatibility
testScreenReaderCompatibility();
```

### External Tools

#### 1. axe DevTools (Browser Extension)

**Installation:**
- Chrome: [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- Firefox: [axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

**Usage:**
1. Open DevTools (F12)
2. Navigate to "axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review issues by severity

**Target:** 0 violations

#### 2. Lighthouse (Built into Chrome DevTools)

**Usage:**
1. Open DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Generate report"

**Target:** 100 score

#### 3. WAVE (Web Accessibility Evaluation Tool)

**Installation:**
- Chrome: [WAVE Extension](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- Firefox: [WAVE Extension](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)

**Usage:**
1. Click WAVE icon in browser toolbar
2. Review errors, alerts, and features
3. Use "Styles" tab to check contrast

**Target:** 0 errors

## Manual Testing Procedures

### 1. Keyboard Navigation Testing

#### Test Steps:

1. **Tab Navigation**
   - Press Tab to move forward through interactive elements
   - Press Shift+Tab to move backward
   - Verify focus indicator is visible on all elements
   - Verify tab order follows logical flow

2. **Keyboard Shortcuts**
   - Test all keyboard shortcuts
   - Verify shortcuts use modifier keys (Ctrl, Alt, etc.)
   - Verify shortcuts don't conflict with browser/screen reader shortcuts

3. **Interactive Elements**
   - Test buttons with Enter and Space keys
   - Test links with Enter key
   - Test form inputs with arrow keys
   - Test dropdowns with arrow keys and Enter
   - Test modals with Escape key

4. **Focus Management**
   - Verify focus moves to modal when opened
   - Verify focus returns to trigger when modal closes
   - Verify focus doesn't get trapped
   - Verify skip links work

#### Checklist:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible (2px cyan outline)
- [ ] Tab order is logical
- [ ] No keyboard traps
- [ ] Escape key closes modals/dropdowns
- [ ] Skip to main content link works
- [ ] No positive tabindex values used

### 2. Screen Reader Testing

#### Screen Readers to Test:

- **Windows:** NVDA (free) or JAWS (commercial)
- **macOS:** VoiceOver (built-in)
- **iOS:** VoiceOver (built-in)
- **Android:** TalkBack (built-in)

#### NVDA Testing (Windows):

1. **Installation:**
   - Download from [nvaccess.org](https://www.nvaccess.org/)
   - Install and restart computer

2. **Basic Commands:**
   - Start: Ctrl + Alt + N
   - Stop: Insert + Q
   - Read next: Down Arrow
   - Read previous: Up Arrow
   - Navigate headings: H
   - Navigate links: K
   - Navigate buttons: B
   - Navigate forms: F

3. **Test Scenarios:**
   - Navigate entire page with arrow keys
   - Navigate by headings (H key)
   - Navigate by landmarks (D key)
   - Fill out forms
   - Interact with buttons and links
   - Listen to status messages
   - Listen to error messages

#### VoiceOver Testing (macOS):

1. **Activation:**
   - Enable: Cmd + F5
   - Disable: Cmd + F5

2. **Basic Commands:**
   - Navigate: VO + Right/Left Arrow
   - Interact: VO + Shift + Down Arrow
   - Stop interacting: VO + Shift + Up Arrow
   - Read all: VO + A
   - Rotor: VO + U

3. **Test Scenarios:**
   - Same as NVDA testing above

#### Checklist:

- [ ] All images have alt text or aria-label
- [ ] All buttons have accessible names
- [ ] All form inputs have labels
- [ ] Headings are properly structured (H1 → H2 → H3)
- [ ] Landmarks are properly defined (main, nav, aside)
- [ ] Status messages are announced
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Dynamic content updates are announced

### 3. Color Contrast Testing

#### Tools:

- **WebAIM Contrast Checker:** [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
- **Colour Contrast Analyser:** [paciellogroup.com/resources/contrastanalyser](https://www.paciellogroup.com/resources/contrastanalyser/)
- **Built-in tool:** `testColorContrast('#ffffff', '#000000')`

#### Test Steps:

1. **Text Contrast**
   - Test all text colors against backgrounds
   - Verify 4.5:1 ratio for normal text
   - Verify 3:1 ratio for large text (18pt+ or 14pt+ bold)

2. **UI Component Contrast**
   - Test button borders and backgrounds
   - Test form input borders
   - Test focus indicators
   - Verify 3:1 ratio for all UI components

3. **Status Indicators**
   - Test status badge colors
   - Test error message colors
   - Test success message colors
   - Verify color is not the only indicator

#### Checklist:

- [ ] All text meets 4.5:1 contrast ratio
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Status is not conveyed by color alone

### 4. Zoom and Reflow Testing

#### Test Steps:

1. **Zoom Testing**
   - Zoom to 200% (Ctrl/Cmd + Plus)
   - Verify all content is readable
   - Verify no horizontal scrolling
   - Verify no content is cut off
   - Verify interactive elements are still usable

2. **Reflow Testing**
   - Resize browser to 320px width
   - Verify content reflows properly
   - Verify no horizontal scrolling
   - Verify all functionality is available
   - Test at various breakpoints: 320px, 640px, 768px, 1024px

3. **Text Spacing Testing**
   - Increase line height to 1.5
   - Increase paragraph spacing to 2em
   - Increase letter spacing to 0.12em
   - Increase word spacing to 0.16em
   - Verify no content is cut off

#### Checklist:

- [ ] Content readable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom
- [ ] Content reflows at 320px width
- [ ] All functionality available at 320px width
- [ ] Text spacing adjustments don't break layout

### 5. Motion and Animation Testing

#### Test Steps:

1. **Enable Reduced Motion**
   - **Windows:** Settings → Ease of Access → Display → Show animations
   - **macOS:** System Preferences → Accessibility → Display → Reduce motion
   - **Browser:** DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion

2. **Verify Animations**
   - Check that animations are disabled or minimal
   - Verify transitions are instant or very short
   - Verify no auto-playing animations
   - Verify parallax effects are disabled

#### Checklist:

- [ ] Animations respect prefers-reduced-motion
- [ ] No flashing content (3+ times per second)
- [ ] Auto-playing animations can be paused
- [ ] Parallax effects are disabled with reduced motion

### 6. Touch Target Testing

#### Test Steps:

1. **Measure Touch Targets**
   - Use browser DevTools to measure elements
   - Verify minimum 44x44px for all interactive elements
   - Verify sufficient spacing between targets

2. **Test on Mobile Devices**
   - Test on actual mobile devices
   - Verify all buttons are easy to tap
   - Verify no accidental taps on adjacent elements

#### Checklist:

- [ ] All interactive elements are 44x44px minimum
- [ ] Sufficient spacing between touch targets
- [ ] Easy to tap on mobile devices
- [ ] No accidental taps on adjacent elements

### 7. Form Accessibility Testing

#### Test Steps:

1. **Label Association**
   - Verify all inputs have associated labels
   - Test clicking labels focuses inputs
   - Verify labels are descriptive

2. **Error Handling**
   - Submit form with errors
   - Verify errors are clearly identified
   - Verify errors are announced to screen readers
   - Verify error messages are descriptive
   - Verify focus moves to first error

3. **Required Fields**
   - Verify required fields are marked
   - Verify aria-required attribute is present
   - Verify required indicator is visible

4. **Input Instructions**
   - Verify format requirements are explained
   - Verify instructions are associated with inputs
   - Verify examples are provided where helpful

#### Checklist:

- [ ] All inputs have labels
- [ ] Labels are properly associated (for/id)
- [ ] Required fields are marked
- [ ] Error messages are clear and specific
- [ ] Errors are announced to screen readers
- [ ] Format requirements are explained
- [ ] Success messages are announced

## Testing Checklist

### Before Each Release

- [ ] Run automated accessibility audit (`testAccessibility()`)
- [ ] Run axe DevTools scan (0 violations)
- [ ] Run Lighthouse audit (100 score)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Test color contrast
- [ ] Test at 200% zoom
- [ ] Test at 320px width
- [ ] Test with reduced motion enabled
- [ ] Test touch targets on mobile device
- [ ] Test form accessibility
- [ ] Review WCAG compliance documentation

### Quarterly Comprehensive Audit

- [ ] Full manual testing with multiple screen readers
- [ ] Testing on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Testing on multiple devices (desktop, tablet, mobile)
- [ ] Testing with assistive technologies (screen magnifiers, voice control)
- [ ] User testing with people with disabilities
- [ ] Update WCAG compliance documentation
- [ ] Address any identified issues

## Common Issues and Solutions

### Issue: Button without accessible name

**Problem:** Button has no text content or aria-label

**Solution:**
```tsx
// Bad
<button><Icon /></button>

// Good
<button aria-label="Send message">
  <Icon aria-hidden="true" />
</button>
```

### Issue: Image without alt text

**Problem:** Image missing alt attribute

**Solution:**
```tsx
// Bad
<img src="logo.png" />

// Good - Informative image
<img src="logo.png" alt="AURA Logo" />

// Good - Decorative image
<img src="pattern.png" alt="" aria-hidden="true" />
```

### Issue: Form input without label

**Problem:** Input has no associated label

**Solution:**
```tsx
// Bad
<input type="email" />

// Good
<label htmlFor="email-input">Email Address</label>
<input id="email-input" type="email" />

// Also good
<input type="email" aria-label="Email Address" />
```

### Issue: Low color contrast

**Problem:** Text doesn't meet 4.5:1 contrast ratio

**Solution:**
- Darken text color or lighten background
- Use larger text (18pt+ or 14pt+ bold) for 3:1 ratio
- Add text shadow or background for better contrast

### Issue: Keyboard trap

**Problem:** Focus gets stuck in component

**Solution:**
```tsx
// Ensure Escape key closes modal
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

### Issue: Missing focus indicator

**Problem:** Focus indicator not visible

**Solution:**
```css
/* Ensure focus indicators are visible */
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Deque University](https://dequeuniversity.com/)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)

## Contact

For accessibility questions or to report issues, please contact the development team.
