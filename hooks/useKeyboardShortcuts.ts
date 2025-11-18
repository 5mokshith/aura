"use***REMOVED***client";

import***REMOVED***{***REMOVED***useEffect,***REMOVED***useCallback***REMOVED***}***REMOVED***from***REMOVED***"react";

export***REMOVED***interface***REMOVED***KeyboardShortcut***REMOVED***{
***REMOVED******REMOVED***key:***REMOVED***string;
***REMOVED******REMOVED***ctrlKey?:***REMOVED***boolean;
***REMOVED******REMOVED***metaKey?:***REMOVED***boolean;
***REMOVED******REMOVED***shiftKey?:***REMOVED***boolean;
***REMOVED******REMOVED***altKey?:***REMOVED***boolean;
***REMOVED******REMOVED***description:***REMOVED***string;
***REMOVED******REMOVED***action:***REMOVED***()***REMOVED***=>***REMOVED***void;
}

interface***REMOVED***UseKeyboardShortcutsOptions***REMOVED***{
***REMOVED******REMOVED***shortcuts:***REMOVED***KeyboardShortcut[];
***REMOVED******REMOVED***enabled?:***REMOVED***boolean;
}

export***REMOVED***function***REMOVED***useKeyboardShortcuts({
***REMOVED******REMOVED***shortcuts,
***REMOVED******REMOVED***enabled***REMOVED***=***REMOVED***true,
}:***REMOVED***UseKeyboardShortcutsOptions)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***handleKeyDown***REMOVED***=***REMOVED***useCallback(
***REMOVED******REMOVED******REMOVED******REMOVED***(event:***REMOVED***KeyboardEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!enabled)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Don't***REMOVED***trigger***REMOVED***shortcuts***REMOVED***when***REMOVED***typing***REMOVED***in***REMOVED***input***REMOVED***fields***REMOVED***(except***REMOVED***for***REMOVED***specific***REMOVED***cases)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***target***REMOVED***=***REMOVED***event.target***REMOVED***as***REMOVED***HTMLElement;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***isInput***REMOVED***=
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***target.tagName***REMOVED***===***REMOVED***"INPUT"***REMOVED***||
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***target.tagName***REMOVED***===***REMOVED***"TEXTAREA"***REMOVED***||
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***target.isContentEditable;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***for***REMOVED***(const***REMOVED***shortcut***REMOVED***of***REMOVED***shortcuts)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***keyMatches***REMOVED***=***REMOVED***event.key.toLowerCase()***REMOVED***===***REMOVED***shortcut.key.toLowerCase();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***ctrlMatches***REMOVED***=***REMOVED***shortcut.ctrlKey***REMOVED***?***REMOVED***event.ctrlKey***REMOVED***:***REMOVED***!event.ctrlKey;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***metaMatches***REMOVED***=***REMOVED***shortcut.metaKey***REMOVED***?***REMOVED***event.metaKey***REMOVED***:***REMOVED***!event.metaKey;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***shiftMatches***REMOVED***=***REMOVED***shortcut.shiftKey***REMOVED***?***REMOVED***event.shiftKey***REMOVED***:***REMOVED***!event.shiftKey;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***altMatches***REMOVED***=***REMOVED***shortcut.altKey***REMOVED***?***REMOVED***event.altKey***REMOVED***:***REMOVED***!event.altKey;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***For***REMOVED***Ctrl/Cmd+K,***REMOVED***we***REMOVED***want***REMOVED***it***REMOVED***to***REMOVED***work***REMOVED***even***REMOVED***in***REMOVED***input***REMOVED***fields
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***isGlobalShortcut***REMOVED***=***REMOVED***shortcut.key.toLowerCase()***REMOVED***===***REMOVED***"k"***REMOVED***&&***REMOVED***(shortcut.ctrlKey***REMOVED***||***REMOVED***shortcut.metaKey);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***keyMatches***REMOVED***&&
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(ctrlMatches***REMOVED***||***REMOVED***metaMatches)***REMOVED***&&
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***shiftMatches***REMOVED***&&
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***altMatches***REMOVED***&&
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(!isInput***REMOVED***||***REMOVED***isGlobalShortcut)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***event.preventDefault();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***shortcut.action();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***[shortcuts,***REMOVED***enabled]
***REMOVED******REMOVED***);

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!enabled)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***window.addEventListener("keydown",***REMOVED***handleKeyDown);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***window.removeEventListener("keydown",***REMOVED***handleKeyDown);
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[handleKeyDown,***REMOVED***enabled]);
}

//***REMOVED***Helper***REMOVED***to***REMOVED***format***REMOVED***keyboard***REMOVED***shortcut***REMOVED***display
export***REMOVED***function***REMOVED***formatShortcut(shortcut:***REMOVED***KeyboardShortcut):***REMOVED***string***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***isMac***REMOVED***=***REMOVED***typeof***REMOVED***navigator***REMOVED***!==***REMOVED***"undefined"***REMOVED***&&***REMOVED***navigator.platform.includes("Mac");
***REMOVED******REMOVED***const***REMOVED***parts:***REMOVED***string[]***REMOVED***=***REMOVED***[];

***REMOVED******REMOVED***if***REMOVED***(shortcut.ctrlKey***REMOVED***||***REMOVED***shortcut.metaKey)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***parts.push(isMac***REMOVED***?***REMOVED***"⌘"***REMOVED***:***REMOVED***"Ctrl");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***if***REMOVED***(shortcut.shiftKey)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***parts.push(isMac***REMOVED***?***REMOVED***"⇧"***REMOVED***:***REMOVED***"Shift");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***if***REMOVED***(shortcut.altKey)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***parts.push(isMac***REMOVED***?***REMOVED***"⌥"***REMOVED***:***REMOVED***"Alt");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***parts.push(shortcut.key.toUpperCase());

***REMOVED******REMOVED***return***REMOVED***parts.join(isMac***REMOVED***?***REMOVED***""***REMOVED***:***REMOVED***"+");
}
