"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info", duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random()}`;

      // Determine auto-dismiss duration based on variant
      let autoDismissDuration = duration;
      if (autoDismissDuration === undefined) {
        switch (variant) {
          case "success":
            autoDismissDuration = 3000; // 3s for success
            break;
          case "warning":
            autoDismissDuration = 5000; // 5s for warning
            break;
          case "error":
            autoDismissDuration = 0; // Manual dismiss for errors
            break;
          case "info":
            autoDismissDuration = 4000; // 4s for info
            break;
        }
      }

      const newToast: Toast = {
        id,
        message,
        variant,
        duration: autoDismissDuration,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss if duration is set
      if (autoDismissDuration && autoDismissDuration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, autoDismissDuration);
      }
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-50 flex flex-col gap-2 pointer-events-none"
      style={{
        top: "1rem",
        right: "1rem",
        // On mobile, position at bottom for better reachability
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            top: auto;
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
          }
        }
      `}</style>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const variantStyles = {
    success: {
      container: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      text: "text-green-900 dark:text-green-100",
      IconComponent: CheckCircle2,
    },
    error: {
      container: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      text: "text-red-900 dark:text-red-100",
      IconComponent: AlertCircle,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      text: "text-yellow-900 dark:text-yellow-100",
      IconComponent: AlertTriangle,
    },
    info: {
      container: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100",
      IconComponent: Info,
    },
  };

  const style = variantStyles[toast.variant];
  const Icon = style.IconComponent;

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg",
        "animate-in-slide-in-top-5 fade-in duration-300",
        "max-w-md w-full",
        style.container
      )}
    >
      <Icon
        className={cn("size-5 flex-shrink-0 mt-0.5", style.icon)}
        aria-hidden="true"
      />

      <p className={cn("flex-1 text-sm font-medium", style.text)}>{toast.message}</p>

      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current",
          "transition-colors",
          style.icon
        )}
        aria-label="Dismiss notification"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
