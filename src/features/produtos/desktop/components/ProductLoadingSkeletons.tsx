import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

// =============================================================================
// LOADING SKELETONS ESPECIALIZADOS
// =============================================================================

export const ProductCardSkeleton = ({ variant = 'festa' }: { variant?: 'festa' | 'revelacao' }) => (
  <Card className={`group relative backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
    variant === 'festa' 
      ? 'border-fire-orange/20 bg-fire-orange/5' 
      : 'border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-blue-500/5'
  }`}>
    <CardContent className="p-6">
      {/* Icon Skeleton */}
      <div className="text-center mb-6">
        <Skeleton className={`w-16 h-16 rounded-full mx-auto mb-4 ${
          variant === 'festa' ? 'bg-fire-orange/20' : 'bg-gradient-to-r from-pink-500/20 to-blue-500/20'
        }`} />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-full mx-auto" />
      </div>

      {/* Specs Skeletons */}
      <div className="space-y-3 mb-6">
        <div className="bg-accent/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="bg-accent/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Features Skeletons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      {/* Buttons Skeletons */}
      <div className="space-y-2">
        <Skeleton className={`h-9 w-full rounded-lg ${
          variant === 'festa' ? 'bg-fire-orange/20' : 'bg-pink-500/20'
        }`} />
        <Skeleton className="h-9 w-full rounded-lg bg-border/20" />
      </div>
    </CardContent>
  </Card>
);

export const ProductGridSkeleton = ({ 
  count = 8, 
  variant = 'festa' 
}: { 
  count?: number; 
  variant?: 'festa' | 'revelacao' 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} variant={variant} />
    ))}
  </div>
);

// =============================================================================
// ERROR STATES ESPECIALIZADOS
// =============================================================================

export const ProductErrorState = ({ 
  error, 
  onRetry, 
  variant = 'festa' 
}: { 
  error: { message?: string } | null; 
  onRetry: () => void; 
  variant?: 'festa' | 'revelacao' 
}) => (
  <div className="text-center py-12">
    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
      variant === 'festa' 
        ? 'bg-fire-orange/10 text-fire-orange' 
        : 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 text-pink-500'
    }`}>
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">Erro ao Carregar Produtos</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      {error?.message || 'Houve um problema ao conectar com nosso sistema. Tente novamente.'}
    </p>
    <button
      onClick={onRetry}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
        variant === 'festa'
          ? 'bg-fire-orange text-white hover:bg-fire-orange/90'
          : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Tentar Novamente
    </button>
  </div>
);

// =============================================================================
// LOADING STATES COM INDICADORES
// =============================================================================

export const ProductLoadingIndicator = ({ 
  variant = 'festa', 
  message = 'Carregando produtos...' 
}: { 
  variant?: 'festa' | 'revelacao'; 
  message?: string 
}) => (
  <div className="text-center py-8">
    <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-sm border ${
      variant === 'festa'
        ? 'bg-fire-orange/10 border-fire-orange/30 text-fire-orange'
        : 'bg-gradient-to-r from-pink-500/10 to-blue-500/10 border-pink-500/30 text-pink-500'
    }`}>
      <div className="flex space-x-1">
        <div className={`w-2 h-2 rounded-full animate-bounce ${
          variant === 'festa' ? 'bg-fire-orange' : 'bg-pink-500'
        }`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 rounded-full animate-bounce ${
          variant === 'festa' ? 'bg-fire-orange' : 'bg-pink-500'
        }`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 rounded-full animate-bounce ${
          variant === 'festa' ? 'bg-fire-orange' : 'bg-pink-500'
        }`} style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  </div>
);

// =============================================================================
// SUPABASE CONNECTION STATUS
// =============================================================================

export const SupabaseConnectionStatus = ({ 
  isConnected, 
  isLoading, 
  usingFallback 
}: { 
  isConnected: boolean; 
  isLoading: boolean; 
  usingFallback: boolean 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
        Conectando...
      </div>
    );
  }

  if (usingFallback) {
    return (
      <div className="flex items-center gap-2 text-xs text-orange-500">
        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
        Modo offline
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-green-500">
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
      Sistema online
    </div>
  );
};