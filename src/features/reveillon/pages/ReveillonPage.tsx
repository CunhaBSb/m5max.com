import { lazy, Suspense } from 'react';
import PlatformSwitch from '@/shared/PlatformSwitch';

// Lazy load desktop and mobile versions
const ReveillonDesktop = lazy(() => import('../desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('../mobile/Reveillon'));

// Loading fallback component - discreto
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
    <div className="text-center">
      <img 
        src="/m5logo.svg" 
        alt="M5 Max" 
        className="w-12 h-12 mx-auto opacity-80 animate-pulse" 
      />
    </div>
  </div>
);

const ReveillonPage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PlatformSwitch
        desktop={<ReveillonDesktop />}
        mobile={<ReveillonMobile />}
      />
    </Suspense>
  );
};

export default ReveillonPage;