import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';
import { PageLoading } from '@/shared/ui/page-loading';

// Lazy load desktop and mobile versions
const ProdutosDesktop = lazy(() => import('../desktop/Produtos'));
const ProdutosMobile = lazy(() => import('../mobile/Produtos'));

const ProdutosPage = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <PlatformSwitch
        desktop={<ProdutosDesktop />}
        mobile={<ProdutosMobile />}
      />
    </Suspense>
  );
};

export default ProdutosPage;