"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isTransitioning
          ? "opacity-0 translate-y-4"
          : "opacity-100 translate-y-0 animate-fade-in-up"
      )}
    >
      {children}
    </div>
  );
}
