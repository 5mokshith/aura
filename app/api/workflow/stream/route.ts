import***REMOVED***{***REMOVED***NextRequest***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***createClient***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/server";

//***REMOVED***Store***REMOVED***active***REMOVED***workflow***REMOVED***streams
const***REMOVED***activeStreams***REMOVED***=***REMOVED***new***REMOVED***Map<string,***REMOVED***ReadableStreamDefaultController>();

export***REMOVED***async***REMOVED***function***REMOVED***GET(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***supabase***REMOVED***=***REMOVED***await***REMOVED***createClient();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Verify***REMOVED***user***REMOVED***is***REMOVED***authenticated
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***{***REMOVED***data:***REMOVED***{***REMOVED***user***REMOVED***},***REMOVED***error:***REMOVED***authError***REMOVED***}***REMOVED***=***REMOVED***await***REMOVED***supabase.auth.getUser();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(authError***REMOVED***||***REMOVED***!user)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***new***REMOVED***Response("Unauthorized",***REMOVED***{***REMOVED***status:***REMOVED***401***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***searchParams***REMOVED***=***REMOVED***request.nextUrl.searchParams;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***workflowId***REMOVED***=***REMOVED***searchParams.get("workflowId");

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!workflowId)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***new***REMOVED***Response("Workflow***REMOVED***ID***REMOVED***required",***REMOVED***{***REMOVED***status:***REMOVED***400***REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Create***REMOVED***SSE***REMOVED***stream
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***stream***REMOVED***=***REMOVED***new***REMOVED***ReadableStream({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***start(controller)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Store***REMOVED***controller***REMOVED***for***REMOVED***this***REMOVED***workflow
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***activeStreams.set(workflowId,***REMOVED***controller);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Send***REMOVED***initial***REMOVED***connection***REMOVED***message
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***encoder***REMOVED***=***REMOVED***new***REMOVED***TextEncoder();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***controller.enqueue(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***encoder.encode(`data:***REMOVED***${JSON.stringify({***REMOVED***type:***REMOVED***"connected",***REMOVED***workflowId***REMOVED***})}\n\n`)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Set***REMOVED***up***REMOVED***heartbeat***REMOVED***to***REMOVED***keep***REMOVED***connection***REMOVED***alive
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***heartbeat***REMOVED***=***REMOVED***setInterval(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***controller.enqueue(encoder.encode(`:***REMOVED***heartbeat\n\n`));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***clearInterval(heartbeat);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***30000);***REMOVED***//***REMOVED***Every***REMOVED***30***REMOVED***seconds

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Clean***REMOVED***up***REMOVED***on***REMOVED***close
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***request.signal.addEventListener("abort",***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***clearInterval(heartbeat);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***activeStreams.delete(workflowId);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***controller.close();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Controller***REMOVED***already***REMOVED***closed
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***cancel()***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***activeStreams.delete(workflowId);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***new***REMOVED***Response(stream,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Content-Type":***REMOVED***"text/event-stream",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Cache-Control":***REMOVED***"no-cache",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"Connection":***REMOVED***"keep-alive",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***creating***REMOVED***SSE***REMOVED***stream:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***new***REMOVED***Response("Internal***REMOVED***server***REMOVED***error",***REMOVED***{***REMOVED***status:***REMOVED***500***REMOVED***});
***REMOVED******REMOVED***}
}

/**
***REMOVED*******REMOVED***Send***REMOVED***an***REMOVED***event***REMOVED***to***REMOVED***a***REMOVED***specific***REMOVED***workflow***REMOVED***stream
***REMOVED****/
export***REMOVED***function***REMOVED***sendWorkflowEvent(
***REMOVED******REMOVED***workflowId:***REMOVED***string,
***REMOVED******REMOVED***event:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***type:***REMOVED***"step_start"***REMOVED***|***REMOVED***"step_complete"***REMOVED***|***REMOVED***"step_error"***REMOVED***|***REMOVED***"workflow_complete";
***REMOVED******REMOVED******REMOVED******REMOVED***stepId?:***REMOVED***string;
***REMOVED******REMOVED******REMOVED******REMOVED***data:***REMOVED***any;
***REMOVED******REMOVED***}
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***controller***REMOVED***=***REMOVED***activeStreams.get(workflowId);
***REMOVED******REMOVED***
***REMOVED******REMOVED***if***REMOVED***(controller)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***encoder***REMOVED***=***REMOVED***new***REMOVED***TextEncoder();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***eventData***REMOVED***=***REMOVED***JSON.stringify(event);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***controller.enqueue(encoder.encode(`event:***REMOVED***${event.type}\ndata:***REMOVED***${eventData}\n\n`));
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Error***REMOVED***sending***REMOVED***workflow***REMOVED***event:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***activeStreams.delete(workflowId);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}
}

//***REMOVED***Export***REMOVED***for***REMOVED***use***REMOVED***in***REMOVED***other***REMOVED***modules
export***REMOVED***{***REMOVED***activeStreams***REMOVED***};
