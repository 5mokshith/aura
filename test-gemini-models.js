//***REMOVED***Test***REMOVED***script***REMOVED***to***REMOVED***list***REMOVED***available***REMOVED***Gemini***REMOVED***models
const***REMOVED***{***REMOVED***GoogleGenerativeAI***REMOVED***}***REMOVED***=***REMOVED***require("@google/generative-ai");

const***REMOVED***apiKey***REMOVED***=***REMOVED***process.env.GOOGLE_GEMINI_API_KEY***REMOVED***||***REMOVED***"REDACTED";
const***REMOVED***genAI***REMOVED***=***REMOVED***new***REMOVED***GoogleGenerativeAI(apiKey);

async***REMOVED***function***REMOVED***listModels()***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.log("Testing***REMOVED***Gemini***REMOVED***API***REMOVED***with***REMOVED***key:",***REMOVED***apiKey.substring(0,***REMOVED***20)***REMOVED***+***REMOVED***"...");
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Try***REMOVED***different***REMOVED***model***REMOVED***names
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***modelsToTest***REMOVED***=***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"gemini-1.5-flash",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"gemini-1.5-pro",***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"gemini-pro",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"gemini-1.0-pro",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"gemini-2.0-flash-exp"
***REMOVED******REMOVED******REMOVED******REMOVED***];
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***for***REMOVED***(const***REMOVED***modelName***REMOVED***of***REMOVED***modelsToTest)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`\nTesting***REMOVED***model:***REMOVED***${modelName}`);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***model***REMOVED***=***REMOVED***genAI.getGenerativeModel({***REMOVED***model:***REMOVED***modelName***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***model.generateContent("Say***REMOVED***hello");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***result.response;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`✓***REMOVED***${modelName}***REMOVED***works!***REMOVED***Response:`,***REMOVED***response.text().substring(0,***REMOVED***50));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.log(`✗***REMOVED***${modelName}***REMOVED***failed:`,***REMOVED***error.message);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error:",***REMOVED***error);
***REMOVED******REMOVED***}
}

listModels();
