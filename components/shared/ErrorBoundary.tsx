"useclient";

import{Component,ReactNode}from"react";
import{Button}from"@/components/ui/button";
import{Card}from"@/components/ui/card";
import{AlertCircle,RefreshCw,Send}from"lucide-react";

interfaceErrorBoundaryProps{
children:ReactNode;
fallback?:(error:Error,errorInfo:string,onReset:()=>void)=>ReactNode;
}

interfaceErrorBoundaryState{
hasError:boolean;
error:Error|null;
errorInfo:string|null;
}

exportclassErrorBoundaryextendsComponent<ErrorBoundaryProps,ErrorBoundaryState>{
constructor(props:ErrorBoundaryProps){
super(props);
this.state={
hasError:false,
error:null,
errorInfo:null,
};
}

staticgetDerivedStateFromError(error:Error):Partial<ErrorBoundaryState>{
return{
hasError:true,
error,
};
}

componentDidCatch(error:Error,errorInfo:React.ErrorInfo){
//Logerrortoconsolefordebugging
console.error("ErrorBoundarycaughtanerror:",error);
console.error("Errorinfo:",errorInfo);
console.error("Componentstack:",errorInfo.componentStack);

this.setState({
errorInfo:errorInfo.componentStack||"Nostacktraceavailable",
});

//Inproduction,youwouldsendthistoanerrorreportingservice
//Example:logErrorToService(error,errorInfo);
}

handleReset=()=>{
this.setState({
hasError:false,
error:null,
errorInfo:null,
});
};

handleReport=()=>{
const{error,errorInfo}=this.state;

//Createerrorreport
constreport={
message:error?.message||"Unknownerror",
stack:error?.stack||"Nostacktrace",
componentStack:errorInfo||"Nocomponentstack",
timestamp:newDate().toISOString(),
userAgent:navigator.userAgent,
url:window.location.href,
};

//Logtoconsolefordebugging
console.log("ErrorReport:",report);

//Inproduction,sendtoerrorreportingservice
//Example:sendErrorReport(report);

//Showuserfeedback
alert("Errorreporthasbeenlogged.Thankyouforhelpingusimprove!");
};

render(){
if(this.state.hasError){
//Usecustomfallbackifprovided
if(this.props.fallback){
returnthis.props.fallback(
this.state.error!,
this.state.errorInfo||"",
this.handleReset
);
}

//DefaulterrorUI
return(
<divclassName="min-h-screenflexitems-centerjustify-centerp-4bg-background">
<CardclassName="max-w-2xlw-fullp-6space-y-6">
<divclassName="flexitems-startgap-4">
<divclassName="flex-shrink-0">
<AlertCircleclassName="size-8text-destructive"aria-hidden="true"/>
</div>
<divclassName="flex-1space-y-2">
<h1className="text-2xlfont-semiboldtext-foreground">
Somethingwentwrong
</h1>
<pclassName="text-muted-foreground">
Weencounteredanunexpectederror.Thishasbeenloggedandwe'lllookintoit.
</p>
</div>
</div>

{/*Errordetails(collapsedbydefaultinproduction)*/}
{process.env.NODE_ENV==="development"&&this.state.error&&(
<detailsclassName="space-y-2">
<summaryclassName="cursor-pointertext-smfont-mediumtext-muted-foregroundhover:text-foreground">
ErrorDetails(DevelopmentOnly)
</summary>
<divclassName="mt-2p-4bg-mutedrounded-md">
<pclassName="text-smfont-monotext-destructivebreak-all">
{this.state.error.message}
</p>
{this.state.error.stack&&(
<preclassName="mt-2text-xsfont-monotext-muted-foregroundoverflow-automax-h-40">
{this.state.error.stack}
</pre>
)}
</div>
</details>
)}

{/*Actionbuttons*/}
<divclassName="flexflex-colsm:flex-rowgap-3">
<Button
onClick={this.handleReset}
className="flex-1"
aria-label="Retryloadingtheapplication"
>
<RefreshCwclassName="size-4"aria-hidden="true"/>
Retry
</Button>
<Button
onClick={this.handleReport}
variant="outline"
className="flex-1"
aria-label="Reportthiserror"
>
<SendclassName="size-4"aria-hidden="true"/>
ReportError
</Button>
</div>

{/*Additionalhelp*/}
<divclassName="pt-4border-t">
<pclassName="text-smtext-muted-foreground">
Ifthisproblempersists,tryrefreshingthepageor{""}
<a
href="/"
className="text-primaryhover:underlinefocus:outline-nonefocus:ring-2focus:ring-ringfocus:ring-offset-2rounded"
>
returntothehomepage
</a>
.
</p>
</div>
</Card>
</div>
);
}

returnthis.props.children;
}
}
