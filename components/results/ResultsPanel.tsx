"useclient";

importReactfrom"react";
importtype{WorkflowResult}from"@/types";
import{ResultCard}from"./ResultCard";
import{FileText}from"lucide-react";

interfaceResultsPanelProps{
results:WorkflowResult[];
onFeedback:(resultId:string,rating:"positive"|"negative")=>void;
}

exportfunctionResultsPanel({results,onFeedback}:ResultsPanelProps){
//Emptystatewhennoresults-Responsivesizing
if(results.length===0){
return(
<div
className="flexflex-colitems-centerjustify-centerpy-8sm:py-12px-4text-center"
role="status"
aria-label="Noresultsavailable"
>
<divclassName="rounded-fullbg-mutedp-3sm:p-4mb-3sm:mb-4"aria-hidden="true">
<FileTextclassName="size-6sm:size-8text-muted-foreground"/>
</div>
<h3className="text-basesm:text-lgfont-semiboldmb-1.5sm:mb-2">Noresultsyet</h3>
<pclassName="text-xssm:text-smtext-muted-foregroundmax-w-md">
Resultsfromyourworkflowwillappearhereoncetheexecutioniscomplete.
</p>
</div>
);
}

return(
<sectionclassName="space-y-3sm:space-y-4"aria-labelledby="results-heading">
<divclassName="flexitems-centerjustify-between">
<h2id="results-heading"className="text-basesm:text-lgfont-semibold">
Results({results.length})
</h2>
</div>

{/*Responsivegrid:1columnonmobile,2ontablet,3ondesktop*/}
<div
className="gridgrid-cols-1sm:grid-cols-2lg:grid-cols-3gap-3sm:gap-4"
role="list"
aria-label="Workflowresults"
aria-live="polite"
>
{results.map((result)=>(
<ResultCard
key={result.id}
result={result}
onFeedback={onFeedback}
/>
))}
</div>
</section>
);
}
