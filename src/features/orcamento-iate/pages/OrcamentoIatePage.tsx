import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
import { PageLoading } from '@/shared/ui/page-loading';

const OrcamentoIatePage = () => (
  <ChunkErrorBoundary>
    <ConditionalLazy
      desktopLoader={() => import('../desktop/OrcamentoIateDesktop')}
      mobileLoader={() => import('../mobile/OrcamentoIateMobile')}
      fallback={<PageLoading />}
    />
  </ChunkErrorBoundary>
);

export default OrcamentoIatePage;
