'use client';

import { useEffect, useRef, RefObject } from 'react';
import {
  detectSwipe,
  getTouchPoint,
  type SwipeGesture,
  type TouchPoint,
} from '@/app/lib/touch';

/**
 * Hook for swipe gestures
 */
export function useSwipe(
  ref: RefObject<HTMLElement>,
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  },
  threshold: number = 50
) {
  const startTouch = useRef<TouchPoint | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      startTouch.current = getTouchPoint(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch.current) return;

      const endTouch = getTouchPoint(e);
      const swipe = detectSwipe(startTouch.current, endTouch, threshold);

      if (swipe) {
        switch (swipe.direction) {
          case 'left':
            callbacks.onSwipeLeft?.();
            break;
          case 'right':
            callbacks.onSwipeRight?.();
            break;
          case 'up':
            callbacks.onSwipeUp?.();
            break;
          case 'down':
            callbacks.onSwipeDown?.();
            break;
        }
      }

      startTouch.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, callbacks, threshold]);
}

/**
 * Hook for long press gesture
 */
export function useLongPress(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  duration: number = 500
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const startPoint = useRef<TouchPoint | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      startPoint.current = getTouchPoint(e);
      timeout.current = setTimeout(callback, duration);
    };

    const handleTouchEnd = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      startPoint.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startPoint.current) return;

      const currentPoint = getTouchPoint(e);
      const distance = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.current.x, 2) +
          Math.pow(currentPoint.y - startPoint.current.y, 2)
      );

      // Cancel if finger moves more than 10px
      if (distance > 10 && timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [ref, callback, duration]);
}

/**
 * Hook for double tap gesture
 */
export function useDoubleTap(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  delay: number = 300
) {
  const lastTap = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchEnd = () => {
      const now = Date.now();
      if (now - lastTap.current < delay) {
        callback();
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    };

    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, callback, delay]);
}

/**
 * Hook for pinch gesture (zoom)
 */
export function usePinch(
  ref: RefObject<HTMLElement>,
  onPinch: (scale: number) => void
) {
  const initialDistance = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getDistance = (touch1: Touch, touch2: Touch): number => {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance.current = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance.current > 0) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialDistance.current;
        onPinch(scale);
      }
    };

    const handleTouchEnd = () => {
      initialDistance.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onPinch]);
}

/**
 * Hook to detect if device supports touch
 */
export function useIsTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Hook for touch ripple effect
 */
export function useTouchRipple(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouch = (e: TouchEvent | MouseEvent) => {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();

      let x: number, y: number;

      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      ripple.style.position = 'absolute';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'touchRipple 0.6s ease-out';

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    element.addEventListener('touchstart', handleTouch);
    element.addEventListener('mousedown', handleTouch);

    return () => {
      element.removeEventListener('touchstart', handleTouch);
      element.removeEventListener('mousedown', handleTouch);
    };
  }, [ref]);
}

/**
 * Hook for touch feedback (scale and opacity)
 */
export function useTouchFeedback(
  ref: RefObject<HTMLElement>,
  options: {
    scale?: number;
    opacity?: number;
    duration?: number;
  } = {}
) {
  const { scale = 0.97, opacity = 0.9, duration = 100 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;

    const handleTouchStart = () => {
      element.style.transform = `scale(${scale})`;
      element.style.opacity = `${opacity}`;
      element.style.transition = `all ${duration}ms ease-out`;
    };

    const handleTouchEnd = () => {
      element.style.transform = originalTransform;
      element.style.opacity = originalOpacity;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [ref, scale, opacity, duration]);
}
