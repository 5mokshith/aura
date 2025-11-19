"use client";

import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">AURA</h1>
          <p className="mt-2 text-sm text-gray-600">
            Agentic Unified Reasoning Assistant
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome to AURA
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connect your Google account to get started with AI-powered
              workflow automation
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.5612.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.261.37-1.042.53-2.213.31v2.77h3.57c2.08-1.923.28-4.743.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M1223c2.9705.46-.987.28-2.66l-3.57-2.77c-.98.66-2.231.06-3.711.06-2.860-5.29-1.93-6.16-4.53H2.18v2.84C3.9920.537.7231223z"
              />
              <path
                fill="currentColor"
                d="M5.8414.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.438.55110.22112s.433.451.184.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M125.38c1.6203.06.564.211.64l3.15-3.15C17.452.0914.9711217.713.993.472.187.07l3.662.84c.87-2.63.3-4.536.16-4.53z"
              />
            </svg>
            Connect Google Account
          </button>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>By connecting, you agree to grant AURA access to:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Gmail (read and send emails)</li>
              <li>• Google Drive (create and manage files)</li>
              <li>• Google Docs (create and edit documents)</li>
              <li>• Google Sheets (create and edit spreadsheets)</li>
              <li>• Google Calendar (manage events)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
