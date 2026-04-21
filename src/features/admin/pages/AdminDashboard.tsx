import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Package, DollarSign, FileText, Calendar, TrendingUp, Activity, Eye, ShoppingCart, Zap, Clock, MapPin, ChevronRight } from "lucide-react";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { supabase } from "@/features/admin/lib/supabase";
import { supabaseLeads, hasLeadsSource, mapLeadToSolicitacao } from "@/features/admin/lib/supabase-leads";
import {
  getOrcamentoStatusMeta,
  mapOrcamentoToEventoResumo,
  normalizeOrcamentoStatus,
  type EventoResumo,
} from "@/features/admin/modules/orcamentos";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isToday, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

// Função isolada para o React Query buscar os dados do Dashboard
const fetchDashboardData = async () => {
  // Buscar produtos
  const { data: produtos, error: produtosError } = await supabase
    .from('produtos')
    .select('quantidade_disponivel, valor_compra, valor_venda, ativo');

  if (produtosError) throw produtosError;

  // Buscar orçamentos do mês atual
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const { data: orcamentos, error: orcamentosError } = await supabase
    .from('orcamentos')
    .select('valor_total, status, created_at')
    .gte('created_at', inicioMes.toISOString());

  if (orcamentosError) throw orcamentosError;

  // Buscar próximos eventos a partir da data local de hoje
  const hoje = new Date();
  const hojeLocal = format(hoje, "yyyy-MM-dd");
  
  const { data: eventosData, error: eventosError } = await supabase
    .from('orcamentos')
    .select('id, evento_nome, evento_data, evento_local, nome_contratante, status')
    .not('evento_data', 'is', null)
    .gte('evento_data', hojeLocal)
    .order('evento_data', { ascending: true });

  if (eventosError) throw eventosError;

  const eventos = (eventosData || [])
    .map(mapOrcamentoToEventoResumo)
    .filter((evento) => evento.status !== "cancelado" && Boolean(evento.data));

  // Buscar solicitações pendentes
  let solicitacoes: Array<{ id: string; nome_completo: string; tipo_solicitacao: string; created_at: string }> = [];

  if (hasLeadsSource && supabaseLeads) {
    const { data, error } = await supabaseLeads
      .from('lead_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('[Dashboard] lead_submissions indisponível:', error.message);
    } else if (data) {
      solicitacoes = data.map(mapLeadToSolicitacao) as typeof solicitacoes;
    }
  } else {
    const { data: solicitacoesData, error: solicitacoesError } = await supabase
      .from('solicitacoes_orcamento')
      .select('id, nome_completo, tipo_solicitacao, created_at')
      .eq('enviado_email', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (solicitacoesError) {
      console.warn('[Dashboard] solicitacoes_orcamento indisponível:', solicitacoesError.message);
    } else if (solicitacoesData) {
      solicitacoes = solicitacoesData;
    }
  }

  // Cálculos
  const produtosAtivos = produtos?.filter(p => p.ativo) || [];
  const valorEstoque = produtosAtivos.reduce((sum, p) => sum + (p.valor_compra * p.quantidade_disponivel), 0);
  const valorTotalEstoque = produtosAtivos.reduce((sum, p) => sum + (p.valor_venda * p.quantidade_disponivel), 0);
  
  const orcamentosConfirmados = orcamentos?.filter((o) => normalizeOrcamentoStatus(o.status) === 'confirmado') || [];
  const valorOrcamentosDoMes = orcamentosConfirmados.reduce((sum, o) => sum + (o.valor_total || 0), 0);
  
  const eventosHojeCount = eventos.filter((evento) => {
    if (!evento.data) return false;
    return isToday(parseISO(evento.data));
  }).length;

  const atividades = [
    ...(solicitacoes?.map(s => ({
      id: s.id,
      tipo: 'solicitacao',
      descricao: `Nova solicitação de ${s.nome_completo}`,
      data: s.created_at,
      status: 'pendente'
    })) || []),
    ...(orcamentos?.slice(0, 5).map((o, index) => ({
      id: `${o.created_at || 'sem-data'}-${index}`,
      tipo: 'orcamento',
      descricao: `Orçamento ${getOrcamentoStatusMeta(o.status).label.toLowerCase()}`,
      data: o.created_at || new Date().toISOString(),
      status: normalizeOrcamentoStatus(o.status)
    })) || [])
  ]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 8);

  return {
    stats: {
      totalProdutos: produtosAtivos.length,
      valorTotalEstoque,
      valorEstoque,
      orcamentosDoMes: orcamentos?.length || 0,
      valorOrcamentosDoMes,
      eventosDoMes: eventos.length,
      eventosHoje: eventosHojeCount,
      solicitacoesPendentes: solicitacoes?.length || 0
    },
    eventosProximos: eventos.slice(0, 5),
    recentActivities: atividades
  };
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Há poucos minutos';
  if (diffInHours === 1) return 'Há 1 hora';
  if (diffInHours < 24) return `Há ${diffInHours} horas`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Há 1 dia';
  return `Há ${diffInDays} dias`;
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardData,
    staleTime: 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });

  // Fallback seguro
  const stats = data?.stats || {
    totalProdutos: 0, valorTotalEstoque: 0, valorEstoque: 0, orcamentosDoMes: 0,
    valorOrcamentosDoMes: 0, eventosDoMes: 0, eventosHoje: 0, solicitacoesPendentes: 0
  };
  const eventosProximos = data?.eventosProximos || [];
  const recentActivities = data?.recentActivities || [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Activity className="h-8 w-8 animate-pulse text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Dashboard Intelligence Cards - Zara/Stripe Standard */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] p-5 sm:p-7"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">
                Estoque Ativo
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none">
                {stats.totalProdutos}
              </div>
              <span className="text-zinc-600 text-xs font-medium mt-3 tracking-tight">
                Produtos disponíveis em catálogo
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] p-5 sm:p-7"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">
                Investimento
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none">
                R$ {stats.valorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <span className="text-zinc-600 text-xs font-medium mt-3 tracking-tight">
                Custo total de aquisição de ativos
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] p-5 sm:p-7"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
                  Receita Potencial
                </span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tighter leading-none">
                R$ {stats.valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <span className="text-zinc-600 text-xs font-medium mt-3 tracking-tight">
                Projeção total de vendas brutas
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] p-5 sm:p-7"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">
                Leads Novos
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none">
                {stats.solicitacoesPendentes}
              </div>
              <span className="text-zinc-600 text-xs font-medium mt-3 tracking-tight">
                Aguardando atendimento imediato
              </span>
            </div>
          </motion.div>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 gap-5 pt-2 sm:gap-8 sm:pt-4 lg:grid-cols-7">
          <div className="space-y-5 sm:space-y-6 lg:col-span-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 ml-2">Próximos Eventos</h3>
            <div className="space-y-3">
              {eventosProximos.length === 0 ? (
                <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[32px]">
                   <p className="text-zinc-600 text-sm font-medium uppercase tracking-widest">Agenda vazia</p>
                </div>
              ) : (
                eventosProximos.map((evento) => (
                  <div key={evento.id} className="group flex items-center justify-between rounded-[24px] border border-white/5 bg-white/[0.02] p-4 sm:p-6 transition-all hover:bg-white/[0.04]">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#050505] shadow-lg sm:h-14 sm:w-14">
                        <span className="text-[10px] font-black text-primary uppercase leading-none mb-1">{format(parseISO(evento.data), "MMM", { locale: ptBR })}</span>
                        <span className="text-xl font-black leading-none text-white">{format(parseISO(evento.data), "dd")}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="truncate text-base sm:text-lg font-black leading-tight text-white">{evento.nome}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1 font-medium">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{evento.local}</span>
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/eventos')} className="h-10 w-10 p-0 rounded-full hover:bg-white/5">
                      <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6 lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 ml-2">Log de Operações</h3>
            <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.01] p-5 sm:rounded-[32px] sm:p-8">
              <div className="space-y-8 relative">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={cn(
                      "mt-1.5 h-2 w-2 rounded-full",
                      activity.tipo === 'solicitacao' ? "bg-primary shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/90 leading-tight">{activity.descricao}</p>
                      <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase tracking-widest">
                        {formatTimeAgo(activity.data)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
