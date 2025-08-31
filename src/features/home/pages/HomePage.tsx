import { lazy, Suspense } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

// Lazy load desktop and mobile versions
const HomeDesktop = lazy(() => import('../desktop/Home'));
const HomeMobile = lazy(() => import('../mobile/Home'));

// SSR-safe loading component
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

// Platform-aware content with unified loading
const HomeContent = () => {
  const isDesktop = useIsDesktop();
  
  // Show loading during platform detection (SSR/hydration safe)
  if (isDesktop === null) {
    return <PageLoading />;
  }
  
  // Return appropriate platform component
  return isDesktop ? <HomeDesktop /> : <HomeMobile />;
};

const HomePage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeContent />
    </Suspense>
  );
};

export default HomePage;