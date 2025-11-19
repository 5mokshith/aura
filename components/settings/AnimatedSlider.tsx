"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSliderProps {
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  onChange?: (value: number) => void;
  icon?: React.ReactNode;
}

export function AnimatedSlider({
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  unit = "",
  onChange,
  icon,
}: AnimatedSliderProps) {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300",
        "glass-card hover:shadow-lg",
        isDragging && "scale-[1.01] shadow-xl ring-2 ring-primary/50"
      )}
    >
      {/* Animated background */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-600/5",
          isDragging && "opacity-100"
        )}
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          {icon && (
            <div
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                "glass-button",
                isDragging && "scale-110 rotate-6 bg-primary/20"
              )}
            >
              <div
                className={cn(
                  "transition-colors duration-300",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              >
                {icon}
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">{label}</h4>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              <div
                className={cn(
                  "px-3 py-1 rounded-lg font-mono text-sm transition-all duration-300",
                  "glass-button",
                  isDragging && "scale-110 bg-primary/20 text-primary"
                )}
              >
                {value}
                {unit}
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Track */}
          <div className="h-2 rounded-full glass-input overflow-hidden">
            {/* Progress */}
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500",
                isDragging && "shadow-lg shadow-yellow-500/50"
              )}
              style={{ width: `${percentage}%` }}
            >
              {/* Shimmer effect */}
              <div className="h-full w-full shimmer" />
            </div>
          </div>

          {/* Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            aria-label={label}
          />

          {/* Thumb indicator */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none",
              "glass-card shadow-lg transition-all duration-300",
              isDragging
                ? "scale-150 shadow-xl shadow-primary/50 ring-4 ring-primary/30"
                : "scale-100 group-hover:scale-125"
            )}
            style={{ left: `calc(${percentage}% - 12px)` }}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-opacity duration-300",
                isDragging ? "opacity-100 bg-primary/30 animate-pulse" : "opacity-0"
              )}
            />
          </div>
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
