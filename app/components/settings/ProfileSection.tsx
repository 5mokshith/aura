'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

/**
 * ProfileSection Component
 * 
 * Display user email and account creation date
 * Requirements: 8.1
 */

interface UserProfile {
  email: string;
  createdAt: string;
}

export function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // TODO: Replace with actual auth context/session
      // For now, using placeholder data
      const userId = 'current-user-id';
      
      // In a real implementation, this would fetch from Supabase auth
      const mockProfile: UserProfile = {
        email: 'user@example.com',
        createdAt: new Date().toISOString(),
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Profile
      </h2>

      <div className="space-y-4">
        {/* User Icon */}
        <div className="flex items-center gap-4">
          <div className="glass-panel rounded-full p-4">
            <User className="w-8 h-8 text-neon-cyan" />
          </div>
          <div>
            <p className="text-sm text-white/60">Account</p>
            <p className="text-lg font-medium text-white">AURA User</p>
          </div>
        </div>

        {/* Email */}
        <div className="glass-panel rounded-lg p-4">
          <p className="text-sm text-white/60 mb-1">Email</p>
          <p className="text-white font-medium">{profile?.email || 'Not available'}</p>
        </div>

        {/* Account Created */}
        <div className="glass-panel rounded-lg p-4">
          <p className="text-sm text-white/60 mb-1">Account Created</p>
          <p className="text-white font-medium">
            {profile?.createdAt ? formatDate(profile.createdAt) : 'Not available'}
          </p>
        </div>
      </div>
    </div>
  );
}
