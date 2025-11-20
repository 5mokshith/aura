'use client';

import { useEffect, useRef, RefObject } from 'react';
import {
  registerShortcuts,
  createFocusTrap,
  handleListNavigation,
  handleGridNavigation,
  detectKeyboardNavigation,
  type KeyboardShortcut,
} from '@/app/lib/keyboard';

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const cleanup = registerShortcuts(shortcuts);
    return cleanup;
  }, [shortcuts]);
}

/**
 * Hook for focus trap (useful for modals)
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement>,
  isActive: boolean = true
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !isActive) return;

    const trap = createFocusTrap(element);
    trap.activate();

    return () => {
      trap.deactivate();
    };
  }, [ref, isActive]);
}

/**
 * Hook for list navigation with arrow keys
 */
export function useListNavigation(
  ref: RefObject<HTMLElement>,
  options: {
    orientation?: 'vertical' | 'horizontal';
    loop?: boolean;
  } = {}
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      handleListNavigation(event, element, options);
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, options]);
}

/**
 * Hook for grid navigation with arrow keys
 */
export function useGridNavigation(
  ref: RefObject<HTMLElement>,
  columns: number
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      handleGridNavigation(event, element, columns);
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, columns]);
}

/**
 * Hook to detect keyboard navigation mode
 */
export function useKeyboardNavigationDetection() {
  useEffect(() => {
    const cleanup = detectKeyboardNavigation();
    return cleanup;
  }, []);
}

/**
 * Hook for escape key handler
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
}

/**
 * Hook for enter key handler
 */
export function useEnterKey(
  callback: () => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
    requireCtrl?: boolean;
    requireShift?: boolean;
  } = {}
) {
  const { enabled = true, preventDefault = true, requireCtrl = false, requireShift = false } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        (!requireCtrl || event.ctrlKey) &&
        (!requireShift || event.shiftKey)
      ) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled, preventDefault, requireCtrl, requireShift]);
}

/**
 * Hook for arrow key navigation
 */
export function useArrowKeys(
  callbacks: {
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  },
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          callbacks.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          callbacks.onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          callbacks.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          callbacks.onArrowRight?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks, enabled]);
}

/**
 * Hook for home/end key navigation
 */
export function useHomeEndKeys(
  callbacks: {
    onHome?: () => void;
    onEnd?: () => void;
  },
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Home':
          event.preventDefault();
          callbacks.onHome?.();
          break;
        case 'End':
          event.preventDefault();
          callbacks.onEnd?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks, enabled]);
}

/**
 * Hook for tab key handler
 */
export function useTabKey(
  callback: (shiftKey: boolean) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        callback(event.shiftKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled]);
}

/**
 * Hook for space key handler
 */
export function useSpaceKey(
  callback: () => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const { enabled = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Space') {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, enabled, preventDefault]);
}

/**
 * Hook for custom key combination
 */
export function useKeyCombo(
  keys: {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  },
  callback: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === keys.key &&
        !!event.ctrlKey === !!keys.ctrl &&
        !!event.shiftKey === !!keys.shift &&
        !!event.altKey === !!keys.alt &&
        !!event.metaKey === !!keys.meta
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, enabled]);
}

/**
 * Hook to auto-focus element on mount
 */
export function useAutoFocus(ref: RefObject<HTMLElement>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (element) {
      // Small delay to ensure element is fully rendered
      setTimeout(() => {
        element.focus();
      }, 100);
    }
  }, [ref, enabled]);
}

/**
 * Hook to restore focus on unmount
 */
export function useRestoreFocus(ref: RefObject<HTMLElement>) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;

    return () => {
      if (previouslyFocused.current) {
        previouslyFocused.current.focus();
      }
    };
  }, []);
}
