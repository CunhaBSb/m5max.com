import { ChunkErrorBoundary } from '@/shared/ui/ChunkErrorBoundary';
import { ConditionalLazy } from '@/shared/layout/switchers/ConditionalLazy';
import { PageLoading } from '@/shared/ui/page-loading';

const ProdutosPage = () => {
  return (
    <ChunkErrorBoundary>
      <ConditionalLazy
        desktopLoader={() => import('../desktop/Produtos')}
        mobileLoader={() => import('../mobile/Produtos')}
        fallback={<PageLoading />}
      />
    </ChunkErrorBoundary>
  );
};

export default ProdutosPage;