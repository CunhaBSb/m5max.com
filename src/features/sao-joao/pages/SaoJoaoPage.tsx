import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
import { PageLoading } from '@/shared/ui/page-loading';

const SaoJoaoPage = () => {
  return (
    <ChunkErrorBoundary>
      <ConditionalLazy
        desktopLoader={() => import('../desktop/SaoJoao')}
        mobileLoader={() => import('../mobile/SaoJoao')}
        fallback={<PageLoading />}
      />
    </ChunkErrorBoundary>
  );
};

export default SaoJoaoPage;
