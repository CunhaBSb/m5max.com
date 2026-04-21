import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Loader2, ShieldCheck } from "lucide-react";
import { AuthProvider } from "@/features/admin/contexts/AuthContextSimple";
import { PrivateRoute } from "@/features/admin/components/PrivateRoute";
import { ErrorBoundary } from "@/features/admin/components/ErrorBoundary";

import AdminStart from "@/features/admin/pages/AdminStart";
import AdminLogin from "@/features/admin/pages/AdminLogin";
import AcessoNegado from "@/features/admin/pages/AcessoNegado";

const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const AdminProdutos = lazy(() => import("@/features/admin/pages/AdminProdutos"));
const AdminEstoque = lazy(() => import("@/features/admin/pages/AdminEstoque"));
const AdminOrcamentos = lazy(() => import("@/features/admin/pages/AdminOrcamentos"));
const AdminEventos = lazy(() => import("@/features/admin/pages/AdminEventos"));

const AdminRouteLoading = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl rounded-3xl border border-border/60 bg-card/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Painel Administrativo
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Carregando modulo do admin
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Preparando dashboard, permissoes e dados do painel.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/50 bg-background/60 p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {index === 0 && <LayoutDashboard className="h-5 w-5" />}
                  {index === 1 && <ShieldCheck className="h-5 w-5" />}
                  {index === 2 && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                  <div className="h-2.5 w-32 animate-pulse rounded-full bg-muted/70" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded-full bg-muted/80" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted/60" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AdminRouteContent = () => {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<AdminRouteLoading />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};

const AdminShell = () => (
  <PrivateRoute allowedRoles={["admin"]}>
    <AdminRouteContent />
  </PrivateRoute>
);

export const AdminRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<AdminStart />} />
      <Route path="login" element={<AdminLogin />} />
      <Route path="acesso-negado" element={<AcessoNegado />} />
      
      <Route path="" element={<AdminShell />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProdutos />} />
        <Route path="estoque" element={<AdminEstoque />} />
        <Route path="orcamentos" element={<AdminOrcamentos />} />
        <Route path="eventos" element={<AdminEventos />} />
        <Route index element={<Navigate to="produtos" replace />} />
      </Route>
    </Routes>
  </AuthProvider>
);
