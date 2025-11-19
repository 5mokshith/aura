// Type-safe environment variables
export const env = {
  // Public variables (accessible in browser)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  googleClientIdPublic: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",

  // Server-only variables
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
  bffApiUrl: process.env.BFF_API_URL || "http://localhost:8000",
} as const;

// Validate required environment variables on server
if (typeof window === "undefined") {
  const requiredEnvVars = ["NEXTAUTH_SECRET"] as const;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: ${envVar} environment variable is not set`);
    }
  }
}
