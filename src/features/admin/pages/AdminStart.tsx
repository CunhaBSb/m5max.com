import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@shared/ui/button";
import { useAuth } from "@/features/admin/contexts/AuthContextSimple";

const AdminStart = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/admin/produtos", { replace: true });
    }
  }, [loading, navigate, user]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app px-4 py-10 sm:px-6"
      style={{
        paddingTop: "max(2.5rem, calc(1.25rem + env(safe-area-inset-top)))",
        paddingBottom: "max(2.5rem, calc(1.25rem + env(safe-area-inset-bottom)))",
      }}
    >
      {/* Gradiente sutil laranja no topo, como detalhe de marca */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(18_88%_52%/0.10),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-primary-soft to-transparent" />

      <main className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft-xl sm:p-8">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-border-subtle bg-app shadow-soft-sm">
          <img
            src="/Logo%20sem%20Fundo.png"
            alt="M5 MAX"
            className="h-16 w-16 object-contain"
            loading="eager"
          />
        </div>

        <div className="space-y-3 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-text-tertiary">M5 MAX PRODUCOES</p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-text-primary">
            Painel Administrativo
          </h1>
          <p className="text-sm leading-relaxed text-text-primary/85">
            Versao web preparada para abrir como app no iOS, com navegacao otimizada para operacao mobile.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border border-border-subtle bg-app p-4">
          <div className="flex items-center gap-3 text-sm text-text-primary">
            <ShieldCheck className="h-4 w-4 text-success" />
            Sessao segura e integrada ao Supabase.
          </div>
          <div className="flex items-center gap-3 text-sm text-text-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            Interface otimizada para uso em campo.
          </div>
          <div className="flex items-center gap-3 text-sm text-text-primary">
            <Smartphone className="h-4 w-4 text-tech-blue" />
            iPhone: Safari &gt; Compartilhar &gt; Adicionar a Tela de Inicio.
          </div>
        </div>

        <Button
          onClick={() => navigate("/admin/login")}
          className="mt-8 h-12 w-full rounded-xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-primary-foreground hover:bg-primary/90 shadow-soft-sm"
        >
          Entrar no Painel
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </main>
    </div>
  );
};

export default AdminStart;
