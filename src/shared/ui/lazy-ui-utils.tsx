import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading fallback for UI components
export const UIFallback = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  return (
    <div className="flex items-center justify-center p-2">
      <Loader2 className={`animate-spin text-muted-foreground ${sizeClasses[size]}`} />
    </div>
  );
};

// HOC for lazy loading with suspense
// eslint-disable-next-line react-refresh/only-export-components
export function withLazyLoading<T extends ComponentType<object>>(
  LazyComponent: T,
  fallbackSize: 'sm' | 'md' | 'lg' = 'sm'
) {
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={<UIFallback size={fallbackSize} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `Lazy(${LazyComponent.displayName || LazyComponent.name})`;
  return WrappedComponent;
}
