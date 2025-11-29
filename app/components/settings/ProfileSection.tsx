'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
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
}

export function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

      setProfile({
        email: session.email,
        name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
        userId: session.userId,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Profile
        </h2>
        <div className="text-center py-8">
          <p className="text-white/60">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Profile
      </h2>

      <div className="space-y-4">
        {/* User Icon */}
        <div className="flex items-center gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-4">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm text-white/60">Account</p>
            <p className="text-lg font-medium text-white">{profile?.name || 'User'}</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
          <p className="text-sm text-white/60 mb-1">Email</p>
          <p className="text-white font-medium">{profile?.email || 'Not available'}</p>
        </div>
      </div>
    </div>
  );
}
