"useclient";

importReact,{useState}from"react";
import{Button}from"@/components/ui/button";
import{ThumbsUp,ThumbsDown}from"lucide-react";
import{cn}from"@/lib/utils";

interfaceFeedbackWidgetProps{
resultId:string;
onFeedback:(resultId:string,rating:"positive"|"negative")=>void;
}

exportfunctionFeedbackWidget({resultId,onFeedback}:FeedbackWidgetProps){
const[feedback,setFeedback]=useState<"positive"|"negative"|null>(null);
const[isSubmitting,setIsSubmitting]=useState(false);

consthandleFeedback=async(rating:"positive"|"negative")=>{
if(feedback===rating||isSubmitting){
return;
}

setIsSubmitting(true);

try{
//Calltheparentcallback
onFeedback(resultId,rating);

//SubmittoAPI
constresponse=awaitfetch("/api/feedback",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({
resultId,
rating,
timestamp:newDate().toISOString(),
}),
});

if(!response.ok){
thrownewError("Failedtosubmitfeedback");
}

setFeedback(rating);
}catch(err){
console.error("Errorsubmittingfeedback:",err);
//StillsetthefeedbacklocallyevenifAPIfails
setFeedback(rating);
}finally{
setIsSubmitting(false);
}
};

return(
<divclassName="flexitems-centergap-2"role="group"aria-label="Resultfeedback">
<spanclassName="text-xstext-muted-foregroundmr-2"id={`feedback-label-${resultId}`}>
Wasthishelpful?
</span>

<Button
size="icon-sm"
variant="ghost"
onClick={()=>handleFeedback("positive")}
disabled={isSubmitting}
className={cn(
"transition-colors",
feedback==="positive"&&"text-green-600bg-green-50dark:bg-green-950/30hover:bg-green-100dark:hover:bg-green-950/50"
)}
aria-label="Markashelpful"
aria-pressed={feedback==="positive"}
aria-describedby={`feedback-label-${resultId}`}
>
<ThumbsUpclassName="size-4"aria-hidden="true"/>
</Button>

<Button
size="icon-sm"
variant="ghost"
onClick={()=>handleFeedback("negative")}
disabled={isSubmitting}
className={cn(
"transition-colors",
feedback==="negative"&&"text-red-600bg-red-50dark:bg-red-950/30hover:bg-red-100dark:hover:bg-red-950/50"
)}
aria-label="Markasnothelpful"
aria-pressed={feedback==="negative"}
aria-describedby={`feedback-label-${resultId}`}
>
<ThumbsDownclassName="size-4"aria-hidden="true"/>
</Button>

{feedback&&(
<spanclassName="text-xstext-muted-foregroundml-2"role="status"aria-live="polite">
Thanksforyourfeedback!
</span>
)}
</div>
);
}
