import { lazy, Suspense } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

// Lazy load components
const ReveillonDesktop = lazy(() => import('@/features/reveillon/desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('@/features/reveillon/mobile/Reveillon'));

// Fallback UI
const ReveillonPageFallback = () => (
  <div className="w-full h-screen bg-background animate-pulse"></div>
);

const ReveillonPage = () => {
  const isDesktop = useIsDesktop();

  return (
    <Suspense fallback={<ReveillonPageFallback />}>
      {isDesktop ? <ReveillonDesktop /> : <ReveillonMobile />}
    </Suspense>
  );
};

export default ReveillonPage;
