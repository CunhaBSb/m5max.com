import { lazy, Suspense } from 'react';
import PlatformSwitch from '@/shared/components/PlatformSwitch';

// Lazy load desktop and mobile versions
const ReveillonDesktop = lazy(() => import('./desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('./mobile/Reveillon'));

// Loading fallback component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white/70">Carregando Reveillon...</p>
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