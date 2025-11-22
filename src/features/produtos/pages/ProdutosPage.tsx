import { lazy, Suspense } from 'react';
import { PlatformSwitch } from '@/shared/layout/switchers/PlatformSwitch';

// Lazy load desktop and mobile versions
const ProdutosDesktop = lazy(() => import('../desktop/Produtos'));
const ProdutosMobile = lazy(() => import('../mobile/Produtos'));

// Loading fallback component - discreto
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <div className="text-center">
      <img 
        src="/m5logo.svg" 
        alt="M5 Max" 
        className="w-12 h-12 mx-auto opacity-80 animate-pulse" 
      />
    </div>
  </div>
);

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