import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
import { PageLoading } from '@/shared/ui/page-loading';

const ReveillonPage = () => {
  return (
    <ChunkErrorBoundary>
      <ConditionalLazy
        desktopLoader={() => import('../desktop/Reveillon')}
        mobileLoader={() => import('../mobile/Reveillon')}
        fallback={<PageLoading />}
      />
    </ChunkErrorBoundary>
  );
};

export default ReveillonPage;
