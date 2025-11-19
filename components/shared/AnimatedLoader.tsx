"use client";

import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  text?: string;
}

export function AnimatedLoader({
  size = "md",
  variant = "spinner",
  text,
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (variant === "spinner") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className={cn(
              "rounded-full border-4 border-white/30 border-t-primary animate-spin",
              sizeClasses[size]
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full border-4 border-transparent border-r-purple-500 animate-spin",
              sizeClasses[size]
            )}
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-primary",
                size === "sm" && "w-2 h-2",
                size === "md" && "w-3 h-3",
                size === "lg" && "w-4 h-4",
                "animate-bounce-subtle"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className={cn(
              "rounded-full bg-primary/30 animate-ping",
              sizeClasses[size]
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-primary animate-pulse",
              sizeClasses[size]
            )}
          />
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1 items-end">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-sm",
                size === "sm" && "w-1",
                size === "md" && "w-2",
                size === "lg" && "w-3"
              )}
              style={{
                height: size === "sm" ? "16px" : size === "md" ? "32px" : "48px",
                animation: "scale-pulse 1s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return null;
}
