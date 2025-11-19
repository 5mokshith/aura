"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface AnimatedToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
  },
};

export function AnimatedToast({
  type,
  message,
  description,
  duration = 5000,
  onClose,
}: AnimatedToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "glass-card rounded-lg shadow-xl border-l-4 p-4 min-w-[320px] max-w-md",
        "transition-all duration-300",
        config.border,
        isExiting
          ? "animate-slide-in-right opacity-0 translate-x-full"
          : "animate-slide-in-left"
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon with animation */}
        <div
          className={cn(
            "p-2 rounded-lg transition-all duration-300",
            config.bg,
            "animate-scale-pulse"
          )}
        >
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{message}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "p-1 rounded-md transition-all duration-200",
            "hover:bg-muted hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500",
              "animate-[slide-in-left_linear]"
            )}
            style={{
              animation: `slide-in-left ${duration}ms linear`,
              animationFillMode: "forwards",
            }}
          />
        </div>
      )}
    </div>
  );
}
