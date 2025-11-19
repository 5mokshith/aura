import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserWorkflowHistory } from "@/lib/supabase/queries";

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Get base history
    let history = await getUserWorkflowHistory(user.id, limit + offset);

    // Apply filters
    if (status) {
      history = history.filter((item) => item.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      history = history.filter((item) =>
        item.command.toLowerCase().includes(searchLower)
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      history = history.filter((item) => new Date(item.executed_at) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      history = history.filter((item) => new Date(item.executed_at) <= end);
    }

    // Apply pagination
    const paginatedHistory = history.slice(offset, offset + limit);
    const hasMore = history.length > offset + limit;

    return NextResponse.json({
      history: paginatedHistory,
      pagination: {
        limit,
        offset,
        total: history.length,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
