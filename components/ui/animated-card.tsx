"use client";

import { useState } from "react";
import { Card } from "./card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  tilt?: boolean;
  glow?: boolean;
  float?: boolean;
}

export function AnimatedCard({
  className,
  tilt = true,
  glow = false,
  float = false,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: AnimatedCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
    setIsHovered(true);

    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      {glow && isHovered && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl opacity-30 blur-lg transition-opacity duration-300" />
      )}

      <Card
        className={cn(
          "relative transition-all duration-300",
          float && "hover:-translate-y-2",
          className
        )}
        style={
          tilt
            ? {
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: "transform 0.1s ease-out",
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}

        {/* Shine effect */}
        {tilt && (
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${
                isHovered ? "50% 50%" : "0% 0%"
              }, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            }}
          />
        )}
      </Card>
    </div>
  );
}
