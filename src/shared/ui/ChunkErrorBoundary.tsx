import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for lazy chunk loading failures.
 *
 * Handles common scenarios:
 * - Network failure during chunk fetch
 * - Chunk file missing after deployment
 * - Browser cache issues
 *
 * Provides retry capability to recover from transient failures.
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a chunk loading error
    const isChunkError =
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      return { hasError: true, error };
    }

    // Re-throw non-chunk errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Chunk loading error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    // Clear error state and reload page to fetch fresh chunks
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }

      // Default error UI with M5 branding
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
          <div className="text-center px-4 max-w-md animate-in fade-in-0 duration-500">
            <img
              src="/m5logo.svg"
              alt="M5 Max"
              className="w-16 h-16 mx-auto mb-6 opacity-60"
              style={{ willChange: 'opacity' }}
            />
            <h2 className="text-xl font-semibold text-white mb-3">
              Erro ao carregar página
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Ocorreu um problema ao carregar o conteúdo.
              Isso pode ter sido causado por uma conexão lenta ou atualização do site.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-fire-orange hover:bg-fire-orange/90 text-white rounded-lg font-medium transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
