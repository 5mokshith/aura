'use client';

import { useEffect, useState, useRef } from 'react';
import {
  announceToScreenReader,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode,
  generateAriaId,
  createLiveRegion,
  updateLiveRegion,
  removeLiveRegion,
} from '@/app/lib/accessibility';

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
  return (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  };
}

/**
 * Hook to check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

/**
 * Hook to check if user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    setHighContrast(prefersHighContrast());

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handler = (e: MediaQueryListEvent) => setHighContrast(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return highContrast;
}

/**
 * Hook to check if user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(prefersDarkMode());

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return darkMode;
}

/**
 * Hook to generate stable ARIA IDs
 */
export function useAriaId(prefix: string = 'aria'): string {
  const idRef = useRef<string>();

  if (!idRef.current) {
    idRef.current = generateAriaId(prefix);
  }

  return idRef.current;
}

/**
 * Hook for ARIA live region
 */
export function useLiveRegion(priority: 'polite' | 'assertive' = 'polite') {
  const regionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    regionRef.current = createLiveRegion(priority);

    return () => {
      if (regionRef.current) {
        removeLiveRegion(regionRef.current);
      }
    };
  }, [priority]);

  const announce = (message: string) => {
    if (regionRef.current) {
      updateLiveRegion(regionRef.current, message);
    }
  };

  return announce;
}

/**
 * Hook for ARIA describedby relationship
 */
export function useAriaDescribedBy(description: string): {
  descriptionId: string;
  descriptionProps: {
    id: string;
    children: string;
  };
  ariaDescribedBy: string;
} {
  const descriptionId = useAriaId('description');

  return {
    descriptionId,
    descriptionProps: {
      id: descriptionId,
      children: description,
    },
    ariaDescribedBy: descriptionId,
  };
}

/**
 * Hook for ARIA labelledby relationship
 */
export function useAriaLabelledBy(label: string): {
  labelId: string;
  labelProps: {
    id: string;
    children: string;
  };
  ariaLabelledBy: string;
} {
  const labelId = useAriaId('label');

  return {
    labelId,
    labelProps: {
      id: labelId,
      children: label,
    },
    ariaLabelledBy: labelId,
  };
}

/**
 * Hook for managing focus on mount/unmount
 */
export function useFocusManagement(
  shouldFocus: boolean = true,
  restoreFocus: boolean = true
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus) {
      previouslyFocused.current = document.activeElement as HTMLElement;
    }

    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }

    return () => {
      if (restoreFocus && previouslyFocused.current) {
        previouslyFocused.current.focus();
      }
    };
  }, [shouldFocus, restoreFocus]);

  return elementRef;
}

/**
 * Hook for ARIA expanded state
 */
export function useAriaExpanded(initialState: boolean = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggle = () => setIsExpanded((prev) => !prev);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    ariaExpanded: isExpanded,
  };
}

/**
 * Hook for ARIA selected state
 */
export function useAriaSelected(initialState: boolean = false) {
  const [isSelected, setIsSelected] = useState(initialState);

  const toggle = () => setIsSelected((prev) => !prev);
  const select = () => setIsSelected(true);
  const deselect = () => setIsSelected(false);

  return {
    isSelected,
    toggle,
    select,
    deselect,
    ariaSelected: isSelected,
  };
}

/**
 * Hook for ARIA pressed state (toggle buttons)
 */
export function useAriaPressed(initialState: boolean = false) {
  const [isPressed, setIsPressed] = useState(initialState);

  const toggle = () => setIsPressed((prev) => !prev);
  const press = () => setIsPressed(true);
  const release = () => setIsPressed(false);

  return {
    isPressed,
    toggle,
    press,
    release,
    ariaPressed: isPressed,
  };
}

/**
 * Hook for ARIA checked state (checkboxes)
 */
export function useAriaChecked(initialState: boolean = false) {
  const [isChecked, setIsChecked] = useState(initialState);

  const toggle = () => setIsChecked((prev) => !prev);
  const check = () => setIsChecked(true);
  const uncheck = () => setIsChecked(false);

  return {
    isChecked,
    toggle,
    check,
    uncheck,
    ariaChecked: isChecked,
  };
}

/**
 * Hook for ARIA invalid state (form validation)
 */
export function useAriaInvalid(isInvalid: boolean = false) {
  const errorId = useAriaId('error');

  return {
    ariaInvalid: isInvalid,
    ariaErrorMessage: isInvalid ? errorId : undefined,
    errorId,
  };
}

/**
 * Hook for ARIA busy state (loading)
 */
export function useAriaBusy(isBusy: boolean = false) {
  return {
    ariaBusy: isBusy,
    ariaLive: isBusy ? 'polite' : undefined,
  };
}

/**
 * Hook for ARIA current state (navigation)
 */
export function useAriaCurrent(
  currentValue: 'page' | 'step' | 'location' | 'date' | 'time' | boolean = false
) {
  return {
    ariaCurrent: currentValue,
  };
}

/**
 * Hook for screen reader only text
 */
export function useScreenReaderOnly() {
  return {
    className: 'sr-only',
  };
}

/**
 * Hook to detect if screen reader is active
 */
export function useScreenReaderDetection(): boolean {
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    // Check for common screen reader indicators
    const hasScreenReader =
      // @ts-ignore
      navigator.userAgent.includes('JAWS') ||
      // @ts-ignore
      navigator.userAgent.includes('NVDA') ||
      // @ts-ignore
      navigator.userAgent.includes('VoiceOver') ||
      // Check if user has enabled accessibility features
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(prefers-contrast: high)').matches;

    setIsScreenReader(hasScreenReader);
  }, []);

  return isScreenReader;
}

/**
 * Hook for accessible form field
 */
export function useAccessibleFormField(
  label: string,
  options: {
    required?: boolean;
    error?: string;
    description?: string;
  } = {}
) {
  const { required = false, error, description } = options;

  const fieldId = useAriaId('field');
  const labelId = useAriaId('label');
  const errorId = useAriaId('error');
  const descriptionId = useAriaId('description');

  const ariaDescribedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    fieldId,
    labelId,
    errorId,
    descriptionId,
    fieldProps: {
      id: fieldId,
      'aria-labelledby': labelId,
      'aria-describedby': ariaDescribedBy || undefined,
      'aria-invalid': !!error,
      'aria-required': required,
    },
    labelProps: {
      id: labelId,
      htmlFor: fieldId,
    },
    errorProps: error
      ? {
          id: errorId,
          role: 'alert',
        }
      : undefined,
    descriptionProps: description
      ? {
          id: descriptionId,
        }
      : undefined,
  };
}

/**
 * Hook for accessible modal/dialog
 */
export function useAccessibleModal(
  isOpen: boolean,
  title: string,
  options: {
    closeOnEscape?: boolean;
    restoreFocus?: boolean;
  } = {}
) {
  const { closeOnEscape = true, restoreFocus = true } = options;

  const modalId = useAriaId('modal');
  const titleId = useAriaId('modal-title');
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
    } else if (restoreFocus && previouslyFocused.current) {
      previouslyFocused.current.focus();
    }
  }, [isOpen, restoreFocus]);

  return {
    modalId,
    titleId,
    modalProps: {
      id: modalId,
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': titleId,
    },
    titleProps: {
      id: titleId,
    },
  };
}
