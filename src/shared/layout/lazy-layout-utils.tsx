import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Layout-specific loading fallback
export const LayoutFallback = ({ height = 'auto' }: { height?: string }) => (
  <div className={`flex items-center justify-center py-8 ${height === 'screen' ? 'min-h-screen' : ''}`}>
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-fire-orange mx-auto" />
      <p className="text-sm text-muted-foreground">Carregando seção...</p>
    </div>
  </div>
);

// HOC for layout components with appropriate fallbacks
// eslint-disable-next-line react-refresh/only-export-components
export function withLayoutLoading<T extends React.ComponentType<object>>(
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
