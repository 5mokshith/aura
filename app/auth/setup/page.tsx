import { Suspense } from 'react';
import { OAuthSetup } from '@/app/components/auth/OAuthSetup';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

function OAuthSetupWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <OAuthSetup />
    </Suspense>
  );
}

export default function AuthSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <OAuthSetupWrapper />
    </div>
  );
}