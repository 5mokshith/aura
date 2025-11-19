"use client";

import {
  useState,
  useRef,
  TouchEvent,
  ReactNode,
} from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPullDistance = 100;
  const triggerDistance = 70;

  const handleTouchStart = (e: TouchEvent) => {
    // Only allow pull-to-refresh when scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStart === null || isRefreshing) return;

    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;

    // Only pull down, not up
    if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      // Apply resistance to pull distance
      const resistedDistance = Math.min(
        distance * 0.5,
        maxPullDistance
      );
      setPullDistance(resistedDistance);

      // Prevent default scroll behavior when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (touchStart === null || isRefreshing) return;

    if (pullDistance >= triggerDistance) {
      setIsRefreshing(true);

      // Trigger haptic feedback if supported
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(20);
      }

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    setTouchStart(null);
  };

  const getRotation = () => {
    if (isRefreshing) return 360;
    return (pullDistance / triggerDistance) * 360;
  };

  const getOpacity = () => {
    return Math.min(pullDistance / triggerDistance, 1);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 pointer-events-none"
        style={{
          height: `${pullDistance}px`,
          opacity: getOpacity(),
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <RefreshCw
            className={cn(
              "h-6 w-6 text-primary transition-transform",
              isRefreshing && "animate-spin"
            )}
            style={{
              transform: `rotate(${getRotation()}deg)`,
            }}
          />
          <span className="text-xs text-muted-foreground">
            {isRefreshing
              ? "Refreshing..."
              : pullDistance >= triggerDistance
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content with offset when pulling */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0
            ? "transform 0.2s ease-out"
            : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
