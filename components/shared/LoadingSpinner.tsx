"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size], className)}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
      {!label && <span className="sr-only">Loading...</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  label = "Loading...",
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface DelayedLoadingProps {
  delay?: number;
  children: React.ReactNode;
}

export function DelayedLoading({ delay = 300, children }: DelayedLoadingProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return <>{children}</>;
}
