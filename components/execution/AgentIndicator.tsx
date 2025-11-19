"use client";

import React from "react";
import {
  Mail,
  FileText,
  Calendar,
  Sheet,
  Database,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentIndicatorProps {
  agentName: string;
  className?: string;
}

const agentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "EmailAgent": Mail,
  "DriveAgent": Database,
  "DocsAgent": FileText,
  "SheetsAgent": Sheet,
  "CalendarAgent": Calendar,
  default: Bot,
};

export function AgentIndicator({ agentName, className }: AgentIndicatorProps) {
  const IconComponent = agentIcons[agentName] || agentIcons.default;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        className
      )}
      aria-label={`Agent:${agentName}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <IconComponent className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <span>{agentName}</span>
    </div>
  );
}
