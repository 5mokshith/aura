"useclient";

import{useEffect,useCallback}from"react";

exportinterfaceKeyboardShortcut{
key:string;
ctrlKey?:boolean;
metaKey?:boolean;
shiftKey?:boolean;
altKey?:boolean;
description:string;
action:()=>void;
}

interfaceUseKeyboardShortcutsOptions{
shortcuts:KeyboardShortcut[];
enabled?:boolean;
}

exportfunctionuseKeyboardShortcuts({
shortcuts,
enabled=true,
}:UseKeyboardShortcutsOptions){
consthandleKeyDown=useCallback(
(event:KeyboardEvent)=>{
if(!enabled)return;

//Don'ttriggershortcutswhentypingininputfields(exceptforspecificcases)
consttarget=event.targetasHTMLElement;
constisInput=
target.tagName==="INPUT"||
target.tagName==="TEXTAREA"||
target.isContentEditable;

for(constshortcutofshortcuts){
constkeyMatches=event.key.toLowerCase()===shortcut.key.toLowerCase();
constctrlMatches=shortcut.ctrlKey?event.ctrlKey:!event.ctrlKey;
constmetaMatches=shortcut.metaKey?event.metaKey:!event.metaKey;
constshiftMatches=shortcut.shiftKey?event.shiftKey:!event.shiftKey;
constaltMatches=shortcut.altKey?event.altKey:!event.altKey;

//ForCtrl/Cmd+K,wewantittoworkevenininputfields
constisGlobalShortcut=shortcut.key.toLowerCase()==="k"&&(shortcut.ctrlKey||shortcut.metaKey);

if(
keyMatches&&
(ctrlMatches||metaMatches)&&
shiftMatches&&
altMatches&&
(!isInput||isGlobalShortcut)
){
event.preventDefault();
shortcut.action();
break;
}
}
},
[shortcuts,enabled]
);

useEffect(()=>{
if(!enabled)return;

window.addEventListener("keydown",handleKeyDown);
return()=>{
window.removeEventListener("keydown",handleKeyDown);
};
},[handleKeyDown,enabled]);
}

//Helpertoformatkeyboardshortcutdisplay
exportfunctionformatShortcut(shortcut:KeyboardShortcut):string{
constisMac=typeofnavigator!=="undefined"&&navigator.platform.includes("Mac");
constparts:string[]=[];

if(shortcut.ctrlKey||shortcut.metaKey){
parts.push(isMac?"⌘":"Ctrl");
}
if(shortcut.shiftKey){
parts.push(isMac?"⇧":"Shift");
}
if(shortcut.altKey){
parts.push(isMac?"⌥":"Alt");
}
parts.push(shortcut.key.toUpperCase());

returnparts.join(isMac?"":"+");
}
