/**
*Agentsystemexportsandinitialization
*/

export*from"./base";
export*from"./registry";
export{EmailAgent}from"./EmailAgent";
export{DriveAgent}from"./DriveAgent";
export{DocsAgent}from"./DocsAgent";
export{SheetsAgent}from"./SheetsAgent";
export{CalendarAgent}from"./CalendarAgent";

//Initializeagents
import{EmailAgent}from"./EmailAgent";
import{DriveAgent}from"./DriveAgent";
import{DocsAgent}from"./DocsAgent";
import{SheetsAgent}from"./SheetsAgent";
import{CalendarAgent}from"./CalendarAgent";
import{registerAgent}from"./registry";

//Registerallagentsonmoduleload
registerAgent(newEmailAgent());
registerAgent(newDriveAgent());
registerAgent(newDocsAgent());
registerAgent(newSheetsAgent());
registerAgent(newCalendarAgent());
