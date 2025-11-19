import { createClient } from "./client";
import type { Database } from "./database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Workflow = Database["public"]["Tables"]["workflows"]["Row"];
type WorkflowHistory = Database["public"]["Tables"]["workflow_history"]["Row"];
type OAuthToken = Database["public"]["Tables"]["oauth_tokens"]["Row"];

// Profile queries
export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"]
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function upsertProfile(
  profile: Database["public"]["Tables"]["profiles"]["Insert"]
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// Workflow queries
export async function createWorkflow(
  workflow: Database["public"]["Tables"]["workflows"]["Insert"],
  client?: SupabaseClient<Database>
) {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from("workflows")
    .insert(workflow)
    .select()
    .single();

  if (error) throw error;
  return data as Workflow;
}

export async function getWorkflow(workflowId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .single();

  if (error) throw error;
  return data as Workflow;
}

export async function updateWorkflow(
  workflowId: string,
  updates: Database["public"]["Tables"]["workflows"]["Update"],
  client?: SupabaseClient<Database>
) {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from("workflows")
    .update(updates)
    .eq("id", workflowId)
    .select()
    .single();

  if (error) throw error;
  return data as Workflow;
}

export async function getUserWorkflows(userId: string, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Workflow[];
}

// Workflow history queries
export async function addWorkflowHistory(
  history: Database["public"]["Tables"]["workflow_history"]["Insert"],
  client?: SupabaseClient<Database>
) {
  const supabase = client || createClient();

  const { data, error } = await supabase
    .from("workflow_history")
    .insert(history)
    .select()
    .single();

  if (error) throw error;
  return data as WorkflowHistory;
}

export async function getUserWorkflowHistory(userId: string, limit = 20) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("workflow_history")
    .select("*")
    .eq("user_id", userId)
    .order("executed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WorkflowHistory[];
}

export async function deleteWorkflowHistory(historyId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("workflow_history")
    .delete()
    .eq("id", historyId);

  if (error) throw error;
}

export async function clearUserWorkflowHistory(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("workflow_history")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}

// OAuth token queries
export async function storeGoogleOAuthTokens(
  userId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: Date,
  scopes: string[]
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("oauth_tokens")
    .upsert({
      user_id: userId,
      provider: "google",
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt.toISOString(),
      scopes,
    })
    .select()
    .single();

  if (error) throw error;
  return data as OAuthToken;
}

export async function getGoogleOAuthTokens(userId: string) {
  const supabase = createClient();

  // Use the SECURITY DEFINER function to bypass RLS
  const { data, error } = await supabase.rpc("get_google_oauth_token", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error fetching OAuth tokens:", error);
    throw error;
  }

  // The function returns an array with one row or empty array
  if (!data || data.length === 0) {
    return null;
  }

  const token = data[0];
  return {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: token.expires_at,
    is_expired: token.is_expired,
  } as any;
}

export async function deleteGoogleOAuthTokens(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("oauth_tokens")
    .delete()
    .eq("user_id", userId)
    .eq("provider", "google");

  if (error) throw error;
}

export async function isGoogleTokenExpired(userId: string): Promise<boolean> {
  const tokens = await getGoogleOAuthTokens(userId);

  if (!tokens || !tokens.expires_at) {
    return true;
  }

  const expiresAt = new Date(tokens.expires_at);
  const now = new Date();

  // Consider expired if less than 5 minutes remaining
  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}
