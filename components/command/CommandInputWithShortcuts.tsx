"useclient";

import{useState,useRef,useEffect}from"react";
import{CommandInput}from"./CommandInput";
import{PromptTemplates}from"./PromptTemplates";
import{KeyboardShortcutsModal}from"./KeyboardShortcutsModal";
import{useKeyboardShortcuts}from"@/hooks/useKeyboardShortcuts";
import{HelpCircle}from"lucide-react";
import{Button}from"@/components/ui/button";

interfaceCommandInputWithShortcutsProps{
onSubmit:(command:string)=>Promise<void>;
disabled?:boolean;
placeholder?:string;
value?:string;
onChange?:(value:string)=>void;
}

exportfunctionCommandInputWithShortcuts({
onSubmit,
disabled=false,
placeholder,
value:externalValue,
onChange:externalOnChange,
}:CommandInputWithShortcutsProps){
const[internalValue,setInternalValue]=useState("");
const[showShortcutsModal,setShowShortcutsModal]=useState(false);
constinputRef=useRef<HTMLTextAreaElement|null>(null);

//Useexternalvalueifprovided,otherwiseuseinternalstate
constvalue=externalValue!==undefined?externalValue:internalValue;
constsetValue=externalOnChange||setInternalValue;

//Focusthecommandinput
constfocusInput=()=>{
consttextarea=document.querySelector('textarea[name="command"]')asHTMLTextAreaElement;
if(textarea){
textarea.focus();
//Movecursortoend
textarea.setSelectionRange(textarea.value.length,textarea.value.length);
}
};

//Setupkeyboardshortcuts
useKeyboardShortcuts({
shortcuts:[
{
key:"k",
ctrlKey:true,
metaKey:true,
description:"Focuscommandinput",
action:focusInput,
},
{
key:"?",
description:"Showkeyboardshortcuts",
action:()=>setShowShortcutsModal(true),
},
{
key:"Escape",
description:"Closemodals",
action:()=>setShowShortcutsModal(false),
},
],
enabled:true,
});

consthandleTemplateSelect=(template:string)=>{
setValue(template);
//Focusinputaftertemplateselection
setTimeout(focusInput,100);
};

consthandleSubmit=async(command:string)=>{
awaitonSubmit(command);
setValue("");//Clearaftersubmission
};

return(
<divclassName="space-y-4">
<divclassName="flexitems-startgap-2">
<divclassName="flex-1">
<CommandInput
onSubmit={handleSubmit}
disabled={disabled}
placeholder={placeholder}
value={value}
onChange={setValue}
/>
</div>
</div>

<divclassName="flexitems-centerjustify-between">
<PromptTemplatesonSelect={handleTemplateSelect}disabled={disabled}/>

<Button
variant="ghost"
size="sm"
onClick={()=>setShowShortcutsModal(true)}
className="gap-2text-muted-foreground"
aria-label="Showkeyboardshortcuts"
>
<HelpCircleclassName="size-4"/>
Shortcuts
</Button>
</div>

<KeyboardShortcutsModal
open={showShortcutsModal}
onOpenChange={setShowShortcutsModal}
/>
</div>
);
}
