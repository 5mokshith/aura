/**
***REMOVED*******REMOVED***Agent***REMOVED***system***REMOVED***exports***REMOVED***and***REMOVED***initialization
***REMOVED****/

export***REMOVED*******REMOVED***from***REMOVED***"./base";
export***REMOVED*******REMOVED***from***REMOVED***"./registry";
export***REMOVED***{***REMOVED***EmailAgent***REMOVED***}***REMOVED***from***REMOVED***"./EmailAgent";
export***REMOVED***{***REMOVED***DriveAgent***REMOVED***}***REMOVED***from***REMOVED***"./DriveAgent";
export***REMOVED***{***REMOVED***DocsAgent***REMOVED***}***REMOVED***from***REMOVED***"./DocsAgent";
export***REMOVED***{***REMOVED***SheetsAgent***REMOVED***}***REMOVED***from***REMOVED***"./SheetsAgent";
export***REMOVED***{***REMOVED***CalendarAgent***REMOVED***}***REMOVED***from***REMOVED***"./CalendarAgent";

//***REMOVED***Initialize***REMOVED***agents
import***REMOVED***{***REMOVED***EmailAgent***REMOVED***}***REMOVED***from***REMOVED***"./EmailAgent";
import***REMOVED***{***REMOVED***DriveAgent***REMOVED***}***REMOVED***from***REMOVED***"./DriveAgent";
import***REMOVED***{***REMOVED***DocsAgent***REMOVED***}***REMOVED***from***REMOVED***"./DocsAgent";
import***REMOVED***{***REMOVED***SheetsAgent***REMOVED***}***REMOVED***from***REMOVED***"./SheetsAgent";
import***REMOVED***{***REMOVED***CalendarAgent***REMOVED***}***REMOVED***from***REMOVED***"./CalendarAgent";
import***REMOVED***{***REMOVED***registerAgent***REMOVED***}***REMOVED***from***REMOVED***"./registry";

//***REMOVED***Register***REMOVED***all***REMOVED***agents***REMOVED***on***REMOVED***module***REMOVED***load
registerAgent(new***REMOVED***EmailAgent());
registerAgent(new***REMOVED***DriveAgent());
registerAgent(new***REMOVED***DocsAgent());
registerAgent(new***REMOVED***SheetsAgent());
registerAgent(new***REMOVED***CalendarAgent());
