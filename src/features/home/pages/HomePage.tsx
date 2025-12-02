import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';
import { PageLoading } from '@/shared/ui/page-loading';

// Lazy load desktop and mobile versions
const HomeDesktop = lazy(() => import('../desktop/Home'));
const HomeMobile = lazy(() => import('../mobile/Home'));

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