import***REMOVED***{***REMOVED***NextRequest,***REMOVED***NextResponse***REMOVED***}***REMOVED***from***REMOVED***"next/server";

interface***REMOVED***FeedbackRequest***REMOVED***{
***REMOVED******REMOVED***resultId:***REMOVED***string;
***REMOVED******REMOVED***rating:***REMOVED***"positive"***REMOVED***|***REMOVED***"negative";
***REMOVED******REMOVED***timestamp:***REMOVED***string;
}

//***REMOVED***In-memory***REMOVED***storage***REMOVED***for***REMOVED***demo***REMOVED***purposes
//***REMOVED***In***REMOVED***production,***REMOVED***this***REMOVED***would***REMOVED***be***REMOVED***stored***REMOVED***in***REMOVED***a***REMOVED***database
const***REMOVED***feedbackStore***REMOVED***=***REMOVED***new***REMOVED***Map<string,***REMOVED***FeedbackRequest>();

export***REMOVED***async***REMOVED***function***REMOVED***POST(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***body:***REMOVED***FeedbackRequest***REMOVED***=***REMOVED***await***REMOVED***request.json();

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Validate***REMOVED***request
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!body.resultId***REMOVED***||***REMOVED***!body.rating)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Missing***REMOVED***required***REMOVED***fields:***REMOVED***resultId***REMOVED***and***REMOVED***rating"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(body.rating***REMOVED***!==***REMOVED***"positive"***REMOVED***&&***REMOVED***body.rating***REMOVED***!==***REMOVED***"negative")***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Invalid***REMOVED***rating.***REMOVED***Must***REMOVED***be***REMOVED***'positive'***REMOVED***or***REMOVED***'negative'"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Store***REMOVED***feedback
***REMOVED******REMOVED******REMOVED******REMOVED***feedbackStore.set(body.resultId,***REMOVED***body);

***REMOVED******REMOVED******REMOVED******REMOVED***console.log(`Feedback***REMOVED***received***REMOVED***for***REMOVED***result***REMOVED***${body.resultId}:***REMOVED***${body.rating}`);

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message:***REMOVED***"Feedback***REMOVED***submitted***REMOVED***successfully",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***resultId:***REMOVED***body.resultId,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rating:***REMOVED***body.rating,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***200***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***processing***REMOVED***feedback:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Failed***REMOVED***to***REMOVED***process***REMOVED***feedback"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}
}

//***REMOVED***Optional:***REMOVED***GET***REMOVED***endpoint***REMOVED***to***REMOVED***retrieve***REMOVED***feedback
export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***searchParams***REMOVED***}***REMOVED***=***REMOVED***new***REMOVED***URL(request.url);
***REMOVED******REMOVED***const***REMOVED***resultId***REMOVED***=***REMOVED***searchParams.get("resultId");

***REMOVED******REMOVED***if***REMOVED***(resultId)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***feedback***REMOVED***=***REMOVED***feedbackStore.get(resultId);
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(feedback)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(feedback);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***NextResponse.json(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***error:***REMOVED***"Feedback***REMOVED***not***REMOVED***found"***REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{***REMOVED***status:***REMOVED***404***REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***//***REMOVED***Return***REMOVED***all***REMOVED***feedback
***REMOVED******REMOVED***const***REMOVED***allFeedback***REMOVED***=***REMOVED***Array.from(feedbackStore.entries()).map(([id,***REMOVED***data])***REMOVED***=>***REMOVED***({
***REMOVED******REMOVED******REMOVED******REMOVED***id,
***REMOVED******REMOVED******REMOVED******REMOVED***...data,
***REMOVED******REMOVED***}));

***REMOVED******REMOVED***return***REMOVED***NextResponse.json({***REMOVED***feedback:***REMOVED***allFeedback***REMOVED***});
}
