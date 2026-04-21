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
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10 sm:px-6"
      style={{
        paddingTop: "max(2.5rem, calc(1.25rem + env(safe-area-inset-top)))",
        paddingBottom: "max(2.5rem, calc(1.25rem + env(safe-area-inset-bottom)))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-primary/10 to-transparent" />

      <main className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-black/60 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-8">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03] shadow-2xl">
          <img
            src="/Logo%20sem%20Fundo.png"
            alt="M5 MAX"
            className="h-16 w-16 object-contain"
            loading="eager"
          />
        </div>

        <div className="space-y-3 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-primary">M5 MAX PRODUCOES</p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white">
            Painel Administrativo
          </h1>
          <p className="text-sm text-white/55">
            Versao web preparada para abrir como app no iOS, com navegacao otimizada para operacao mobile.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Sessao segura e integrada ao Supabase.
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-primary" />
            Interface otimizada para uso em campo.
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Smartphone className="h-4 w-4 text-blue-400" />
            iPhone: Safari {" > "} Compartilhar {" > "} Adicionar a Tela de Inicio.
          </div>
        </div>

        <Button
          onClick={() => navigate("/admin/login")}
          className="mt-8 h-12 w-full rounded-xl bg-primary text-[11px] font-black uppercase tracking-[0.22em] text-white hover:bg-primary/90"
        >
          Entrar no Painel
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </main>
    </div>
  );
};

export default AdminStart;
