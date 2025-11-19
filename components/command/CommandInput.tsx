"useclient";

import{useState,useRef,useEffect,KeyboardEvent}from"react";
import{Button}from"@/components/ui/button";
import{Loader2,Send}from"lucide-react";
import{cn}from"@/lib/utils";

interfaceCommandInputProps{
onSubmit:(command:string)=>Promise<void>;
disabled?:boolean;
placeholder?:string;
value?:string;
onChange?:(value:string)=>void;
}

constMIN_CHARS=10;
constMIN_ROWS=3;
constMAX_ROWS=10;

exportfunctionCommandInput({
onSubmit,
disabled=false,
placeholder="Describewhatyou'dlikeAURAtodo...",
value:controlledValue,
onChange:controlledOnChange,
}:CommandInputProps){
const[internalValue,setInternalValue]=useState("");
const[isSubmitting,setIsSubmitting]=useState(false);
const[rows,setRows]=useState(MIN_ROWS);
consttextareaRef=useRef<HTMLTextAreaElement>(null);

//Usecontrolledvalueifprovided,otherwiseuseinternalstate
constvalue=controlledValue!==undefined?controlledValue:internalValue;
constsetValue=controlledOnChange||setInternalValue;

constcharCount=value.length;
constisValid=charCount>=MIN_CHARS;
constisDisabled=disabled||isSubmitting;

//Auto-resizetextareabasedoncontent
useEffect(()=>{
if(textareaRef.current){
//Resetheighttocalculatenewheight
textareaRef.current.style.height="auto";

constlineHeight=24;//Approximatelineheightinpixels
constscrollHeight=textareaRef.current.scrollHeight;
constcalculatedRows=Math.min(
MAX_ROWS,
Math.max(MIN_ROWS,Math.ceil(scrollHeight/lineHeight))
);

setRows(calculatedRows);
}
},[value]);

consthandleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
setValue(e.target.value);
};

consthandleSubmit=async()=>{
if(!isValid||isDisabled)return;

setIsSubmitting(true);
try{
awaitonSubmit(value);
//Clearinputaftersuccessfulsubmission
setValue("");
setRows(MIN_ROWS);
}catch(error){
console.error("Failedtosubmitcommand:",error);
}finally{
setIsSubmitting(false);
}
};

consthandleKeyDown=(e:KeyboardEvent<HTMLTextAreaElement>)=>{
//SubmitonEnter(withoutShiftfornewline)
if(e.key==="Enter"&&!e.shiftKey){
e.preventDefault();
handleSubmit();
}
};

return(
<divclassName="w-fullspace-y-2">
<divclassName="relative">
<textarea
ref={textareaRef}
name="command"
value={value}
onChange={handleChange}
onKeyDown={handleKeyDown}
disabled={isDisabled}
placeholder={placeholder}
rows={rows}
className={cn(
"w-fullresize-nonerounded-lgborderbg-backgroundpx-3py-2.5sm:px-4sm:py-3text-sm",
"focus:outline-nonefocus:ring-2focus:ring-ringfocus:border-transparent",
"disabled:cursor-not-alloweddisabled:opacity-50",
"placeholder:text-muted-foreground",
"transition-allduration-200",
"min-h-[44px]"//Ensureminimumtouchtarget
)}
aria-label="Commandinput"
aria-describedby="char-count"
aria-invalid={charCount>0&&!isValid}
/>
</div>

<divclassName="flexflex-colxs:flex-rowxs:items-centerxs:justify-betweengap-2xs:gap-4">
<div
id="char-count"
className={cn(
"text-2xsxs:text-xstransition-colors",
charCount===0
?"text-muted-foreground"
:isValid
?"text-green-600dark:text-green-500"
:"text-amber-600dark:text-amber-500"
)}
>
{charCount}/{MIN_CHARS}characters
{charCount>0&&!isValid&&(
<spanclassName="ml-1">
({MIN_CHARS-charCount}moreneeded)
</span>
)}
</div>

<Button
onClick={handleSubmit}
disabled={!isValid||isDisabled}
size="default"
className="min-w-[100px]w-fullxs:w-auto"
aria-label="Submitcommand"
>
{isSubmitting?(
<>
<Loader2className="animate-spin"/>
<spanclassName="ml-2">Sending...</span>
</>
):(
<>
<Send/>
<spanclassName="ml-2">Submit</span>
</>
)}
</Button>
</div>

<divclassName="text-2xsxs:text-xstext-muted-foreground">
Press{""}
<kbdclassName="px-1xs:px-1.5py-0.5roundedbg-mutedbordertext-[10px]font-mono">
Enter
</kbd>{""}
tosubmit,or{""}
<kbdclassName="px-1xs:px-1.5py-0.5roundedbg-mutedbordertext-[10px]font-mono">
Shift
</kbd>{""}
+{""}
<kbdclassName="px-1xs:px-1.5py-0.5roundedbg-mutedbordertext-[10px]font-mono">
Enter
</kbd>{""}
fornewline
</div>
</div>
);
}
