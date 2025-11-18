"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***useState***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";
import***REMOVED***{***REMOVED***ThumbsUp,***REMOVED***ThumbsDown***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

interface***REMOVED***FeedbackWidgetProps***REMOVED***{
***REMOVED******REMOVED***resultId:***REMOVED***string;
***REMOVED******REMOVED***onFeedback:***REMOVED***(resultId:***REMOVED***string,***REMOVED***rating:***REMOVED***"positive"***REMOVED***|***REMOVED***"negative")***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***FeedbackWidget({***REMOVED***resultId,***REMOVED***onFeedback***REMOVED***}:***REMOVED***FeedbackWidgetProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[feedback,***REMOVED***setFeedback]***REMOVED***=***REMOVED***useState<"positive"***REMOVED***|***REMOVED***"negative"***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[isSubmitting,***REMOVED***setIsSubmitting]***REMOVED***=***REMOVED***useState(false);

***REMOVED******REMOVED***const***REMOVED***handleFeedback***REMOVED***=***REMOVED***async***REMOVED***(rating:***REMOVED***"positive"***REMOVED***|***REMOVED***"negative")***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(feedback***REMOVED***===***REMOVED***rating***REMOVED***||***REMOVED***isSubmitting)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***setIsSubmitting(true);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Call***REMOVED***the***REMOVED***parent***REMOVED***callback
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onFeedback(resultId,***REMOVED***rating);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Submit***REMOVED***to***REMOVED***API
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("/api/feedback",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***method:***REMOVED***"POST",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Content-Type":***REMOVED***"application/json",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***body:***REMOVED***JSON.stringify({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***resultId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rating,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***timestamp:***REMOVED***new***REMOVED***Date().toISOString(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!response.ok)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("Failed***REMOVED***to***REMOVED***submit***REMOVED***feedback");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setFeedback(rating);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***submitting***REMOVED***feedback:",***REMOVED***err);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Still***REMOVED***set***REMOVED***the***REMOVED***feedback***REMOVED***locally***REMOVED***even***REMOVED***if***REMOVED***API***REMOVED***fails
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setFeedback(rating);
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***finally***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsSubmitting(false);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-2"***REMOVED***role="group"***REMOVED***aria-label="Result***REMOVED***feedback">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span***REMOVED***className="text-xs***REMOVED***text-muted-foreground***REMOVED***mr-2"***REMOVED***id={`feedback-label-${resultId}`}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Was***REMOVED***this***REMOVED***helpful?
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***size="icon-sm"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant="ghost"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***handleFeedback("positive")}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***disabled={isSubmitting}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"transition-colors",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***feedback***REMOVED***===***REMOVED***"positive"***REMOVED***&&***REMOVED***"text-green-600***REMOVED***bg-green-50***REMOVED***dark:bg-green-950/30***REMOVED***hover:bg-green-100***REMOVED***dark:hover:bg-green-950/50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Mark***REMOVED***as***REMOVED***helpful"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-pressed={feedback***REMOVED***===***REMOVED***"positive"}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-describedby={`feedback-label-${resultId}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ThumbsUp***REMOVED***className="size-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***size="icon-sm"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant="ghost"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***handleFeedback("negative")}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***disabled={isSubmitting}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"transition-colors",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***feedback***REMOVED***===***REMOVED***"negative"***REMOVED***&&***REMOVED***"text-red-600***REMOVED***bg-red-50***REMOVED***dark:bg-red-950/30***REMOVED***hover:bg-red-100***REMOVED***dark:hover:bg-red-950/50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Mark***REMOVED***as***REMOVED***not***REMOVED***helpful"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-pressed={feedback***REMOVED***===***REMOVED***"negative"}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-describedby={`feedback-label-${resultId}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ThumbsDown***REMOVED***className="size-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{feedback***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span***REMOVED***className="text-xs***REMOVED***text-muted-foreground***REMOVED***ml-2"***REMOVED***role="status"***REMOVED***aria-live="polite">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Thanks***REMOVED***for***REMOVED***your***REMOVED***feedback!
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
