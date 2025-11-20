/**
 * Accessibility Utilities
 * WCAG 2.1 Level AA compliance helpers
 */

/**
 * Calculate relative luminance of a color
 * Used for contrast ratio calculations
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 requires 4.5:1 for normal text (Level AA)
 * and 7:1 for enhanced contrast (Level AAA)
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(color1.r, color1.g, color1.b);
  const l2 = getRelativeLuminance(color2.r, color2.g, color2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAG_AA(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAG_AAA(
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Generate accessible color palette
 */
export function getAccessibleColor(
  background: { r: number; g: number; b: number },
  preferredColor: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  if (meetsWCAG_AA(preferredColor, background)) {
    return preferredColor;
  }

  // If preferred color doesn't meet contrast, return white or black
  const whiteContrast = getContrastRatio({ r: 255, g: 255, b: 255 }, background);
  const blackContrast = getContrastRatio({ r: 0, g: 0, b: 0 }, background);

  return whiteContrast > blackContrast
    ? { r: 255, g: 255, b: 255 }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = [];

  // Check for required ARIA attributes
  const role = element.getAttribute('role');

  if (role === 'button' && !element.hasAttribute('aria-label') && !element.textContent?.trim()) {
    errors.push('Button must have accessible text or aria-label');
  }

  if (role === 'img' && !element.hasAttribute('alt') && !element.hasAttribute('aria-label')) {
    errors.push('Image must have alt text or aria-label');
  }

  if (role === 'dialog' && !element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
    errors.push('Dialog must have aria-labelledby or aria-label');
  }

  // Check for invalid ARIA combinations
  if (element.hasAttribute('aria-hidden') && element.hasAttribute('tabindex')) {
    const tabindex = element.getAttribute('tabindex');
    if (tabindex !== '-1') {
      errors.push('aria-hidden elements should not be focusable');
    }
  }

  return errors;
}

/**
 * Get accessible name for element
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check for label element
  if (element instanceof HTMLInputElement) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }

  // Check title attribute
  const title = element.getAttribute('title');
  if (title) return title;

  // Check alt attribute for images
  if (element instanceof HTMLImageElement) {
    return element.alt;
  }

  // Fall back to text content
  return element.textContent || '';
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('tabindex') === '-1') return false;
  if (element.hasAttribute('hidden')) return false;
  if (window.getComputedStyle(element).display === 'none') return false;
  if (window.getComputedStyle(element).visibility === 'hidden') return false;

  const tabindex = element.getAttribute('tabindex');
  if (tabindex && parseInt(tabindex) >= 0) return true;

  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  return focusableTags.includes(element.tagName);
}

/**
 * Get reading time for text content
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Format time for screen readers
 */
export function formatTimeForScreenReader(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

  return parts.join(', ');
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if text size is sufficient
 */
export function hasMinimumTextSize(element: HTMLElement): boolean {
  const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
  return fontSize >= 16; // Minimum 16px for body text
}

/**
 * Check if touch target is large enough
 */
export function hasMinimumTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44; // WCAG minimum 44x44px
}

/**
 * Add ARIA live region
 */
export function createLiveRegion(
  priority: 'polite' | 'assertive' = 'polite',
  atomic: boolean = true
): HTMLDivElement {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', atomic.toString());
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
}

/**
 * Update ARIA live region
 */
export function updateLiveRegion(region: HTMLElement, message: string) {
  region.textContent = message;
}

/**
 * Remove ARIA live region
 */
export function removeLiveRegion(region: HTMLElement) {
  if (region.parentNode) {
    region.parentNode.removeChild(region);
  }
}

/**
 * WCAG 2.1 Success Criteria Checklist
 */
export const WCAG_CHECKLIST = {
  // Perceivable
  textAlternatives: 'All non-text content has text alternatives',
  timeBasedMedia: 'Captions and alternatives for time-based media',
  adaptable: 'Content can be presented in different ways',
  distinguishable: 'Content is easy to see and hear',

  // Operable
  keyboardAccessible: 'All functionality available from keyboard',
  enoughTime: 'Users have enough time to read and use content',
  seizuresAndPhysical: 'Content does not cause seizures or physical reactions',
  navigable: 'Users can navigate, find content, and determine location',
  inputModalities: 'Easier to operate functionality through various inputs',

  // Understandable
  readable: 'Text content is readable and understandable',
  predictable: 'Web pages appear and operate in predictable ways',
  inputAssistance: 'Users are helped to avoid and correct mistakes',

  // Robust
  compatible: 'Content is compatible with current and future user tools',
} as const;

/**
 * Accessibility audit helper
 */
export interface AccessibilityIssue {
  element: HTMLElement;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  wcagCriterion: string;
}

export function auditAccessibility(container: HTMLElement = document.body): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check for images without alt text
  container.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        element: img,
        issue: 'Image missing alt attribute',
        severity: 'error',
        wcagCriterion: '1.1.1 Non-text Content',
      });
    }
  });

  // Check for buttons without accessible names
  container.querySelectorAll('button').forEach((button) => {
    const name = getAccessibleName(button);
    if (!name) {
      issues.push({
        element: button,
        issue: 'Button missing accessible name',
        severity: 'error',
        wcagCriterion: '4.1.2 Name, Role, Value',
      });
    }
  });

  // Check for links without accessible names
  container.querySelectorAll('a').forEach((link) => {
    const name = getAccessibleName(link);
    if (!name) {
      issues.push({
        element: link,
        issue: 'Link missing accessible name',
        severity: 'error',
        wcagCriterion: '2.4.4 Link Purpose',
      });
    }
  });

  // Check for form inputs without labels
  container.querySelectorAll('input, select, textarea').forEach((input) => {
    if (input instanceof HTMLInputElement && input.type === 'hidden') return;

    const name = getAccessibleName(input as HTMLElement);
    if (!name) {
      issues.push({
        element: input as HTMLElement,
        issue: 'Form input missing label',
        severity: 'error',
        wcagCriterion: '3.3.2 Labels or Instructions',
      });
    }
  });

  // Check for insufficient touch targets
  container.querySelectorAll('button, a, input, select').forEach((element) => {
    if (!hasMinimumTouchTarget(element as HTMLElement)) {
      issues.push({
        element: element as HTMLElement,
        issue: 'Touch target too small (minimum 44x44px)',
        severity: 'warning',
        wcagCriterion: '2.5.5 Target Size',
      });
    }
  });

  return issues;
}
