"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSwitchProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
}

export function AnimatedSwitch({
  label,
  description,
  defaultChecked = false,
  onChange,
  icon,
}: AnimatedSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-300 cursor-pointer",
        "glass-card hover:shadow-lg hover:scale-[1.01]",
        checked && "ring-2 ring-primary/50"
      )}
      onClick={handleToggle}
    >
      {/* Animated background */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-600/10",
          checked && "opacity-100"
        )}
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        {icon && (
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              "glass-button",
              checked
                ? "bg-primary/20 scale-110 rotate-6"
                : "group-hover:scale-105 group-hover:rotate-3"
            )}
          >
            <div
              className={cn(
                "transition-colors duration-300",
                checked ? "text-primary" : "text-muted-foreground"
              )}
            >
              {icon}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-medium">{label}</h4>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>

            {/* Toggle Switch */}
            <div
              className={cn(
                "relative w-14 h-7 rounded-full transition-all duration-300",
                "glass-button",
                checked ? "bg-primary/30" : "bg-muted"
              )}
            >
              {/* Switch knob */}
              <div
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full transition-all duration-300",
                  "bg-white dark:bg-gray-900 shadow-lg",
                  checked
                    ? "left-8 scale-110 shadow-primary/50"
                    : "left-1 group-hover:scale-105"
                )}
              >
                {/* Inner glow */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full transition-opacity duration-300",
                    checked ? "opacity-100 bg-primary/20 animate-pulse" : "opacity-0"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute inset-0 bg-primary/20 scale-0 rounded-full transition-transform duration-500",
            checked && "animate-ping"
          )}
        />
      </div>
    </div>
  );
}
