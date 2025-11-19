import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWorkflow, updateWorkflow } from "@/lib/supabase/queries";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { workflowId, resultId, rating, comment } = body;

    if (!workflowId || !resultId || !rating) {
      return NextResponse.json(
        { error: "WorkflowID, resultID, and rating are required" },
        { status: 400 }
      );
    }

    if (!["positive", "negative"].includes(rating)) {
      return NextResponse.json(
        { error: "Rating must be 'positive' or 'negative'" },
        { status: 400 }
      );
    }

    // Get workflow
    const workflow = await getWorkflow(workflowId);

    // Verify workflow belongs to user
    if (workflow.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to provide feedback for this workflow" },
        { status: 403 }
      );
    }

    // Update results with feedback
    const results = workflow.resultsasany || [];
    const updatedResults = results.map((result: any) => {
      if (result.id === resultId) {
        return {
          ...result,
          feedback: {
            rating,
            comment: comment || null,
            timestamp: new Date().toISOString(),
          },
        };
      }
      return result;
    });

    // Update workflow
    await updateWorkflow(workflowId, {
      results: updatedResults,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
    });
  } catch (error) {
    console.error("Error recording feedback:", error);
    return NextResponse.json(
      {
        error: "Failed to record feedback",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
