import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@shared/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-card/40 backdrop-blur-sm border border-border shadow-sm rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">Ops! Algo deu errado.</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Ocorreu um erro inesperado na aplicação. Nossa equipe técnica já foi notificada nos logs do sistema.
            </p>
            
            {this.state.error && (
              <div className="bg-background/50 border border-border rounded-lg p-4 mb-6 text-left overflow-auto max-h-32">
                <code className="text-xs text-destructive/80 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReset} className="w-full h-11 font-semibold">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/dashboard'} className="w-full h-11 border-border hover:bg-white/5">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Se o problema persistir, <a href="mailto:suporte@m5max.com.br" className="text-primary hover:underline font-medium">contate o Suporte TI</a>.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
