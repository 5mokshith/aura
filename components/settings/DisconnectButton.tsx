"useclient";

import{useState}from"react";
import{useSupabaseAuth}from"@/contexts/SupabaseAuthContext";
import{useRouter}from"next/navigation";
import{Button}from"@/components/ui/button";
import{
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
}from"@/components/ui/dialog";
import{AlertTriangle,LogOut}from"lucide-react";

exportfunctionDisconnectButton(){
const{googleOAuthStatus,signOut}=useSupabaseAuth();
constrouter=useRouter();
const[showConfirmDialog,setShowConfirmDialog]=useState(false);
const[isDisconnecting,setIsDisconnecting]=useState(false);
const[error,setError]=useState<string|null>(null);

consthandleDisconnect=async()=>{
setIsDisconnecting(true);
setError(null);

try{
awaitsignOut();

//Closethedialog
setShowConfirmDialog(false);

//Redirecttologinpageaftersuccessfuldisconnect
router.push("/login");
}catch(err){
console.error("Failedtodisconnect:",err);
setError(errinstanceofError?err.message:"Failedtodisconnect");
}finally{
setIsDisconnecting(false);
}
};

if(!googleOAuthStatus.isConnected){
returnnull;
}

return(
<>
<divclassName="space-y-4">
<divclassName="space-y-1">
<h3className="text-smfont-medium">DisconnectAccount</h3>
<pclassName="text-smtext-muted-foreground">
RemoveAURA'saccesstoyourGoogleaccount
</p>
</div>

<divclassName="flexitems-startgap-3rounded-lgborderborder-destructive/50bg-destructive/10p-4">
<AlertTriangleclassName="h-5w-5text-destructiveflex-shrink-0mt-0.5"/>
<divclassName="space-y-2flex-1">
<pclassName="text-smfont-medium">Warning</p>
<pclassName="text-smtext-muted-foreground">
Disconnectingwillrevokeallpermissionsandyouwillneedtoreconnect
touseAURA'sfeatures.Anyongoingworkflowswillbecancelled.
</p>
</div>
</div>

<Button
variant="destructive"
onClick={()=>setShowConfirmDialog(true)}
className="w-fullsm:w-auto"
>
<LogOutclassName="h-4w-4"/>
DisconnectGoogleAccount
</Button>
</div>

<Dialogopen={showConfirmDialog}onOpenChange={setShowConfirmDialog}>
<DialogContent>
<DialogHeader>
<DialogTitle>DisconnectGoogleAccount?</DialogTitle>
<DialogDescription>
AreyousureyouwanttodisconnectyourGoogleaccount?Thisactionwill:
</DialogDescription>
</DialogHeader>

<divclassName="space-y-2py-4">
<ulclassName="space-y-2text-smtext-muted-foreground">
<liclassName="flexitems-startgap-2">
<spanclassName="text-destructivemt-0.5">•</span>
<span>RevokeallOAuthpermissions</span>
</li>
<liclassName="flexitems-startgap-2">
<spanclassName="text-destructivemt-0.5">•</span>
<span>Cancelanyongoingworkflows</span>
</li>
<liclassName="flexitems-startgap-2">
<spanclassName="text-destructivemt-0.5">•</span>
<span>RequireyoutoreconnecttouseAURAagain</span>
</li>
<liclassName="flexitems-startgap-2">
<spanclassName="text-destructivemt-0.5">•</span>
<span>Clearyourlocalauthenticationstate</span>
</li>
</ul>
</div>

{error&&(
<divclassName="rounded-lgborderborder-destructivebg-destructive/10p-3">
<pclassName="text-smtext-destructive">{error}</p>
</div>
)}

<DialogFooter>
<Button
variant="outline"
onClick={()=>setShowConfirmDialog(false)}
disabled={isDisconnecting}
>
Cancel
</Button>
<Button
variant="destructive"
onClick={handleDisconnect}
disabled={isDisconnecting}
>
{isDisconnecting?(
<>
<divclassName="h-4w-4animate-spinrounded-fullborder-2border-currentborder-t-transparent"/>
Disconnecting...
</>
):(
<>
<LogOutclassName="h-4w-4"/>
Disconnect
</>
)}
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</>
);
}
