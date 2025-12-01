'use client';

import { useEffect, useState } from 'react';
import { Mail, FolderOpen, FileText, Sheet, Calendar, CheckCircle2, XCircle } from 'lucide-react';

/**
 * ConnectedApps Component
 * 
 * Display Google service icons in grid with active status indicators
 * Requirements: 7.1
 */

interface ServiceStatus {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  color: string;
}

export function ConnectedApps() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      icon: <Mail className="w-8 h-8" />,
      connected: false,
      color: 'cyan',
    },
    {
      id: 'drive',
      name: 'Drive',
      icon: <FolderOpen className="w-8 h-8" />,
      connected: false,
      color: 'blue',
    },
    {
      id: 'docs',
      name: 'Docs',
      icon: <FileText className="w-8 h-8" />,
      connected: false,
      color: 'purple',
    },
    {
      id: 'sheets',
      name: 'Sheets',
      icon: <Sheet className="w-8 h-8" />,
      connected: false,
      color: 'pink',
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <Calendar className="w-8 h-8" />,
      connected: false,
      color: 'cyan',
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnections();
  }, []);

  const getUserIdFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find(row => row.startsWith('aura_user_id='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  };

  const checkConnections = async () => {
    try {
      // Get user ID from session (placeholder - implement based on your auth)
      const userId = getUserIdFromCookie();

      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/db/get-tokens?userId=${encodeURIComponent(userId)}`);
      const result = await response.json();

      if (result.success && result.data) {
        // If tokens exist and not expired, all services are connected
        const isConnected = !result.data.isExpired;
        
        setServices(prev =>
          prev.map(service => ({
            ...service,
            connected: isConnected,
          }))
        );
      }
    } catch (error) {
      console.error('Error checking connections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel-strong rounded-xl p-6">
      <h2 className="text-2xl font-display font-bold text-white mb-6">
        Connected Apps
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map(service => (
            <div
              key={service.id}
              className={`glass-panel rounded-lg p-4 flex flex-col items-center gap-3 transition-all duration-300 ${
                service.connected
                  ? 'border-green-500/50 hover:shadow-green-500/20'
                  : 'border-red-500/50 hover:shadow-red-500/20'
              }`}
            >
              {/* Icon */}
              <div
                className={`text-${service.color === 'cyan' ? 'neon-cyan' : service.color === 'blue' ? 'blue-400' : service.color === 'purple' ? 'neon-purple' : 'neon-pink'}`}
              >
                {service.icon}
              </div>

              {/* Service Name */}
              <span className="text-sm font-medium text-white">
                {service.name}
              </span>

              {/* Status Indicator */}
              <div className="flex items-center gap-1">
                {service.connected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Inactive</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
