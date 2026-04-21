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
    { icon: Home, label: "INÍCIO", path: "/admin/dashboard" },
    { icon: Search, label: "CONSULTA", path: "/admin/produtos" },
    { icon: Package, label: "ESTOQUE", path: "/admin/estoque" },
    { icon: FileText, label: "PROPOSTAS", path: "/admin/orcamentos" },
    { icon: Calendar, label: "AGENDA", path: "/admin/eventos" },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const bottomNavItems = [
    { icon: Search, label: "Consulta", path: "/admin/produtos" },
    { icon: FileText, label: "Propostas", path: "/admin/orcamentos" },
    { icon: Calendar, label: "Agenda", path: "/admin/eventos" },
  ];

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-[#fafafa] selection:bg-primary/20">
      {/* Ultra Subtle Vercel-like Background Glow (pure black mostly) */}
      <div className="pointer-events-none absolute top-[-20%] left-[50%] z-0 h-[500px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/[0.03] blur-[100px]" />

      {/* ÁREA DE CONTEÚDO */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <div className="admin-layout-scroll absolute inset-0 overflow-y-auto scrollbar-thin px-4 pt-4 md:px-10 md:pt-8">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION (PREMIUM WHATSAPP BUSINESS / LINEAR STYLE) */}
      <nav
        className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex h-[4.25rem] max-w-[400px] items-center justify-around rounded-[24px] border border-white/[0.06] bg-[#0a0a0a]/90 px-2 pb-safe-bottom shadow-2xl backdrop-blur-xl md:inset-x-0 md:bottom-0 md:h-16 md:max-w-none md:justify-center md:gap-8 md:rounded-none md:border-x-0 md:border-b-0 md:border-t md:bg-black/80"
      >
        {bottomNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex h-full min-w-[64px] flex-col items-center justify-center gap-1.5 transition-colors duration-300 px-3 md:flex-row md:gap-2",
                isActive ? "text-primary" : "text-white/40 hover:text-white/80"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-105")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide md:text-xs">
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-indicator"
                  className="absolute top-1 md:-top-[1px] h-[3px] w-8 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(249,115,22,0.4)] md:w-full" 
                />
              )}
            </Link>
          );
        })}
        
        {/* Menu Hamburger na Bottom Bar */}
        <button
          onClick={() => setMenuOpen(true)}
          className="relative flex h-full min-w-[64px] flex-col items-center justify-center gap-1.5 px-3 text-white/40 transition-colors duration-300 hover:text-white/80 md:flex-row md:gap-2"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
          <span className="text-[10px] font-medium tracking-wide md:text-xs">Menu</span>
        </button>
      </nav>

      {/* MENU DRAWER (MINIMALIST & CLEAN) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[110] w-full max-w-sm border-l border-white/[0.05] bg-[#050505] shadow-2xl p-6 flex flex-col md:w-[400px]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">Navegação</span>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-thin">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl transition-all group",
                      location.pathname.startsWith(item.path)
                        ? "bg-white/[0.06] text-white"
                        : "text-white/50 hover:bg-white/[0.03] hover:text-white/90"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={cn("h-4.5 w-4.5", location.pathname.startsWith(item.path) && "text-primary")} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {location.pathname.startsWith(item.path) && (
                      <ChevronRight className="h-4 w-4 text-primary opacity-50" />
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/[0.05] space-y-5">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white/80 font-medium">
                    {(userData?.nome || "A").charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white/90">{userData?.nome || "Administrador"}</p>
                    <p className="text-xs text-white/40">{userData?.role || "Operador"}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start px-4 font-medium"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair da Conta
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
