/**
 * Authentication utilities for server-side operations
 * Only use in Server Components, API routes, and server actions
 */

import { cookies } from 'next/headers';

export interface UserSession {
  userId: string;
  email: string;
  isAuthenticated: boolean;
}

/**
 * Get current user session from cookies (server-side only)
 */
export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('aura_user_id')?.value;
  const email = cookieStore.get('aura_user_email')?.value;

  if (!userId || !email) {
    return null;
  }

  return {
    userId,
    email,
    isAuthenticated: true,
  };
}

/**
 * Check if user is authenticated (server-side only)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getUserSession();
  return session !== null;
}
