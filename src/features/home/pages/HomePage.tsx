import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
import { PageLoading } from '@/shared/ui/page-loading';

const HomePage = () => {
  return (
    <ChunkErrorBoundary>
      <ConditionalLazy
        desktopLoader={() => import('../desktop/Home')}
        mobileLoader={() => import('../mobile/Home')}
        fallback={<PageLoading />}
      />
    </ChunkErrorBoundary>
  );
};

export default HomePage;