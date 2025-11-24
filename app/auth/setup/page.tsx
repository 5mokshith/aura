import { Suspense } from 'react';
import { OAuthSetup } from '@/app/components/auth/OAuthSetup';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

function OAuthSetupWrapper() {
  return (
    ```
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-galaxy-bg -z-20"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-neon-pink/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <OAuthSetupWrapper />
    </div>
  );
}
```