"use client";

import { useState } from "react";
import { Button, buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface AnimatedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ripple?: boolean;
  bounce?: boolean;
}

export function AnimatedButton({
  className,
  variant,
  size,
  asChild = false,
  ripple = true,
  bounce = false,
  children,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <Button
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(
        "relative overflow-hidden",
        bounce && "hover:animate-bounce-subtle",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <>
        {children}
        {ripple && (
          <span className="absolute inset-0 pointer-events-none">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 0,
                  height: 0,
                }}
              />
            ))}
          </span>
        )}
      </>
    </Button>
  );
}
