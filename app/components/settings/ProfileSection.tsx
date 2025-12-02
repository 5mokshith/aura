'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { getUserSessionClient } from '@/lib/auth';

/**
 * ProfileSection Component
 * 
 * Display user email and account creation date
 * Requirements: 8.1
 */

interface UserProfile {
  email: string;
  name: string;
  userId: string;
  picture?: string;
}

export function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Get user session from cookies
      const session = getUserSessionClient();

      if (!session) {
        console.log('No active session found');
        setLoading(false);
        return;
      }

      // Extract name from email (before @)
      const userName = session.email.split('@')[0] || 'User';

      // Try to get profile picture from cookie
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const picture = cookies['aura_user_picture'] ? decodeURIComponent(cookies['aura_user_picture']) : undefined;

      setProfile({
        email: session.email,
        name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
        userId: session.userId,
        picture: picture,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Profile
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Profile
      </h2>

      <div className="space-y-4">
        {/* User Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black dark:bg-gray-700 flex items-center justify-center">
            {profile.picture && !imageError ? (
              <Image
                src={profile.picture}
                alt={profile.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Account</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.name || 'User'}</p>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{profile?.email || 'Not available'}</p>
        </div>
      </div>
    </div>
  );
}
