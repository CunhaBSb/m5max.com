import { lazy, Suspense } from 'react';
import PlatformSwitch from '@/shared/components/PlatformSwitch';

// Lazy load desktop and mobile versions
const ShowsPageDesktop = lazy(() => import('./desktop/ShowsPage'));
const ShowsPageMobile = lazy(() => import('./mobile/ShowsPage'));

// Loading fallback component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-900 via-red-900 to-black">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-fire-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white/70">Carregando Shows...</p>
    </div>
  </div>
);

const PyrotechnicsPage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PlatformSwitch
        desktop={<ShowsPageDesktop />}
        mobile={<ShowsPageMobile />}
      />
    </Suspense>
  );
};

export default PyrotechnicsPage;