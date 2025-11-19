"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-40 lg:bottom-6">
      {/* Action buttons */}
      <div className="flex flex-col-reverse gap-3 mb-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 glass-card px-4 py-3 rounded-full shadow-lg",
              "transition-all duration-300 hover:scale-110 hover:shadow-xl",
              "group",
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            <div className="text-primary group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full glass-card shadow-xl",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110 hover:shadow-2xl",
          "group relative overflow-hidden",
          isOpen && "rotate-45 bg-primary/20"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {/* Animated background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500",
            "opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          )}
        />

        {/* Icon */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Plus className="h-6 w-6 text-primary" />
          )}
        </div>

        {/* Pulse ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
        )}
      </button>
    </div>
  );
}
