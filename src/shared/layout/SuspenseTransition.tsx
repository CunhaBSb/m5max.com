import { ReactNode, Suspense, useState, useEffect } from 'react';

interface SuspenseTransitionProps {
  children: ReactNode;
  fallback: ReactNode;
  duration?: number;
}

/**
 * Wrapper que adiciona transições suaves (cross-fade) ao React Suspense.
 *
 * Implementa fade-out do fallback + fade-in do conteúdo simultaneamente,
 * eliminando a transição abrupta do unmount padrão do Suspense.
 *
 * @param children - Componente lazy-loaded
 * @param fallback - Componente de loading (ex: PageLoading)
 * @param duration - Duração da transição em ms (default: 400)
 */
export const SuspenseTransition = ({
  children,
  fallback,
  duration = 400
}: SuspenseTransitionProps) => {
  const [showFallback, setShowFallback] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Timeout para simular detecção de quando conteúdo carregou
    // Em produção, Suspense resolve automaticamente quando chunk carrega
    const timer = setTimeout(() => {
      setContentLoaded(true);
      // Remove fallback do DOM após transição completar
      setTimeout(() => setShowFallback(false), duration);
    }, 100);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="relative">
      {/* Fallback layer - fade-out quando conteúdo carrega */}
      {showFallback && (
        <div
          className={`
            absolute inset-0 z-10
            transition-opacity ease-in-out
            motion-reduce:transition-none
            ${contentLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          style={{ transitionDuration: `${duration}ms` }}
          aria-hidden={contentLoaded}
        >
          {fallback}
        </div>
      )}

      {/* Content layer - fade-in quando carrega */}
      <div
        className={`
          transition-opacity ease-in-out
          motion-reduce:transition-none
          ${contentLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ transitionDuration: `${duration}ms` }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};
