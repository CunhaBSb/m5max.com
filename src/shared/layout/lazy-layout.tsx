import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Layout-specific loading fallback
const LayoutFallback = ({ height = 'auto' }: { height?: string }) => (
  <div className={`flex items-center justify-center py-8 ${height === 'screen' ? 'min-h-screen' : ''}`}>
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-fire-orange mx-auto" />
      <p className="text-sm text-muted-foreground">Carregando seção...</p>
    </div>
  </div>
);

// HOC for layout components with appropriate fallbacks
function withLayoutLoading<T extends React.ComponentType<object>>(
  LazyComponent: T,
  fallbackHeight: string = 'auto'
) {
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LayoutFallback height={fallbackHeight} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `LazyLayout(${(LazyComponent as React.ComponentType).displayName || LazyComponent.name})`;
  return WrappedComponent;
}

// Export HOC and lazy-loaded components
export const LazyServices = withLayoutLoading(lazy(() => import('./Services')));
export const LazyFAQ = withLayoutLoading(lazy(() => import('./FAQ')));
export const LazyFogosM5Complete = withLayoutLoading(lazy(() => import('./FogosM5Complete')));
export const LazyFooter = withLayoutLoading(lazy(() => import('./Footer')));
export const LazyLeadMagnet = withLayoutLoading(lazy(() => import('./LeadMagnet')));
export const LazyDifferentialsSection = withLayoutLoading(lazy(() => import('./DifferentialsSection')));
