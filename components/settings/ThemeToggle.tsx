"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "group relative flex-1 flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300",
              "glass-card hover:shadow-xl hover:scale-[1.02]",
              theme === value
                ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                : "hover:ring-1 hover:ring-primary/50"
            )}
            aria-label={`Set theme to ${label}`}
          >
            {/* Animated background glow */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                "bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-yellow-600/20",
                theme === value && "opacity-100 animate-pulse"
              )}
            />
            
            {/* Icon with animation */}
            <div
              className={cn(
                "relative z-10 p-4 rounded-full transition-all duration-300",
                "glass-button",
                theme === value
                  ? "bg-primary/20 scale-110 rotate-12"
                  : "group-hover:scale-110 group-hover:rotate-6"
              )}
            >
              <Icon
                className={cn(
                  "h-8 w-8 transition-all duration-300",
                  theme === value
                    ? "text-primary animate-float"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
            </div>

            {/* Label */}
            <span
              className={cn(
                "relative z-10 font-medium transition-colors duration-300",
                theme === value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {label}
            </span>

            {/* Active indicator */}
            {theme === value && (
              <div className="absolute top-3 right-3 z-10">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
        {theme === "light" && "Bright and clear interface for daytime use"}
        {theme === "dark" && "Easy on the eyes for low-light environments"}
        {theme === "system" && "Automatically matches your system preferences"}
      </p>
    </div>
  );
}
