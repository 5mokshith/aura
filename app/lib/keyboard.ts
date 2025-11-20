/**
 * Keyboard Navigation Utilities
 * Helpers for keyboard shortcuts and navigation
 */

export type KeyboardKey =
  | 'Enter'
  | 'Space'
  | 'Escape'
  | 'Tab'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | string;

export interface KeyboardShortcut {
  key: KeyboardKey;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

/**
 * Check if keyboard event matches shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: Omit<KeyboardShortcut, 'callback' | 'description'>
): boolean {
  return (
    event.key === shortcut.key &&
    !!event.ctrlKey === !!shortcut.ctrl &&
    !!event.shiftKey === !!shortcut.shift &&
    !!event.altKey === !!shortcut.alt &&
    !!event.metaKey === !!shortcut.meta
  );
}

/**
 * Register keyboard shortcuts
 */
export function registerShortcuts(shortcuts: KeyboardShortcut[]): () => void {
  const handler = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.callback(event);
        break;
      }
    }
  };

  window.addEventListener('keydown', handler);

  return () => {
    window.removeEventListener('keydown', handler);
  };
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      return (
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        !el.hasAttribute('hidden') &&
        window.getComputedStyle(el).visibility !== 'hidden'
      );
    }
  );
}

/**
 * Focus first element in container
 */
export function focusFirst(container: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    return true;
  }
  return false;
}

/**
 * Focus last element in container
 */
export function focusLast(container: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[elements.length - 1].focus();
    return true;
  }
  return false;
}

/**
 * Focus next element in container
 */
export function focusNext(container: HTMLElement, currentElement: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);

  if (currentIndex >= 0 && currentIndex < elements.length - 1) {
    elements[currentIndex + 1].focus();
    return true;
  }

  return false;
}

/**
 * Focus previous element in container
 */
export function focusPrevious(container: HTMLElement, currentElement: HTMLElement): boolean {
  const elements = getFocusableElements(container);
  const currentIndex = elements.indexOf(currentElement);

  if (currentIndex > 0) {
    elements[currentIndex - 1].focus();
    return true;
  }

  return false;
}

/**
 * Create focus trap for modals
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  let previouslyFocused: HTMLElement | null = null;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const elements = getFocusableElements(container);
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return {
    activate: () => {
      previouslyFocused = document.activeElement as HTMLElement;
      container.addEventListener('keydown', handleKeyDown);
      focusFirst(container);
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    },
  };
}

/**
 * Handle arrow key navigation in a list
 */
export function handleListNavigation(
  event: KeyboardEvent,
  container: HTMLElement,
  options: {
    orientation?: 'vertical' | 'horizontal';
    loop?: boolean;
  } = {}
): boolean {
  const { orientation = 'vertical', loop = true } = options;

  const upKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
  const downKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

  if (event.key === upKey) {
    event.preventDefault();
    const currentElement = document.activeElement as HTMLElement;
    if (!focusPrevious(container, currentElement) && loop) {
      focusLast(container);
    }
    return true;
  }

  if (event.key === downKey) {
    event.preventDefault();
    const currentElement = document.activeElement as HTMLElement;
    if (!focusNext(container, currentElement) && loop) {
      focusFirst(container);
    }
    return true;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    focusFirst(container);
    return true;
  }

  if (event.key === 'End') {
    event.preventDefault();
    focusLast(container);
    return true;
  }

  return false;
}

/**
 * Handle arrow key navigation in a grid
 */
export function handleGridNavigation(
  event: KeyboardEvent,
  container: HTMLElement,
  columns: number
): boolean {
  const elements = getFocusableElements(container);
  const currentElement = document.activeElement as HTMLElement;
  const currentIndex = elements.indexOf(currentElement);

  if (currentIndex === -1) return false;

  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowUp':
      newIndex = currentIndex - columns;
      break;
    case 'ArrowDown':
      newIndex = currentIndex + columns;
      break;
    case 'ArrowLeft':
      newIndex = currentIndex - 1;
      break;
    case 'ArrowRight':
      newIndex = currentIndex + 1;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = elements.length - 1;
      break;
    default:
      return false;
  }

  if (newIndex >= 0 && newIndex < elements.length) {
    event.preventDefault();
    elements[newIndex].focus();
    return true;
  }

  return false;
}

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'callback'>): string {
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('⌘');

  parts.push(shortcut.key);

  return parts.join(' + ');
}

/**
 * Detect if user is navigating with keyboard
 */
export function detectKeyboardNavigation(): () => void {
  let isKeyboardNavigating = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      isKeyboardNavigating = true;
      document.body.classList.add('keyboard-navigating');
      document.body.classList.remove('mouse-navigating');
    }
  };

  const handleMouseDown = () => {
    isKeyboardNavigating = false;
    document.body.classList.add('mouse-navigating');
    document.body.classList.remove('keyboard-navigating');
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mousedown', handleMouseDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('mousedown', handleMouseDown);
  };
}

/**
 * Common keyboard shortcuts for AURA
 */
export const AURA_SHORTCUTS = {
  // Navigation
  FOCUS_SEARCH: { key: '/', description: 'Focus search' },
  FOCUS_INPUT: { key: 'i', ctrl: true, description: 'Focus chat input' },
  OPEN_SETTINGS: { key: ',', ctrl: true, description: 'Open settings' },
  OPEN_TIMELINE: { key: 't', ctrl: true, description: 'Open timeline' },
  OPEN_FILES: { key: 'f', ctrl: true, description: 'Open files' },
  OPEN_LOGS: { key: 'l', ctrl: true, description: 'Open logs' },

  // Actions
  SEND_MESSAGE: { key: 'Enter', description: 'Send message' },
  NEW_LINE: { key: 'Enter', shift: true, description: 'New line' },
  CANCEL: { key: 'Escape', description: 'Cancel/Close' },
  SAVE: { key: 's', ctrl: true, description: 'Save' },
  REFRESH: { key: 'r', ctrl: true, description: 'Refresh' },

  // Task Management
  RETRY_TASK: { key: 'r', description: 'Retry failed task' },
  VIEW_DETAILS: { key: 'Enter', description: 'View task details' },
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, description: 'Toggle sidebar' },

  // Accessibility
  SKIP_TO_CONTENT: { key: 'Tab', description: 'Skip to main content' },
  SHOW_SHORTCUTS: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
} as const;

/**
 * Scroll element into view with keyboard focus
 */
export function scrollIntoViewIfNeeded(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const isVisible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth;

  if (!isVisible) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
