import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGoogleOAuthTokens, getProfile } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        isAuthenticated: false,
        session: null,
      });
    }

    // Get user profile
    let profile = null;
    try {
      profile = await getProfile(user.id);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }

    // Get Google OAuth status
    let googleOAuthStatus = {
      isConnected: false,
      userEmail: user.email,
      scopes: [] as string[],
      expiresAt: null as string | null,
    };

    try {
      const tokens = await getGoogleOAuthTokens(user.id);
      if (tokens) {
        const expiresAt = tokens.expires_at ? new Date(tokens.expires_at) : null;
        const isExpired = expiresAt ? expiresAt < new Date() : true;

        googleOAuthStatus = {
          isConnected: !isExpired,
          userEmail: user.email || "",
          scopes: tokens.scopes || [],
          expiresAt: tokens.expires_at,
        };
      }
    } catch (err) {
      console.error("Error fetching Google OAuth tokens:", err);
    }

    return NextResponse.json({
      isAuthenticated: true,
      session: {
        userId: user.id,
        email: user.email,
        isAuthenticated: true,
        oauthStatus: googleOAuthStatus,
        preferences: profile?.preferences || {
          theme: "system",
          notificationsEnabled: true,
          defaultView: "dashboard",
          favoriteActions: [],
        },
      },
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
