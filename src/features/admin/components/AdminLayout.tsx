import { ReactNode, useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import {
  Home,
  Search,
  Package,
  FileText,
  Calendar,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/admin/contexts/AuthContextSimple";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@shared/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Início", path: "/admin/dashboard", description: "Visão geral" },
    { icon: Search, label: "Consulta", path: "/admin/produtos", description: "Catálogo" },
    { icon: Package, label: "Estoque", path: "/admin/estoque", description: "Inventário" },
    { icon: FileText, label: "Propostas", path: "/admin/orcamentos", description: "Orçamentos" },
    { icon: Calendar, label: "Agenda", path: "/admin/eventos", description: "Eventos" },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Fecha drawer com ESC
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Trava scroll do body quando drawer está aberto
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[AdminLayout] signOut falhou:', error);
      }
    } finally {
      navigate("/admin/login");
    }
  };

  const bottomNavItems = [
    { icon: Home, label: "Início", path: "/admin/dashboard" },
    { icon: Search, label: "Consulta", path: "/admin/produtos" },
    { icon: FileText, label: "Propostas", path: "/admin/orcamentos" },
    { icon: Package, label: "Estoque", path: "/admin/estoque" },
  ];

  // Detecta rota ativa (mesma lógica do drawer)
  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const currentTitle = menuItems.find((m) => isActive(m.path))?.label || "Admin";

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-app text-text-primary">
      {/* TOP HEADER — branco limpo com borda warm gray */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-soft-sm md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          {/* Logo M5 com fundo laranja (marca) */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-soft-sm">
            M5
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-text-primary">M5 Max Produções</p>
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Painel Administrativo</p>
          </div>
        </div>

        {/* Título da seção atual (mobile) */}
        <div className="sm:hidden">
          <h1 className="text-sm font-semibold text-text-primary">{currentTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notificações"
            className="touch-target flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-sunken hover:text-text-primary"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-3 pl-3 ml-1 border-l border-border">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {(userData?.nome || "A").charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-text-primary leading-tight">{userData?.nome || "Admin"}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-tertiary leading-tight">{userData?.role || "Operador"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO — com padding-bottom pra bottom nav */}
      <main className="relative z-10 flex-1 pb-24 md:pb-6">
        <div className="admin-layout-scroll h-[calc(100dvh-3.5rem)] overflow-y-auto scrollbar-thin px-4 py-4 md:h-[calc(100dvh-4rem)] md:px-8 md:py-6">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION (Mobile) — fixed, com safe area, branco com borda warm gray */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card px-2 shadow-soft-lg md:hidden pb-[env(safe-area-inset-bottom)]"
      >
        {bottomNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={cn(
                "touch-target relative flex h-full min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-colors",
                active ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "scale-110")} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
              {active && (
                <motion.span
                  layoutId="bottom-indicator"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu completo"
          className="touch-target flex h-full min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-text-secondary transition-colors hover:text-text-primary"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] font-semibold tracking-wide">Menu</span>
        </button>
      </nav>

      {/* BOTTOM NAVIGATION (Desktop) — horizontal top abaixo do header */}
      <nav
        aria-label="Navegação desktop"
        className="hidden md:block sticky top-14 z-20 border-b border-border bg-card"
        style={{ top: "3.5rem" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-4 lg:px-8">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "touch-target relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MENU DRAWER (fullscreen mobile, side desktop) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-charcoal-900/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-sm flex-col border-l border-border bg-card shadow-soft-xl"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-text-tertiary uppercase">Navegação</p>
                  <p className="text-sm font-semibold text-text-primary">Menu completo</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="touch-target flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-sunken hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 transition-colors",
                        active
                          ? "bg-primary-soft text-primary"
                          : "text-text-primary hover:bg-sunken"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          active ? "bg-primary text-primary-foreground" : "bg-sunken text-text-secondary"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-tight">{item.label}</p>
                          <p className="text-xs text-text-secondary leading-tight">{item.description}</p>
                        </div>
                      </div>
                      {active && <ChevronRight className="h-4 w-4 text-primary" />}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-3 border-t border-border p-4">
                <div className="flex items-center gap-3 rounded-lg bg-sunken p-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {(userData?.nome || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{userData?.nome || "Administrador"}</p>
                    <p className="text-xs text-text-secondary truncate">{userData?.role || "Operador"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair do painel
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
