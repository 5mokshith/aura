import***REMOVED***{***REMOVED***google***REMOVED***}***REMOVED***from***REMOVED***"googleapis";
import***REMOVED***{***REMOVED***Agent,***REMOVED***ExecutionContext,***REMOVED***ExecutionResult***REMOVED***}***REMOVED***from***REMOVED***"./base";
import***REMOVED***{***REMOVED***chatCompletion***REMOVED***}***REMOVED***from***REMOVED***"../llm/client";

/**
***REMOVED*******REMOVED***SheetsAgent***REMOVED***handles***REMOVED***Google***REMOVED***Sheets***REMOVED***operations***REMOVED***including***REMOVED***creating***REMOVED***spreadsheets,
***REMOVED*******REMOVED***reading/writing***REMOVED***data,***REMOVED***and***REMOVED***analyzing***REMOVED***data***REMOVED***with***REMOVED***LLM
***REMOVED****/
export***REMOVED***class***REMOVED***SheetsAgent***REMOVED***implements***REMOVED***Agent***REMOVED***{
***REMOVED******REMOVED***name***REMOVED***=***REMOVED***"SheetsAgent";

***REMOVED******REMOVED***async***REMOVED***execute(context:***REMOVED***ExecutionContext):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Initialize***REMOVED***Sheets***REMOVED***API***REMOVED***client***REMOVED***with***REMOVED***OAuth***REMOVED***token
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***auth***REMOVED***=***REMOVED***new***REMOVED***google.auth.OAuth2();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***auth.setCredentials({***REMOVED***access_token:***REMOVED***context.accessToken***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***sheets***REMOVED***=***REMOVED***google.sheets({***REMOVED***version:***REMOVED***"v4",***REMOVED***auth***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Route***REMOVED***to***REMOVED***appropriate***REMOVED***action***REMOVED***handler
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(context.action)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"create_spreadsheet":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.createSpreadsheet(sheets,***REMOVED***context.parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"read_data":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.readData(sheets,***REMOVED***context.parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"write_data":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.writeData(sheets,***REMOVED***context.parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"analyze_data":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***await***REMOVED***this.analyzeData(sheets,***REMOVED***context.parameters);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Unknown***REMOVED***action:***REMOVED***${context.action}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`SheetsAgent***REMOVED***execution***REMOVED***failed:***REMOVED***${error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***/**
***REMOVED******REMOVED******REMOVED*******REMOVED***Create***REMOVED***a***REMOVED***new***REMOVED***spreadsheet
***REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED***private***REMOVED***async***REMOVED***createSpreadsheet(
***REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***any,
***REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***Record<string,***REMOVED***any>
***REMOVED******REMOVED***):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***title,***REMOVED***sheetTitles***REMOVED***=***REMOVED***["Sheet1"]***REMOVED***}***REMOVED***=***REMOVED***parameters;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!title)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Missing***REMOVED***required***REMOVED***parameter:***REMOVED***title",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***spreadsheet***REMOVED***with***REMOVED***specified***REMOVED***sheets
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***requestBody***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***properties:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***title,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***sheetTitles.map((sheetTitle:***REMOVED***string)***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***properties:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***sheetTitle,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***})),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***sheets.spreadsheets.create({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***requestBody,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***spreadsheetId:***REMOVED***response.data.spreadsheetId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***spreadsheetUrl:***REMOVED***response.data.spreadsheetUrl,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***response.data.properties.title,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***response.data.sheets.map((sheet:***REMOVED***any)***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***sheetId:***REMOVED***sheet.properties.sheetId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***title:***REMOVED***sheet.properties.title,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***})),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Failed***REMOVED***to***REMOVED***create***REMOVED***spreadsheet:***REMOVED***${error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***/**
***REMOVED******REMOVED******REMOVED*******REMOVED***Read***REMOVED***data***REMOVED***from***REMOVED***a***REMOVED***spreadsheet***REMOVED***range
***REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED***private***REMOVED***async***REMOVED***readData(
***REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***any,
***REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***Record<string,***REMOVED***any>
***REMOVED******REMOVED***):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***spreadsheetId,***REMOVED***range***REMOVED***}***REMOVED***=***REMOVED***parameters;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!spreadsheetId***REMOVED***||***REMOVED***!range)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Missing***REMOVED***required***REMOVED***parameters:***REMOVED***spreadsheetId,***REMOVED***range",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***sheets.spreadsheets.values.get({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***spreadsheetId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***range,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***values***REMOVED***=***REMOVED***response.data.values***REMOVED***||***REMOVED***[];

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***range:***REMOVED***response.data.range,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***values,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rowCount:***REMOVED***values.length,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***columnCount:***REMOVED***values.length***REMOVED***>***REMOVED***0***REMOVED***?***REMOVED***values[0].length***REMOVED***:***REMOVED***0,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Failed***REMOVED***to***REMOVED***read***REMOVED***data:***REMOVED***${error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***/**
***REMOVED******REMOVED******REMOVED*******REMOVED***Write***REMOVED***data***REMOVED***to***REMOVED***a***REMOVED***spreadsheet***REMOVED***range
***REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED***private***REMOVED***async***REMOVED***writeData(
***REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***any,
***REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***Record<string,***REMOVED***any>
***REMOVED******REMOVED***):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***spreadsheetId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***range,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***values,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***valueInputOption***REMOVED***=***REMOVED***"USER_ENTERED",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***=***REMOVED***parameters;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!spreadsheetId***REMOVED***||***REMOVED***!range***REMOVED***||***REMOVED***!values)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Missing***REMOVED***required***REMOVED***parameters:***REMOVED***spreadsheetId,***REMOVED***range,***REMOVED***values",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Ensure***REMOVED***values***REMOVED***is***REMOVED***a***REMOVED***2D***REMOVED***array
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!Array.isArray(values))***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Parameter***REMOVED***'values'***REMOVED***must***REMOVED***be***REMOVED***a***REMOVED***2D***REMOVED***array",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***sheets.spreadsheets.values.update({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***spreadsheetId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***range,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***valueInputOption,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***requestBody:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***values,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updatedRange:***REMOVED***response.data.updatedRange,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updatedRows:***REMOVED***response.data.updatedRows,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updatedColumns:***REMOVED***response.data.updatedColumns,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updatedCells:***REMOVED***response.data.updatedCells,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Failed***REMOVED***to***REMOVED***write***REMOVED***data:***REMOVED***${error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***/**
***REMOVED******REMOVED******REMOVED*******REMOVED***Analyze***REMOVED***spreadsheet***REMOVED***data***REMOVED***using***REMOVED***LLM
***REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED***private***REMOVED***async***REMOVED***analyzeData(
***REMOVED******REMOVED******REMOVED******REMOVED***sheets:***REMOVED***any,
***REMOVED******REMOVED******REMOVED******REMOVED***parameters:***REMOVED***Record<string,***REMOVED***any>
***REMOVED******REMOVED***):***REMOVED***Promise<ExecutionResult>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***spreadsheetId,***REMOVED***range,***REMOVED***analysisType***REMOVED***=***REMOVED***"summary"***REMOVED***}***REMOVED***=***REMOVED***parameters;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!spreadsheetId***REMOVED***||***REMOVED***!range)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***"Missing***REMOVED***required***REMOVED***parameters:***REMOVED***spreadsheetId,***REMOVED***range",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***First,***REMOVED***read***REMOVED***the***REMOVED***data
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***readResult***REMOVED***=***REMOVED***await***REMOVED***this.readData(sheets,***REMOVED***{***REMOVED***spreadsheetId,***REMOVED***range***REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!readResult.success***REMOVED***||***REMOVED***!readResult.output?.values?.length)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysis:***REMOVED***"No***REMOVED***data***REMOVED***found***REMOVED***in***REMOVED***the***REMOVED***specified***REMOVED***range.",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***dataFound:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***values***REMOVED***=***REMOVED***readResult.output.values;

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Prepare***REMOVED***data***REMOVED***for***REMOVED***LLM***REMOVED***analysis
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***dataText***REMOVED***=***REMOVED***this.formatDataForAnalysis(values);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Generate***REMOVED***analysis***REMOVED***prompt***REMOVED***based***REMOVED***on***REMOVED***type
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***analysisPrompt***REMOVED***=***REMOVED***"";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(analysisType)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"summary":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisPrompt***REMOVED***=
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Provide***REMOVED***a***REMOVED***summary***REMOVED***of***REMOVED***this***REMOVED***spreadsheet***REMOVED***data,***REMOVED***including***REMOVED***key***REMOVED***statistics,***REMOVED***patterns,***REMOVED***and***REMOVED***notable***REMOVED***observations.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"insights":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisPrompt***REMOVED***=
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Analyze***REMOVED***this***REMOVED***spreadsheet***REMOVED***data***REMOVED***and***REMOVED***provide***REMOVED***actionable***REMOVED***insights,***REMOVED***trends,***REMOVED***and***REMOVED***recommendations.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"trends":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisPrompt***REMOVED***=
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Identify***REMOVED***trends***REMOVED***and***REMOVED***patterns***REMOVED***in***REMOVED***this***REMOVED***spreadsheet***REMOVED***data.***REMOVED***Highlight***REMOVED***any***REMOVED***significant***REMOVED***changes***REMOVED***or***REMOVED***anomalies.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"statistics":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisPrompt***REMOVED***=
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Calculate***REMOVED***and***REMOVED***explain***REMOVED***key***REMOVED***statistics***REMOVED***from***REMOVED***this***REMOVED***spreadsheet***REMOVED***data,***REMOVED***including***REMOVED***averages,***REMOVED***totals,***REMOVED***and***REMOVED***distributions.";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***default:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisPrompt***REMOVED***=***REMOVED***`Analyze***REMOVED***this***REMOVED***spreadsheet***REMOVED***data***REMOVED***with***REMOVED***focus***REMOVED***on:***REMOVED***${analysisType}`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Generate***REMOVED***analysis***REMOVED***using***REMOVED***LLM
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***llmResponse***REMOVED***=***REMOVED***await***REMOVED***chatCompletion([
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***role:***REMOVED***"system",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***content:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"You***REMOVED***are***REMOVED***an***REMOVED***AI***REMOVED***assistant***REMOVED***that***REMOVED***analyzes***REMOVED***spreadsheet***REMOVED***data.***REMOVED***Provide***REMOVED***clear,***REMOVED***actionable***REMOVED***insights***REMOVED***based***REMOVED***on***REMOVED***the***REMOVED***data***REMOVED***provided.***REMOVED***Format***REMOVED***your***REMOVED***response***REMOVED***in***REMOVED***a***REMOVED***structured***REMOVED***way***REMOVED***with***REMOVED***bullet***REMOVED***points***REMOVED***or***REMOVED***sections***REMOVED***as***REMOVED***appropriate.",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***role:***REMOVED***"user",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***content:***REMOVED***`${analysisPrompt}\n\nSpreadsheet***REMOVED***Data:\n${dataText}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***]);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***output:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysis:***REMOVED***llmResponse.content,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***dataRange:***REMOVED***readResult.output.range,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rowCount:***REMOVED***readResult.output.rowCount,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***columnCount:***REMOVED***readResult.output.columnCount,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***analysisType,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***false,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***`Failed***REMOVED***to***REMOVED***analyze***REMOVED***data:***REMOVED***${error***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***error.message***REMOVED***:***REMOVED***"Unknown***REMOVED***error"}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}

***REMOVED******REMOVED***/**
***REMOVED******REMOVED******REMOVED*******REMOVED***Format***REMOVED***spreadsheet***REMOVED***data***REMOVED***for***REMOVED***LLM***REMOVED***analysis
***REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED***private***REMOVED***formatDataForAnalysis(values:***REMOVED***any[][]):***REMOVED***string***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(values.length***REMOVED***===***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***"No***REMOVED***data***REMOVED***available";
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Limit***REMOVED***data***REMOVED***size***REMOVED***for***REMOVED***LLM***REMOVED***context
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***maxRows***REMOVED***=***REMOVED***100;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***limitedValues***REMOVED***=***REMOVED***values.slice(0,***REMOVED***maxRows);

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Check***REMOVED***if***REMOVED***first***REMOVED***row***REMOVED***looks***REMOVED***like***REMOVED***headers
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***hasHeaders***REMOVED***=***REMOVED***values[0].every(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(cell:***REMOVED***any)***REMOVED***=>***REMOVED***typeof***REMOVED***cell***REMOVED***===***REMOVED***"string"***REMOVED***&&***REMOVED***cell.trim().length***REMOVED***>***REMOVED***0
***REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(hasHeaders)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***headers***REMOVED***=***REMOVED***values[0];
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***dataRows***REMOVED***=***REMOVED***limitedValues.slice(1);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***formatted***REMOVED***=***REMOVED***`Headers:***REMOVED***${headers.join("***REMOVED***|***REMOVED***")}\n\n`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***formatted***REMOVED***+=***REMOVED***"Data:\n";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***dataRows.forEach((row:***REMOVED***any[],***REMOVED***index:***REMOVED***number)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***formatted***REMOVED***+=***REMOVED***`Row***REMOVED***${index***REMOVED***+***REMOVED***1}:***REMOVED***${row.join("***REMOVED***|***REMOVED***")}\n`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(values.length***REMOVED***>***REMOVED***maxRows)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***formatted***REMOVED***+=***REMOVED***`\n...***REMOVED***(${values.length***REMOVED***-***REMOVED***maxRows}***REMOVED***more***REMOVED***rows***REMOVED***not***REMOVED***shown)`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***formatted;
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***No***REMOVED***headers,***REMOVED***just***REMOVED***format***REMOVED***as***REMOVED***rows
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***formatted***REMOVED***=***REMOVED***"Data:\n";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***limitedValues.forEach((row:***REMOVED***any[],***REMOVED***index:***REMOVED***number)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***formatted***REMOVED***+=***REMOVED***`Row***REMOVED***${index***REMOVED***+***REMOVED***1}:***REMOVED***${row.join("***REMOVED***|***REMOVED***")}\n`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(values.length***REMOVED***>***REMOVED***maxRows)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***formatted***REMOVED***+=***REMOVED***`\n...***REMOVED***(${values.length***REMOVED***-***REMOVED***maxRows}***REMOVED***more***REMOVED***rows***REMOVED***not***REMOVED***shown)`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***formatted;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}
}
