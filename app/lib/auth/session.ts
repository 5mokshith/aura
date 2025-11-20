import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Session management utilities
 */

export interface UserSession {
  userId: string;
  email: string;
}

/**
 * Get current user session from cookies (Server Components)
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('aura_user_id')?.value;
  const email = cookieStore.get('aura_user_email')?.value;

  if (!userId || !email) {
    return null;
  }

  return { userId, email };
}

/**
 * Get current user session from request (API Routes)
 */
export function getCurrentUserFromRequest(request: NextRequest): UserSession | null {
  const userId = request.cookies.get('aura_user_id')?.value;
  const email = request.cookies.get('aura_user_email')?.value;

  if (!userId || !email) {
    return null;
  }

  return { userId, email };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<UserSession> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Require authentication for API routes - throws if not authenticated
 */
export function requireAuthFromRequest(request: NextRequest): UserSession {
  const user = getCurrentUserFromRequest(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
