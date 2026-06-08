import { Card, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Package, DollarSign, FileText, Calendar, TrendingUp, Activity, MapPin, ChevronRight } from "lucide-react";
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
import { format, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

// =====================================================================
// Stats cards
// =====================================================================
type StatCard = {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
};

const StatCardView = ({ stat, index }: { stat: StatCard; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft-sm transition-shadow hover:shadow-soft-md md:p-6"
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
        {stat.label}
      </p>
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
        stat.accent ? "bg-primary-soft text-primary" : "bg-sunken text-text-secondary"
      )}>
        {stat.icon}
      </div>
    </div>
    <p className={cn(
      "mt-4 text-2xl font-bold tracking-tight md:text-3xl",
      stat.accent ? "text-primary" : "text-text-primary"
    )}>
      {stat.value}
    </p>
    <p className="mt-1.5 text-xs text-text-secondary">
      {stat.description}
    </p>
  </motion.div>
);

// =====================================================================
// Activity item
// =====================================================================
const ActivityItem = ({ activity }: { activity: Activity }) => (
  <div className="flex items-start gap-3">
    <div className={cn(
      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
      activity.tipo === 'solicitacao' ? "bg-primary" : "bg-tech-blue"
    )} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-text-primary leading-snug">
        {activity.descricao}
      </p>
      <p className="mt-0.5 text-[10px] text-text-tertiary font-semibold uppercase tracking-wider">
        {formatTimeAgo(activity.data)}
      </p>
    </div>
  </div>
);

// =====================================================================
// Evento card
// =====================================================================
const EventoCard = ({ evento, onClick }: { evento: EventoResumo; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-left shadow-soft-sm transition-colors hover:bg-sunken md:p-4"
  >
    <div className="flex items-center gap-3 md:gap-4 min-w-0">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-sunken">
        <span className="text-[9px] font-bold uppercase text-primary leading-none mb-0.5">
          {evento.data ? format(parseISO(evento.data), "MMM", { locale: ptBR }) : "—"}
        </span>
        <span className="text-base font-bold leading-none text-text-primary">
          {evento.data ? format(parseISO(evento.data), "dd") : "—"}
        </span>
      </div>
      <div className="flex flex-col min-w-0">
        <p className="truncate text-sm font-semibold leading-tight text-text-primary md:text-base">
          {evento.nome}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{evento.local}</span>
        </p>
      </div>
    </div>
    <ChevronRight className="h-5 w-5 shrink-0 text-text-tertiary transition-colors group-hover:text-text-primary" />
  </button>
);

// =====================================================================
// Data fetching
// =====================================================================
type Activity = {
  id: string;
  tipo: 'solicitacao' | 'orcamento';
  descricao: string;
  data: string;
  status: string;
};

const fetchDashboardData = async () => {
  const { data: produtos, error: produtosError } = await supabase
    .from('produtos')
    .select('quantidade_disponivel, valor_compra, valor_venda, ativo');

  if (produtosError) throw produtosError;

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { data: orcamentos, error: orcamentosError } = await supabase
    .from('orcamentos')
    .select('valor_total, status, created_at')
    .gte('created_at', inicioMes.toISOString());

  if (orcamentosError) throw orcamentosError;

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

  let solicitacoes: Array<{ id: string; nome_completo: string; tipo_solicitacao: string; created_at: string }> = [];

  if (hasLeadsSource && supabaseLeads) {
    const { data, error } = await supabaseLeads
      .from('lead_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      if (import.meta.env.DEV) console.warn('[Dashboard] lead_submissions indisponível:', error.message);
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

    if (!solicitacoesError && solicitacoesData) {
      solicitacoes = solicitacoesData;
    }
  }

  const produtosAtivos = produtos?.filter(p => p.ativo) || [];
  const valorEstoque = produtosAtivos.reduce((sum, p) => sum + (p.valor_compra * p.quantidade_disponivel), 0);
  const valorTotalEstoque = produtosAtivos.reduce((sum, p) => sum + (p.valor_venda * p.quantidade_disponivel), 0);

  const orcamentosConfirmados = orcamentos?.filter((o) => normalizeOrcamentoStatus(o.status) === 'confirmado') || [];
  const valorOrcamentosDoMes = orcamentosConfirmados.reduce((sum, o) => sum + (o.valor_total || 0), 0);

  const eventosHojeCount = eventos.filter((evento) => {
    if (!evento.data) return false;
    return isToday(parseISO(evento.data));
  }).length;

  const atividades: Activity[] = [
    ...(solicitacoes?.map(s => ({
      id: s.id,
      tipo: 'solicitacao' as const,
      descricao: `Nova solicitação de ${s.nome_completo}`,
      data: s.created_at,
      status: 'pendente'
    })) || []),
    ...(orcamentos?.slice(0, 5).map((o, index) => ({
      id: `${o.created_at || 'sem-data'}-${index}`,
      tipo: 'orcamento' as const,
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

const formatBRL = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

// =====================================================================
// Component
// =====================================================================
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

  const stats = data?.stats || {
    totalProdutos: 0, valorTotalEstoque: 0, valorEstoque: 0, orcamentosDoMes: 0,
    valorOrcamentosDoMes: 0, eventosDoMes: 0, eventosHoje: 0, solicitacoesPendentes: 0
  };
  const eventosProximos = data?.eventosProximos || [];
  const recentActivities = data?.recentActivities || [];

  const statCards: StatCard[] = [
    {
      label: "Estoque ativo",
      value: String(stats.totalProdutos),
      description: "Produtos disponíveis em catálogo",
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Investimento",
      value: formatBRL(stats.valorEstoque),
      description: "Custo total de aquisição",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      label: "Receita potencial",
      value: formatBRL(stats.valorTotalEstoque),
      description: "Projeção de vendas brutas",
      icon: <TrendingUp className="h-4 w-4" />,
      accent: true,
    },
    {
      label: "Leads novos",
      value: String(stats.solicitacoesPendentes),
      description: "Aguardando atendimento",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Activity className="h-8 w-8 animate-pulse text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-5 md:space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary md:text-2xl">Visão geral</h1>
            <p className="text-xs text-text-secondary md:text-sm">
              Acompanhe o desempenho em tempo real
            </p>
          </div>
          {isRefetching && (
            <Activity className="h-4 w-4 animate-pulse text-text-tertiary shrink-0" />
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <StatCardView key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-7">
          {/* Próximos eventos */}
          <section className="space-y-3 lg:col-span-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-tertiary">
                Próximos eventos
              </h2>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/admin/eventos')}
                className="h-auto p-0 text-xs font-semibold text-primary"
              >
                Ver agenda
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            {eventosProximos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
                <Calendar className="mx-auto h-8 w-8 text-text-tertiary" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                  Agenda vazia
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {eventosProximos.map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    onClick={() => navigate('/admin/eventos')}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Atividades recentes */}
          <section className="space-y-3 lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-tertiary px-1">
              Atividades recentes
            </h2>
            <Card className="rounded-xl border-border shadow-soft-sm bg-card">
              <CardContent className="p-5">
                {recentActivities.length === 0 ? (
                  <p className="py-8 text-center text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                    Sem atividade
                  </p>
                ) : (
                  <div className="space-y-5">
                    {recentActivities.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
