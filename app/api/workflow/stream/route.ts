import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Store active workflow streams
const activeStreams = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const workflowId = searchParams.get("workflowId");

    if (!workflowId) {
      return new Response("WorkflowIDrequired", { status: 400 });
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store controller for this workflow
        activeStreams.set(workflowId, controller);

        // Send initial connection message
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(`data:${JSON.stringify({ type: "connected", workflowId })}\n\n`)
        );

        // Setup heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(":heartbeat\n\n"));
          } catch (error) {
            clearInterval(heartbeat);
          }
        }, 30000); // Every 30 seconds

        // Cleanup on close
        request.signal.addEventListener("abort", () => {
          clearInterval(heartbeat);
          activeStreams.delete(workflowId);
          try {
            controller.close();
          } catch (error) {
            // Controller already closed
          }
        });
      },
      cancel() {
        activeStreams.delete(workflowId);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error creating SSE stream:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

/**
 * Send an event to a specific workflow stream
 */
export function sendWorkflowEvent(
  workflowId: string,
  event: {
    type: "step_start" | "step_complete" | "step_error" | "workflow_complete";
    stepId?: string;
    data: any;
  }
) {
  const controller = activeStreams.get(workflowId);

  if (controller) {
    try {
      const encoder = new TextEncoder();
      const eventData = JSON.stringify(event);
      controller.enqueue(encoder.encode(`event:${event.type}\ndata:${eventData}\n\n`));
    } catch (error) {
      console.error("Error sending workflow event:", error);
      activeStreams.delete(workflowId);
    }
  }
}
