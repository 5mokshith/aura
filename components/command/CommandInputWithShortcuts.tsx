"use***REMOVED***client";

import***REMOVED***{***REMOVED***useState,***REMOVED***useRef,***REMOVED***useEffect***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***CommandInput***REMOVED***}***REMOVED***from***REMOVED***"./CommandInput";
import***REMOVED***{***REMOVED***PromptTemplates***REMOVED***}***REMOVED***from***REMOVED***"./PromptTemplates";
import***REMOVED***{***REMOVED***KeyboardShortcutsModal***REMOVED***}***REMOVED***from***REMOVED***"./KeyboardShortcutsModal";
import***REMOVED***{***REMOVED***useKeyboardShortcuts***REMOVED***}***REMOVED***from***REMOVED***"@/hooks/useKeyboardShortcuts";
import***REMOVED***{***REMOVED***HelpCircle***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***Button***REMOVED***}***REMOVED***from***REMOVED***"@/components/ui/button";

interface***REMOVED***CommandInputWithShortcutsProps***REMOVED***{
***REMOVED******REMOVED***onSubmit:***REMOVED***(command:***REMOVED***string)***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***disabled?:***REMOVED***boolean;
***REMOVED******REMOVED***placeholder?:***REMOVED***string;
***REMOVED******REMOVED***value?:***REMOVED***string;
***REMOVED******REMOVED***onChange?:***REMOVED***(value:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***CommandInputWithShortcuts({
***REMOVED******REMOVED***onSubmit,
***REMOVED******REMOVED***disabled***REMOVED***=***REMOVED***false,
***REMOVED******REMOVED***placeholder,
***REMOVED******REMOVED***value:***REMOVED***externalValue,
***REMOVED******REMOVED***onChange:***REMOVED***externalOnChange,
}:***REMOVED***CommandInputWithShortcutsProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[internalValue,***REMOVED***setInternalValue]***REMOVED***=***REMOVED***useState("");
***REMOVED******REMOVED***const***REMOVED***[showShortcutsModal,***REMOVED***setShowShortcutsModal]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***inputRef***REMOVED***=***REMOVED***useRef<HTMLTextAreaElement***REMOVED***|***REMOVED***null>(null);

***REMOVED******REMOVED***//***REMOVED***Use***REMOVED***external***REMOVED***value***REMOVED***if***REMOVED***provided,***REMOVED***otherwise***REMOVED***use***REMOVED***internal***REMOVED***state
***REMOVED******REMOVED***const***REMOVED***value***REMOVED***=***REMOVED***externalValue***REMOVED***!==***REMOVED***undefined***REMOVED***?***REMOVED***externalValue***REMOVED***:***REMOVED***internalValue;
***REMOVED******REMOVED***const***REMOVED***setValue***REMOVED***=***REMOVED***externalOnChange***REMOVED***||***REMOVED***setInternalValue;

***REMOVED******REMOVED***//***REMOVED***Focus***REMOVED***the***REMOVED***command***REMOVED***input
***REMOVED******REMOVED***const***REMOVED***focusInput***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***textarea***REMOVED***=***REMOVED***document.querySelector('textarea[name="command"]')***REMOVED***as***REMOVED***HTMLTextAreaElement;
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(textarea)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***textarea.focus();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Move***REMOVED***cursor***REMOVED***to***REMOVED***end
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***textarea.setSelectionRange(textarea.value.length,***REMOVED***textarea.value.length);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***//***REMOVED***Set***REMOVED***up***REMOVED***keyboard***REMOVED***shortcuts
***REMOVED******REMOVED***useKeyboardShortcuts({
***REMOVED******REMOVED******REMOVED******REMOVED***shortcuts:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"k",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ctrlKey:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***metaKey:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***description:***REMOVED***"Focus***REMOVED***command***REMOVED***input",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***focusInput,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"?",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***description:***REMOVED***"Show***REMOVED***keyboard***REMOVED***shortcuts",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***()***REMOVED***=>***REMOVED***setShowShortcutsModal(true),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key:***REMOVED***"Escape",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***description:***REMOVED***"Close***REMOVED***modals",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***action:***REMOVED***()***REMOVED***=>***REMOVED***setShowShortcutsModal(false),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***],
***REMOVED******REMOVED******REMOVED******REMOVED***enabled:***REMOVED***true,
***REMOVED******REMOVED***});

***REMOVED******REMOVED***const***REMOVED***handleTemplateSelect***REMOVED***=***REMOVED***(template:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setValue(template);
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Focus***REMOVED***input***REMOVED***after***REMOVED***template***REMOVED***selection
***REMOVED******REMOVED******REMOVED******REMOVED***setTimeout(focusInput,***REMOVED***100);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleSubmit***REMOVED***=***REMOVED***async***REMOVED***(command:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***onSubmit(command);
***REMOVED******REMOVED******REMOVED******REMOVED***setValue("");***REMOVED***//***REMOVED***Clear***REMOVED***after***REMOVED***submission
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="space-y-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-start***REMOVED***gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<CommandInput
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onSubmit={handleSubmit}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***disabled={disabled}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder={placeholder}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={value}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={setValue}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***justify-between">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<PromptTemplates***REMOVED***onSelect={handleTemplateSelect}***REMOVED***disabled={disabled}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant="ghost"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***size="sm"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***setShowShortcutsModal(true)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="gap-2***REMOVED***text-muted-foreground"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Show***REMOVED***keyboard***REMOVED***shortcuts"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HelpCircle***REMOVED***className="size-4"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Shortcuts
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</Button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<KeyboardShortcutsModal
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***open={showShortcutsModal}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onOpenChange={setShowShortcutsModal}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
