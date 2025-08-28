import { lazy, Suspense } from 'react';
import PlatformSwitch from '@/shared/components/PlatformSwitch';

// Lazy load desktop and mobile versions
const HomeDesktop = lazy(() => import('./desktop/Home'));
const HomeMobile = lazy(() => import('./mobile/Home'));

// Loading fallback component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-fire-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white/70">Carregando...</p>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PlatformSwitch
        desktop={<HomeDesktop />}
        mobile={<HomeMobile />}
      />
    </Suspense>
  );
};

export default HomePage;