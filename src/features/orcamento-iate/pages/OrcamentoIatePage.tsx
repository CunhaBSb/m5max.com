import { Suspense, lazy } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';
import { PageLoading } from '@/shared/ui/page-loading';

const OrcamentoIateDesktop = lazy(() => import('../desktop/OrcamentoIateDesktop'));
const OrcamentoIateMobile = lazy(() => import('../mobile/OrcamentoIateMobile'));

const OrcamentoIatePage = () => (
  <Suspense fallback={<PageLoading />}>
    <PlatformSwitch desktop={<OrcamentoIateDesktop />} mobile={<OrcamentoIateMobile />} />
  </Suspense>
);

export default OrcamentoIatePage;
