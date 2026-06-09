import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/table";
import { useToast } from "@/features/admin/hooks/use-toast";
import { Calendar, Plus, Activity, Users, Clock, CheckCircle, Loader2, Search, Eye, MapPin, Package, FileText, X } from "lucide-react";
import { supabase } from "@/features/admin/lib/supabase";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@shared/lib/utils";

type EventoCompleto = {
  id: string;
  orcamento_id: string | null;
  status: string | null;
  pdf_url: string | null;
  observacoes: string | null;
  confirmado_em: string | null;
  realizado_em: string | null;
  created_at: string | null;
  updated_at: string | null;
  orcamentos?: {
  id: string;
  evento_nome: string;
  evento_data: string;
  evento_hora: string | null;
  evento_local: string;
  nome_contratante: string;
  telefone: string | null;
  tipo: string;
  valor_total: number | null;
  orcamentos_produtos?: Array<{      id: string;
      quantidade: number;
      valor_unitario: number;
      valor_total: number;
      produtos?: {
        id: string;
        codigo: string;
        nome_produto: string;
        categoria: string;
        valor_venda: number;
        duracao_segundos: number | null;
      } | null;
    }>;
  } | null;
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState<EventoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<EventoCompleto | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      // Buscamos orçamentos em todos os status operacionais (Pendente, Confirmado, Realizado)
      // Limit + order sao obrigatorios para nao retornar todas as rows (custo + UX)
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          *,
          orcamentos_produtos (
            id,
            quantidade,
            valor_unitario,
            valor_total,
            produtos (
              id,
              codigo,
              nome_produto,
              categoria,
              valor_venda,
              duracao_segundos
            )
          )
        `)
        .in('status', ['pendente', 'confirmado', 'realizado'])
        .order('evento_data', { ascending: false })
        .limit(500);

      if (error) throw error;
      
      const hojeStr = new Date().toISOString().split('T')[0];

      // Mapeamos os dados com segurança
      const eventosMapeados: EventoCompleto[] = (data || [])
        .map(orc => ({
          id: orc.id,
          orcamento_id: orc.id,
          status: orc.status,
          pdf_url: null,
          observacoes: null,
          confirmado_em: orc.updated_at,
          realizado_em: orc.status === 'realizado' ? orc.updated_at : null,
          created_at: orc.created_at,
          updated_at: orc.updated_at,
          orcamentos: {
            id: orc.id,
            evento_nome: orc.evento_nome || 'Evento sem nome',
            evento_data: orc.evento_data || hojeStr,
            evento_hora: orc.evento_hora || null,
            evento_local: orc.evento_local || 'Local não informado',
            nome_contratante: orc.nome_contratante || 'Cliente não identificado',
            telefone: orc.telefone || null,
            tipo: orc.tipo || 'venda_artigos',
            valor_total: orc.valor_total || 0,
            orcamentos_produtos: orc.orcamentos_produtos || []
          }
        }))
        .sort((a, b) => {
          const d1 = a.orcamentos?.evento_data || '';
          const d2 = b.orcamentos?.evento_data || '';
          const t1 = a.orcamentos?.evento_hora || '00:00';
          const t2 = b.orcamentos?.evento_hora || '00:00';
          
          const isF1 = d1 >= hojeStr;
          const isF2 = d2 >= hojeStr;

          if (isF1 && !isF2) return -1;
          if (!isF1 && isF2) return 1;
          
          // Combina data e hora para ordenação precisa
          const full1 = `${d1}T${t1}`;
          const full2 = `${d2}T${t2}`;

          return isF1 ? full1.localeCompare(full2) : full2.localeCompare(full1);
        });

      setEventos(eventosMapeados);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro de rede ou banco.';
      if (import.meta.env.DEV) {
        console.error('❌ Erro Crítico:', error);
      }
      toast({
        title: "Erro na Agenda",
        description: `Não foi possível carregar os dados. Detalhes: ${message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleViewDetails = (evento: EventoCompleto) => {
    setSelectedEvento(evento);
    setIsDetailsOpen(true);
  };

  const filteredEventos = useMemo(() => {
    return eventos.filter(evento => {
      const matchSearch = 
        evento.orcamentos?.evento_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.orcamentos?.nome_contratante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.orcamentos?.evento_local?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || evento.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [eventos, searchTerm, statusFilter]);

  const estatisticas = useMemo(() => {
    return {
      total: eventos.length,
      hoje: eventos.filter(e => e.orcamentos?.evento_data && isToday(parseISO(e.orcamentos.evento_data))).length,
      pendentes: eventos.filter(e => e.status === 'pendente').length,
      confirmados: eventos.filter(e => e.status === 'confirmado').length,
      realizados: eventos.filter(e => e.status === 'realizado').length,
    };
  }, [eventos]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Sincronizando agenda operacional...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex min-h-full w-full max-w-[1400px] flex-col gap-8 mx-auto">
        <div className="flex-1 space-y-10">
          {/* Título e Stats (Centralizados e Paralelos) */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-5xl flex flex-col items-center gap-5 bg-app border border-border-subtle p-4 sm:p-8 rounded-[28px] sm:rounded-[40px] shadow-2xl backdrop-blur-md">
              <div className="admin-page-intro text-center space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="admin-page-title md:text-4xl"
                >
                  Agenda Operacional<span className="text-primary opacity-50">.</span>
                </motion.h1>
                <p className="admin-page-subtitle text-xs uppercase tracking-[0.3em] text-text-disabled">
                  Gestão tática de shows e montagens confirmadas
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <div className="flex-1 min-w-[104px] bg-sunken border border-border-subtle p-4 sm:p-5 rounded-[24px] sm:rounded-3xl flex flex-col items-center justify-center group hover:bg-sunken transition-all">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-[0.3em] mb-2">Pendentes</span>
                  <span className="text-2xl sm:text-3xl font-black text-primary leading-none">{estatisticas.pendentes}</span>
                </div>
                <div className="flex-1 min-w-[104px] bg-sunken border border-border-subtle p-4 sm:p-5 rounded-[24px] sm:rounded-3xl flex flex-col items-center justify-center group hover:bg-sunken transition-all">
                  <span className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-[0.3em] mb-2">Próximos</span>
                  <span className="text-2xl sm:text-3xl font-black text-text-primary leading-none">{estatisticas.confirmados}</span>
                </div>
                <div className="flex-1 min-w-[104px] bg-sunken border border-border-subtle p-4 sm:p-5 rounded-[24px] sm:rounded-3xl flex flex-col items-center justify-center group hover:bg-sunken transition-all border-green-500/10 bg-green-500/5">
                  <span className="text-[9px] font-black uppercase text-green-500/40 tracking-[0.3em] mb-2">Finalizados</span>
                  <span className="text-2xl sm:text-3xl font-black text-green-500 leading-none">{estatisticas.realizados}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Controle de Filtros (Centralizado e Paralelo) */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-5xl bg-app border border-border-subtle rounded-[28px] sm:rounded-[40px] p-2 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col lg:flex-row items-stretch gap-2">
                
                {/* Lado Esquerdo: Busca */}
                <div className="flex-[1.5] bg-sunken rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col items-center justify-center border border-border-subtle">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/20 tracking-[0.4em] mb-4">Localizar Evento</span>
                  <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Pesquisar por nome, cliente ou local..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 pl-11 bg-sunken border-border-subtle rounded-2xl focus:border-primary/40 focus:ring-0 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Lado Direito: Status */}
                <div className="flex-1 bg-sunken rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col items-center justify-center border border-border-subtle">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/20 tracking-[0.4em] mb-4">Fase da Operação</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['all', 'pendente', 'confirmado', 'realizado'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border",
                          statusFilter === s
                            ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105"
                            : "bg-sunken border-border text-text-disabled hover:bg-sunken"
                        )}
                      >
                        {s === 'all' ? 'Todos' : s}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Grid de Cards - Estilo Premium M5 Max */}
          <div className="relative">
            {filteredEventos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 border border-border-subtle bg-app rounded-[3rem]">
                <Calendar className="h-16 w-16 text-text-disabled mb-6" />
                <h3 className="text-xl font-bold text-text-secondary uppercase tracking-widest">Sem eventos na agenda</h3>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 text-text-tertiary text-[10px] font-black uppercase tracking-widest"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 pb-32">
                <AnimatePresence mode="popLayout">
                  {filteredEventos.map((evento, i) => {
                    const dataEvento = evento.orcamentos?.evento_data ? parseISO(evento.orcamentos.evento_data) : null;
                    const isRealizado = evento.status === 'realizado';
                    const isPendente = evento.status === 'pendente';
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: i * 0.02 }}
                        key={evento.id}
                        className="group relative flex flex-col justify-between p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-card backdrop-blur-md border border-border-subtle hover:border-primary/40 hover:bg-sunken transition-all duration-500 cursor-pointer shadow-soft-md overflow-hidden"
                        onClick={() => handleViewDetails(evento)}
                      >
                        {/* Glow Decorativo */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-5 sm:gap-8">
                          {/* Bloco de Data */}
                          <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className={cn(
                              "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 border border-border-subtle",
                              isRealizado ? "bg-emerald-500 text-white" : isPendente ? "bg-zinc-800 text-muted-foreground" : "bg-primary text-white"
                            )}>
                               <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1">
                                 {dataEvento ? format(dataEvento, "MMM", { locale: ptBR }) : "M5"}
                               </span>
                               <span className="text-2xl sm:text-3xl font-black leading-none">
                                 {dataEvento ? format(dataEvento, "dd") : "MAX"}
                               </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Badge className={cn(
                                "text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full border shadow-sm transition-colors",
                                isRealizado ? "bg-emerald-500/10 text-success border-emerald-500/20" : isPendente ? "bg-sunken text-text-tertiary border-border" : "bg-primary/10 text-primary border-primary/20"
                              )}>
                                {evento.status || 'PENDENTE'}
                              </Badge>
                              <span className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">
                                {evento.orcamentos?.tipo === 'show_pirotecnico' ? 'Operação Tática' : 'Venda Direta'}
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-text-text-tertiary group-hover:text-text-tertiary transition-colors leading-tight mb-4 truncate uppercase tracking-tighter">
                              {evento.orcamentos?.evento_nome}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex items-center gap-3 text-text-tertiary group/info">
                                <div className="p-1.5 rounded-lg bg-sunken text-primary group-hover/info:bg-primary group-hover/info:text-white transition-all">
                                  <Users className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground truncate">{evento.orcamentos?.nome_contratante}</span>
                              </div>
                              <div className="flex items-start gap-3 text-text-tertiary group/info">
                                <div className="p-1.5 rounded-lg bg-sunken text-primary group-hover/info:bg-primary group-hover/info:text-white transition-all">
                                  <MapPin className="h-3.5 w-3.5" />
                                </div>
                                <span className="text-sm font-medium leading-relaxed line-clamp-1">{evento.orcamentos?.evento_local}</span>
                              </div>
                              {evento.orcamentos?.evento_hora && (
                                <div className="flex items-center gap-3 text-text-tertiary group/info">
                                  <div className="p-1.5 rounded-lg bg-sunken text-primary group-hover/info:bg-primary group-hover/info:text-white transition-all">
                                    <Clock className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="text-sm font-medium leading-relaxed">{evento.orcamentos.evento_hora.substring(0, 5)}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between">
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-[0.3em] mb-1">Investimento Show</span>
                                  <p className="text-xl font-black text-text-primary tracking-tighter">
                                    R$ {Number(evento.orcamentos?.valor_total || 0).toLocaleString('pt-BR')}
                                  </p>
                               </div>
                               <button className="h-10 w-10 rounded-full bg-sunken flex items-center justify-center hover:bg-primary hover:text-text-primary transition-all">
                                  <Eye className="h-4 w-4" />
                                </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes - Estilo Premium Mobile-First */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <div className="flex max-h-[85vh] flex-col">
            <DialogHeader className="sticky top-0 z-20 border-b border-border bg-card/95 px-6 py-5 sm:px-8 backdrop-blur-xl flex flex-row items-center justify-between text-left">
              <div className="space-y-1">
                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-muted-foreground">
                  Ficha do Evento
                </DialogTitle>
                <DialogDescription className="text-xs font-medium tracking-wide text-text-tertiary">
                  Detalhamento operacional da montagem
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedEvento && (
              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 scrollbar-thin">
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full border bg-transparent",
                      selectedEvento.status === 'realizado' ? "border-emerald-500/30 text-success" :
                      selectedEvento.status === 'pendente' ? "border-yellow-500/30 text-yellow-500" :
                      "border-primary/30 text-primary"
                    )}>
                      {selectedEvento.status || 'Pendente'}
                    </Badge>
                    <span className="text-xs font-medium text-text-tertiary">
                      ID: {selectedEvento.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Top Cards: Contratante & Data */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-sunken p-5 hover:bg-sunken transition-colors">
                      <div className="flex items-center gap-2 mb-3 text-text-tertiary">
                        <Users className="h-4 w-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Contratante</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold leading-tight text-muted-foreground">
                        {selectedEvento.orcamentos?.nome_contratante}
                      </p>
                      {selectedEvento.orcamentos?.telefone && (
                         <p className="text-sm font-medium text-text-secondary mt-1">
                           {selectedEvento.orcamentos.telefone}
                         </p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-border bg-sunken p-5 hover:bg-sunken transition-colors">
                      <div className="flex items-center gap-2 mb-3 text-text-tertiary">
                        <Calendar className="h-4 w-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Data e Hora</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold leading-tight text-muted-foreground">
                        {selectedEvento.orcamentos?.evento_data
                          ? format(parseISO(selectedEvento.orcamentos.evento_data), "dd 'de' MMMM, yyyy", { locale: ptBR })
                          : 'A definir'}
                        {selectedEvento.orcamentos?.evento_hora ? ` às ${selectedEvento.orcamentos.evento_hora.substring(0, 5)}` : ''}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        R$ {Number(selectedEvento.orcamentos?.valor_total || 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Local Info */}
                  <div className="rounded-2xl border border-border bg-sunken p-5 flex items-start gap-4 hover:bg-sunken transition-colors">
                    <div className="mt-0.5 p-2 rounded-xl bg-sunken text-text-secondary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                        Local da Operação
                      </span>
                      <p className="text-base font-medium leading-relaxed text-muted-foreground">
                        {selectedEvento.orcamentos?.evento_local || "Local não informado"}
                      </p>
                    </div>
                  </div>

                  {/* Produtos List */}
                  {selectedEvento.orcamentos?.orcamentos_produtos && selectedEvento.orcamentos.orcamentos_produtos.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-4 w-4 text-text-tertiary" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                          Composição Técnica do Show
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {selectedEvento.orcamentos.orcamentos_produtos.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-app p-3 sm:p-4 hover:bg-sunken transition-colors"
                          >
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-sunken text-sm font-bold text-muted-foreground">
                                {item.quantidade}x
                              </div>
                              <div className="flex flex-col">
                                <p className="truncate text-sm font-medium text-muted-foreground">
                                  {item.produtos?.nome_produto}
                                </p>
                                <p className="text-[10px] font-mono text-text-disabled uppercase mt-0.5">
                                  {item.produtos?.codigo || "S/N"}
                                </p>
                              </div>
                            </div>
                            <span className="hidden sm:block text-xs font-medium text-text-secondary whitespace-nowrap">
                              R$ {Number(item.valor_total).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="sticky bottom-0 z-20 border-t border-border bg-card/95 px-6 py-4 sm:px-8 backdrop-blur-xl rounded-b-[24px] sm:rounded-b-[32px] flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setIsDetailsOpen(false)}
                className="h-11 rounded-xl bg-sunken hover:bg-sunken text-sm font-medium text-text-primary px-6 transition-colors"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEventos;
