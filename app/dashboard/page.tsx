"use client";

import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CommandInputWithShortcuts } from "@/components/command";

export default function Dashboard() {
  const { user, isLoading, googleOAuthStatus } = useSupabaseAuth();
  const router = useRouter();
  const [ isExecuting, setIsExecuting ] = useState(false);
  const [ commandValue, setCommandValue ] = useState("");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [ user, isLoading, router ]);
},[user,isLoading,router]);

consthandleQuickActionSelect=(template:string)=>{
//Populatethecommandinputwiththeselectedtemplate
setCommandValue(template);

//Focusthecommandinput
setTimeout(()=>{
consttextarea=document.querySelector('textarea[name="command"]')asHTMLTextAreaElement;
if(textarea){
textarea.focus();
//Movecursortoend
textarea.setSelectionRange(textarea.value.length,textarea.value.length);
}
},100);
};

consthandleCommandSubmit=async(command:string)=>{
setIsExecuting(true);
try{
console.log("Executingcommand:",command);

constresponse=awaitfetch("/api/workflow/execute",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({command}),
});

constdata=awaitresponse.json();

if(!response.ok){
thrownewError(data.error||"Failedtoexecuteworkflow");
}

console.log("Workflowcreated:",data);

//Clearthecommandinput
setCommandValue("");

//TODO:Showsuccessmessageandredirecttoworkflowexecutionpage
alert(`Workflowcreatedsuccessfully!WorkflowID:${data.workflowId}`);
}catch(error){
console.error("Failedtoexecutecommand:",error);
alert(errorinstanceofError?error.message:"Failedtoexecutecommand");
}finally{
setIsExecuting(false);
}
};

if(isLoading){
return(
<divclassName="flexmin-h-screenitems-centerjustify-center">
<divclassName="text-center">
<divclassName="mb-4h-8w-8animate-spinrounded-fullborder-4border-gray-300border-t-blue-600mx-auto"></div>
<pclassName="text-gray-600">Loading...</p>
</div>
</div>
);
}

if(!user){
returnnull;//Willredirecttologin
}

return(
<DashboardLayoutonQuickActionSelect={handleQuickActionSelect}>
<divclassName="space-y-4sm:space-y-6">
{/*Header-Responsivetextsizing*/}
<div>
<h1className="text-2xlsm:text-3xlfont-boldtracking-tight">WelcometoAURA</h1>
<pclassName="text-muted-foregroundmt-1sm:mt-2text-smsm:text-base">
YourAI-poweredworkflowautomationassistant
</p>
</div>

{/*CommandInputSection-Responsivepadding*/}
<divclassName="rounded-lgborderbg-cardp-4sm:p-6">
<h2className="text-lgsm:text-xlfont-semiboldmb-3sm:mb-4">Whatwouldyouliketodo?</h2>
<CommandInputWithShortcuts
onSubmit={handleCommandSubmit}
disabled={isExecuting}
placeholder="Describewhatyou'dlikeAURAtodo...(e.g.,'Summarizemyunreademailsfromtoday')"
value={commandValue}
onChange={setCommandValue}
/>
</div>

{/*AccountInformation-Responsivelayout*/}
<divclassName="rounded-lgborderbg-cardp-4sm:p-6">
<h2className="text-lgsm:text-xlfont-semiboldmb-3sm:mb-4">AccountInformation</h2>
<divclassName="space-y-2sm:space-y-3">
<divclassName="flexflex-colsm:flex-rowsm:items-centersm:justify-betweenpy-2border-bgap-1sm:gap-0">
<spanclassName="text-smfont-medium">UserID</span>
<spanclassName="text-smtext-muted-foregroundbreak-all">{user.id}</span>
</div>
<divclassName="flexflex-colsm:flex-rowsm:items-centersm:justify-betweenpy-2border-bgap-1sm:gap-0">
<spanclassName="text-smfont-medium">Email</span>
<spanclassName="text-smtext-muted-foregroundbreak-all">{user.email}</span>
</div>
<divclassName="flexflex-colsm:flex-rowsm:items-centersm:justify-betweenpy-2border-bgap-1sm:gap-0">
<spanclassName="text-smfont-medium">OAuthStatus</span>
<spanclassName="text-smtext-muted-foreground">
{googleOAuthStatus.isConnected?"Connected":"Disconnected"}
</span>
</div>
{googleOAuthStatus.expiresAt&&(
<divclassName="flexflex-colsm:flex-rowsm:items-centersm:justify-betweenpy-2border-bgap-1sm:gap-0">
<spanclassName="text-smfont-medium">TokenExpires</span>
<spanclassName="text-smtext-muted-foreground">
{newDate(googleOAuthStatus.expiresAt).toLocaleString()}
</span>
</div>
)}
</div>
</div>

{/*GrantedScopes-Responsivelayout*/}
<divclassName="rounded-lgborderbg-cardp-4sm:p-6">
<h3className="text-basesm:text-lgfont-semiboldmb-2sm:mb-3">GrantedScopes</h3>
<ulclassName="space-y-1.5sm:space-y-2">
{googleOAuthStatus.scopes.map((scope)=>(
<li
key={scope}
className="text-xssm:text-smtext-muted-foregroundflexitems-centergap-2"
>
<divclassName="h-1.5w-1.5rounded-fullbg-primaryshrink-0"/>
<spanclassName="break-all">{scope}</span>
</li>
))}
</ul>
</div>
</div>
</DashboardLayout>
);
}
