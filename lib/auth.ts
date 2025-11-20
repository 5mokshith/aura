/**
 * Authentication utilities for checking user session (client-side only)
 */

export interface UserSession {
  userId: string;
  email: string;
  isAuthenticated: boolean;
}

/**
 * Get user session from cookies (client-side)
 */
export function getUserSessionClient(): UserSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Parse cookies on client side
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const userId = cookies['aura_user_id'];
  const email = cookies['aura_user_email'];

  if (!userId || !email) {
    return null;
  }

  return {
    userId,
    email: decodeURIComponent(email),
    isAuthenticated: true,
  };
}
