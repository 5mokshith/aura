"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  storeGoogleOAuthTokens,
  getGoogleOAuthTokens,
  deleteGoogleOAuthTokens,
} from "@/lib/supabase/queries";
import type { User, Session } from "@supabase/supabase-js";

interface GoogleOAuthStatus {
  isConnected: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string[];
}

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  googleOAuthStatus: GoogleOAuthStatus;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshGoogleToken: () => Promise<void>;
  getGoogleAccessToken: () => Promise<string | null>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined
);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleOAuthStatus, setGoogleOAuthStatus] = useState<GoogleOAuthStatus>({
    isConnected: false,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    scopes: [],
  });
  const supabase = createClient();

  // Load Google OAuth status
  const loadGoogleOAuthStatus = useCallback(async (userId: string) => {
    try {
      const tokens = await getGoogleOAuthTokens(userId);

      setGoogleOAuthStatus({
        isConnected: Boolean(tokens),
        accessToken: tokens?.access_token ?? null,
        refreshToken: tokens?.refresh_token ?? null,
        expiresAt: tokens?.expires_at ? new Date(tokens.expires_at) : null,
        scopes: tokens?.scopes ?? [],
      });
    } catch (err) {
      console.error("Error loading Google OAuth status:", err);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      setError(null);

      // Reload Google OAuth status
      if (data.user) {
        await loadGoogleOAuthStatus(data.user.id);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh session");
    }
  }, [supabase.auth, loadGoogleOAuthStatus]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          scopes: [
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/documents",
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/calendar",
          ].join(""),
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in");
      throw err;
    }
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    try {
      setError(null);

      // Delete Google OAuth tokens first
      if (user) {
        await deleteGoogleOAuthTokens(user.id);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setGoogleOAuthStatus({
        isConnected: false,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        scopes: [],
      });
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Failed to sign out");
      throw err;
    }
  }, [supabase.auth, user]);

  // Refresh Google OAuth token
  const refreshGoogleToken = useCallback(async () => {
    if (!user || !googleOAuthStatus.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Call your backend API to refresh the Google token
      const response = await fetch("/api/auth/refresh-google-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: googleOAuthStatus.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh Google token");
      }

      const data = await response.json();

      // Store the new tokens
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);
      await storeGoogleOAuthTokens(
        user.id,
        data.access_token,
        data.refresh_token ?? googleOAuthStatus.refreshToken,
        expiresAt,
        googleOAuthStatus.scopes
      );

      // Update local state
      setGoogleOAuthStatus({
        isConnected: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? googleOAuthStatus.refreshToken,
        expiresAt,
        scopes: googleOAuthStatus.scopes,
      });
    } catch (err) {
      console.error("Error refreshing Google token:", err);
      throw err;
    }
  }, [user, googleOAuthStatus]);

  // Get valid Google access token (refresh if needed)
  const getGoogleAccessToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;

    // Check if token is expired or about to expire (within 5 minutes)
    const now = new Date();
    const expiresAt = googleOAuthStatus.expiresAt;

    if (!expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      // Token expired or about to expire, refresh it
      try {
        await refreshGoogleToken();
        return googleOAuthStatus.accessToken;
      } catch (err) {
        console.error("Failed to refresh token:", err);
        return null;
      }
    }

    return googleOAuthStatus.accessToken;
  }, [user, googleOAuthStatus, refreshGoogleToken]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadGoogleOAuthStatus(session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize auth"
        );
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [supabase.auth, loadGoogleOAuthStatus]);

  const value: SupabaseAuthContextType = {
    user,
    session,
    isLoading,
    error,
    googleOAuthStatus,
    signInWithGoogle,
    signOut,
    refreshSession,
    refreshGoogleToken,
    getGoogleAccessToken,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
