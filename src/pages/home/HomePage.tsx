import { lazy, Suspense } from 'react';
import PlatformSwitch from '@/shared/components/PlatformSwitch';

// Lazy load desktop and mobile versions
const HomeDesktop = lazy(() => import('./desktop/Home'));
const HomeMobile = lazy(() => import('./mobile/Home'));

// Loading fallback component - discreto
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <div className="text-center">
      <img 
        src="/m5logo.svg" 
        alt="M5 Max" 
        className="w-12 h-12 mx-auto opacity-80 animate-pulse" 
      />
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