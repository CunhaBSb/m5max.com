import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';

// Lazy load components
const ReveillonDesktop = lazy(() => import('../desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('../mobile/Reveillon'));

// Fallback UI
const ReveillonPageFallback = () => (
  <div className="w-full h-screen bg-background animate-pulse"></div>
);

const ReveillonPage = () => {
  return (
    <Suspense fallback={<ReveillonPageFallback />}>
      <PlatformSwitch
        desktop={<ReveillonDesktop />}
        mobile={<ReveillonMobile />}
      />
    </Suspense>
  );
};

export default ReveillonPage;
