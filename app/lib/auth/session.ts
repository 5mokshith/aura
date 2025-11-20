import { cookies } from 'next/headers';
import { createServiceClient } from '@/app/lib/supabase/server';

export interface AuthSession {
  userId: string;
  email: string;
  isAuthenticated: boolean;
}

/**
 * Get the current authentication session
 * Checks both Supabase Auth and custom OAuth cookies
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    // First check Supabase Auth
    const supabase = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return {
        userId: user.id,
        email: user.email || '',
        isAuthenticated: true,
      };
    }

    // Fallback to custom OAuth cookies
    const cookieStore = cookies();
    const customUserId = cookieStore.get('aura_user_id')?.value;
    const customUserEmail = cookieStore.get('aura_user_email')?.value;

    if (customUserId && customUserEmail) {
      return {
        userId: customUserId,
        email: customUserEmail,
        isAuthenticated: true,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getAuthSession();
  return session?.isAuthenticated || false;
}