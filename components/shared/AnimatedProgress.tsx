"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "striped";
  animated?: boolean;
}

export function AnimatedProgress({
  value,
  max = 100,
  showPercentage = true,
  showLabel = false,
  label,
  size = "md",
  variant = "gradient",
  animated = true,
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="space-y-2">
      {/* Label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {showLabel && label && (
            <span className="font-medium">{label}</span>
          )}
          {showPercentage && (
            <span
              className={cn(
                "font-mono font-semibold transition-all duration-300",
                displayValue >= 100 && "text-green-600 dark:text-green-400 animate-bounce-subtle"
              )}
            >
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className={cn(
          "relative w-full rounded-full overflow-hidden glass-input",
          sizeClasses[size]
        )}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-muted/30" />

        {/* Progress fill */}
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out relative overflow-hidden",
            variant === "default" && "bg-primary",
            variant === "gradient" &&
              "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
            variant === "striped" &&
              "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
            animated && "transition-all"
          )}
          style={{ width: `${displayValue}%` }}
        >
          {/* Shimmer effect */}
          {animated && variant === "gradient" && (
            <div className="absolute inset-0 shimmer" />
          )}

          {/* Striped pattern */}
          {variant === "striped" && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent)",
                backgroundSize: "1rem 1rem",
                animation: animated ? "slide-in-left 1s linear infinite" : "none",
              }}
            />
          )}

          {/* Glow effect at the end */}
          {displayValue > 0 && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent" />
          )}
        </div>

        {/* Completion pulse */}
        {displayValue >= 100 && (
          <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
        )}
      </div>

      {/* Milestone markers */}
      {max > 0 && (
        <div className="relative h-2">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                "absolute top-0 w-0.5 h-2 transition-all duration-300",
                displayValue >= milestone
                  ? "bg-primary scale-y-150"
                  : "bg-muted scale-y-100"
              )}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
