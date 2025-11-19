"useclient";

importReactfrom"react";
import{Mail,FileText,Calendar,Sheet,Database,Bot}from"lucide-react";
import{cn}from"@/lib/utils";

interfaceAgentIndicatorProps{
agentName:string;
className?:string;
}

constagentIcons:Record<string,React.ComponentType<{className?:string}>>={
"EmailAgent":Mail,
"DriveAgent":Database,
"DocsAgent":FileText,
"SheetsAgent":Sheet,
"CalendarAgent":Calendar,
default:Bot,
};

exportfunctionAgentIndicator({agentName,className}:AgentIndicatorProps){
constIconComponent=agentIcons[agentName]||agentIcons.default;

return(
<div
className={cn(
"flexitems-centergap-2text-smfont-medium",
className
)}
aria-label={`Agent:${agentName}`}
>
<divclassName="flexh-8w-8items-centerjustify-centerrounded-fullbg-primary/10">
<IconComponentclassName="h-4w-4text-primary"aria-hidden="true"/>
</div>
<span>{agentName}</span>
</div>
);
}
