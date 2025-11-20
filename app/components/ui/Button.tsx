'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Glassmorphism Button Component
 * 
 * A reusable button component with glassmorphism styling and neon glow effects.
 * Supports multiple color variants and sizes, with built-in loading states.
 * 
 * @example
 * ```tsx
 * <Button variant="cyan" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * <Button variant="purple" size="lg" isLoading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className, children, isLoading, disabled, ...props }, ref) => {
    const baseClasses = 'touch-target inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    
    const variantClasses = {
      default: 'glass-button hover:scale-105 active:scale-95',
      cyan: 'glass-button-cyan hover:scale-105 active:scale-95',
      purple: 'glass-button-purple hover:scale-105 active:scale-95',
      pink: 'glass-button-pink hover:scale-105 active:scale-95',
      blue: 'glass-button-blue hover:scale-105 active:scale-95',
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="loading-spinner" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
