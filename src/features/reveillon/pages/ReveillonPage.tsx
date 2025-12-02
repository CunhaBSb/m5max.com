import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';
import { PageLoading } from '@/shared/ui/page-loading';

// Lazy load components
const ReveillonDesktop = lazy(() => import('../desktop/Reveillon'));
const ReveillonMobile = lazy(() => import('../mobile/Reveillon'));

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
