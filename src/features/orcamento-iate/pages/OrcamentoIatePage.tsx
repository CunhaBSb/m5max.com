import { Suspense, lazy } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';

const OrcamentoIateDesktop = lazy(() => import('../desktop/OrcamentoIateDesktop'));
const OrcamentoIateMobile = lazy(() => import('../mobile/OrcamentoIateMobile'));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <img src="/m5logo.svg" alt="M5 Max" className="w-12 h-12 opacity-80 animate-pulse" />
  </div>
);

const OrcamentoIatePage = () => (
  <Suspense fallback={<PageLoading />}>
    <PlatformSwitch desktop={<OrcamentoIateDesktop />} mobile={<OrcamentoIateMobile />} />
  </Suspense>
);

export default OrcamentoIatePage;
