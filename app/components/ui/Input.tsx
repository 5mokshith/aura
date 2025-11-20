'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isRequired?: boolean;
}

/**
 * Glassmorphism Input Component
 * 
 * A reusable input component with glassmorphism styling and neon focus effects.
 * Includes support for labels, helper text, error states, and accessibility features.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   isRequired
 * />
 * 
 * <Input
 *   label="Password"
 *   type="password"
 *   errorText="Password is required"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorText, isRequired, className, id, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`;
    const helperTextId = `${inputId}-helper`;
    const errorTextId = `${inputId}-error`;
    const hasError = !!errorText;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'form-label',
              isRequired && 'form-label-required'
            )}
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'glass-input w-full px-4 py-3 text-base text-white placeholder:text-white/50 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[44px]',
            hasError && 'input-error',
            className
          )}
          aria-required={isRequired}
          aria-invalid={hasError}
          aria-describedby={cn(
            helperText && helperTextId,
            errorText && errorTextId
          )}
          {...props}
        />
        
        {helperText && !errorText && (
          <span id={helperTextId} className="form-helper-text">
            {helperText}
          </span>
        )}
        
        {errorText && (
          <span id={errorTextId} className="form-error-text" role="alert">
            {errorText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
