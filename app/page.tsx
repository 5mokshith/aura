'use client';

import { useEffect, useState } from 'react';
import { getUserSessionClient } from '@/lib/auth';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = getUserSessionClient();
    if (session?.userId) {
      setIsAuthenticated(true);
    }
  }, []);

  // Show dashboard for logged‑in users, otherwise the landing page
  return isAuthenticated ? <DashboardLayout /> : <LandingPage />;
}
