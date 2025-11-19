"useclient";

import{useState}from"react";
import{
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
}from"@/components/ui/dialog";
import{Button}from"@/components/ui/button";
importtype{QuickAction,QuickActionParameter}from"@/types";

interfaceQuickActionParameterModalProps{
action:QuickAction|null;
open:boolean;
onClose:()=>void;
onSubmit:(filledTemplate:string)=>void;
}

exportfunctionQuickActionParameterModal({
action,
open,
onClose,
onSubmit,
}:QuickActionParameterModalProps){
const[parameterValues,setParameterValues]=useState<Record<string,string>>({});

if(!action||!action.parameters){
returnnull;
}

consthandleParameterChange=(paramName:string,value:string)=>{
setParameterValues((prev)=>({
...prev,
[paramName]:value,
}));
};

consthandleSubmit=()=>{
//Filltemplatewithparametervalues
letfilledTemplate=action.template;

action.parameters?.forEach((param)=>{
constvalue=parameterValues[param.name]||param.defaultValue||"";
filledTemplate=filledTemplate.replace(`{${param.name}}`,value);
});

onSubmit(filledTemplate);

//Resetandclose
setParameterValues({});
onClose();
};

consthandleCancel=()=>{
setParameterValues({});
onClose();
};

constisValid=action.parameters.every((param)=>{
if(!param.required)returntrue;
constvalue=parameterValues[param.name]||param.defaultValue;
returnvalue&&value.trim().length>0;
});

return(
<Dialogopen={open}onOpenChange={(isOpen)=>!isOpen&&handleCancel()}>
<DialogContentaria-describedby="parameter-modal-description">
<DialogHeader>
<DialogTitle>{action.title}</DialogTitle>
<DialogDescriptionid="parameter-modal-description">{action.description}</DialogDescription>
</DialogHeader>

<divclassName="space-y-4py-4">
{action.parameters.map((param)=>(
<divkey={param.name}className="space-y-2">
<label
htmlFor={param.name}
className="text-smfont-mediumleading-nonepeer-disabled:cursor-not-allowedpeer-disabled:opacity-70"
>
{param.label}
{param.required&&<spanclassName="text-red-500ml-1">*</span>}
</label>
<input
id={param.name}
name={param.name}
type={param.type}
placeholder={param.placeholder}
defaultValue={param.defaultValue}
value={parameterValues[param.name]??param.defaultValue??""}
onChange={(e)=>handleParameterChange(param.name,e.target.value)}
className="flexh-10w-fullrounded-mdborderborder-inputbg-backgroundpx-3py-2text-smring-offset-backgroundfile:border-0file:bg-transparentfile:text-smfile:font-mediumplaceholder:text-muted-foregroundfocus-visible:outline-nonefocus-visible:ring-2focus-visible:ring-ringfocus-visible:ring-offset-2disabled:cursor-not-alloweddisabled:opacity-50"
required={param.required}
/>
</div>
))}
</div>

<DialogFooter>
<Buttonvariant="outline"onClick={handleCancel}>
Cancel
</Button>
<ButtononClick={handleSubmit}disabled={!isValid}>
UseAction
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
);
}
