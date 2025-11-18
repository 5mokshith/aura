"use***REMOVED***client";

import***REMOVED***React***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***Mail,***REMOVED***FileText,***REMOVED***Calendar,***REMOVED***Sheet,***REMOVED***Database,***REMOVED***Bot***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

interface***REMOVED***AgentIndicatorProps***REMOVED***{
***REMOVED******REMOVED***agentName:***REMOVED***string;
***REMOVED******REMOVED***className?:***REMOVED***string;
}

const***REMOVED***agentIcons:***REMOVED***Record<string,***REMOVED***React.ComponentType<{***REMOVED***className?:***REMOVED***string***REMOVED***}>>***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***"Email***REMOVED***Agent":***REMOVED***Mail,
***REMOVED******REMOVED***"Drive***REMOVED***Agent":***REMOVED***Database,
***REMOVED******REMOVED***"Docs***REMOVED***Agent":***REMOVED***FileText,
***REMOVED******REMOVED***"Sheets***REMOVED***Agent":***REMOVED***Sheet,
***REMOVED******REMOVED***"Calendar***REMOVED***Agent":***REMOVED***Calendar,
***REMOVED******REMOVED***default:***REMOVED***Bot,
};

export***REMOVED***function***REMOVED***AgentIndicator({***REMOVED***agentName,***REMOVED***className***REMOVED***}:***REMOVED***AgentIndicatorProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***IconComponent***REMOVED***=***REMOVED***agentIcons[agentName]***REMOVED***||***REMOVED***agentIcons.default;

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"flex***REMOVED***items-center***REMOVED***gap-2***REMOVED***text-sm***REMOVED***font-medium",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label={`Agent:***REMOVED***${agentName}`}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***h-8***REMOVED***w-8***REMOVED***items-center***REMOVED***justify-center***REMOVED***rounded-full***REMOVED***bg-primary/10">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<IconComponent***REMOVED***className="h-4***REMOVED***w-4***REMOVED***text-primary"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>{agentName}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
