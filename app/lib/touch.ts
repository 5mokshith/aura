/**
 * Touch Gesture Utilities
 * Helpers for handling touch interactions and gestures
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration: number;
  velocity: number;
}

export interface PinchGesture {
  scale: number;
  center: { x: number; y: number };
}

/**
 * Detect swipe gesture from touch events
 */
export function detectSwipe(
  startTouch: TouchPoint,
  endTouch: TouchPoint,
  threshold: number = 50
): SwipeGesture | null {
  const deltaX = endTouch.x - startTouch.x;
  const deltaY = endTouch.y - startTouch.y;
  const duration = endTouch.timestamp - startTouch.timestamp;
  
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  
  // Determine if it's a horizontal or vertical swipe
  if (absX > absY && absX > threshold) {
    const direction = deltaX > 0 ? 'right' : 'left';
    return {
      direction,
      distance: absX,
      duration,
      velocity: absX / duration,
    };
  } else if (absY > absX && absY > threshold) {
    const direction = deltaY > 0 ? 'down' : 'up';
    return {
      direction,
      distance: absY,
      duration,
      velocity: absY / duration,
    };
  }
  
  return null;
}

/**
 * Get touch point from touch event
 */
export function getTouchPoint(event: TouchEvent): TouchPoint {
  const touch = event.touches[0] || event.changedTouches[0];
  return {
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  };
}

/**
 * Detect long press gesture
 */
export function detectLongPress(
  callback: () => void,
  duration: number = 500
): {
  onTouchStart: (e: TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;
  let startPoint: TouchPoint | null = null;
  
  return {
    onTouchStart: (e: TouchEvent) => {
      startPoint = getTouchPoint(e);
      timeout = setTimeout(callback, duration);
    },
    onTouchEnd: () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      startPoint = null;
    },
    onTouchMove: () => {
      // Cancel long press if finger moves
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    },
  };
}

/**
 * Detect double tap gesture
 */
export function detectDoubleTap(
  callback: () => void,
  delay: number = 300
): {
  onTouchEnd: () => void;
} {
  let lastTap = 0;
  
  return {
    onTouchEnd: () => {
      const now = Date.now();
      if (now - lastTap < delay) {
        callback();
        lastTap = 0;
      } else {
        lastTap = now;
      }
    },
  };
}

/**
 * Detect pinch gesture (for zoom)
 */
export function detectPinch(
  onPinch: (gesture: PinchGesture) => void
): {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
} {
  let initialDistance = 0;
  let initialCenter = { x: 0, y: 0 };
  
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const getCenter = (touch1: Touch, touch2: Touch) => ({
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  });
  
  return {
    onTouchStart: (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        initialCenter = getCenter(e.touches[0], e.touches[1]);
      }
    },
    onTouchMove: (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialDistance;
        const center = getCenter(e.touches[0], e.touches[1]);
        
        onPinch({ scale, center });
      }
    },
    onTouchEnd: () => {
      initialDistance = 0;
    },
  };
}

/**
 * Add touch ripple effect to element
 */
export function addTouchRipple(element: HTMLElement, event: TouchEvent | MouseEvent) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  
  let x: number, y: number;
  
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  } else {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
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
}

/**
 * Prevent default touch behaviors
 */
export function preventTouchDefaults(element: HTMLElement) {
  element.style.touchAction = 'manipulation';
  element.style.webkitTapHighlightColor = 'transparent';
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
}

/**
 * Enable smooth scrolling for touch
 */
export function enableSmoothScroll(element: HTMLElement) {
  element.style.scrollBehavior = 'smooth';
  element.style.webkitOverflowScrolling = 'touch';
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get optimal touch target size based on device
 */
export function getOptimalTouchSize(): number {
  if (!isTouchDevice()) return 32; // Desktop default
  
  // Mobile devices need larger touch targets
  return 44; // WCAG recommended minimum
}

/**
 * Add touch feedback to button
 */
export function addTouchFeedback(
  element: HTMLElement,
  options: {
    scale?: number;
    opacity?: number;
    duration?: number;
  } = {}
) {
  const { scale = 0.97, opacity = 0.9, duration = 100 } = options;
  
  const originalTransform = element.style.transform;
  const originalOpacity = element.style.opacity;
  
  element.addEventListener('touchstart', () => {
    element.style.transform = `scale(${scale})`;
    element.style.opacity = `${opacity}`;
    element.style.transition = `all ${duration}ms ease-out`;
  });
  
  element.addEventListener('touchend', () => {
    element.style.transform = originalTransform;
    element.style.opacity = originalOpacity;
  });
  
  element.addEventListener('touchcancel', () => {
    element.style.transform = originalTransform;
    element.style.opacity = originalOpacity;
  });
}
