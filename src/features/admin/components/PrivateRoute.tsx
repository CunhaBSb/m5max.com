import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/admin/contexts/AuthContextSimple';
import { Loader2, ShieldAlert } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const PrivateRoute = ({ children, allowedRoles = ['admin'] }: PrivateRouteProps) => {
  const { user, userData, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação ou carrega dados do usuário
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="flex max-w-md flex-col items-center space-y-4 rounded-2xl border border-border/60 bg-card/60 p-8 text-center shadow-xl backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Verificando autenticação e permissões do painel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="flex max-w-md flex-col items-center space-y-4 rounded-2xl border border-amber-500/20 bg-card/60 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">Perfil do admin nao encontrado</h1>
            <p className="text-sm text-muted-foreground">
              A sessao existe, mas o registro do usuario em <code>usuarios</code> nao foi carregado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/admin/acesso-negado" replace />;
  }
  
  return <>{children}</>;
};
