import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebouncedSearch } from "@/features/admin/hooks/use-debounced-search";
import { useMemoizedStats } from "@/features/admin/hooks/use-memoized-stats";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Separator } from "@shared/ui/separator";
import { FileText, Search, Plus, Eye, Edit, Trash2, Calendar, User, MapPin, DollarSign, CheckCircle, Clock, AlertCircle, Package, Calculator, TrendingUp, RefreshCw, Filter, Zap, X, Phone, Minus, Loader2 } from "lucide-react";
import { supabase } from "@/features/admin/lib/supabase";
import { supabaseLeads, hasLeadsSource, mapLeadToSolicitacao } from "@/features/admin/lib/supabase-leads";
import {
  ORCAMENTO_STATUS_OPTIONS,
  buildShowConsumptionItems,
  canFinalizeShow,
  dedupeOrcamentoProdutos,
  getOrcamentoStatusMeta,
  getShowCompletionTargetStatus,
  normalizeEditableStatus,
  normalizeOrcamentoStatus,
  type OrcamentoCompleto,
  type OrcamentoFormProduct,
  type ShowUsageItem,
  type OrcamentoStatus,
  type Produto,
  type SolicitacaoOrcamento,
} from "@/features/admin/modules/orcamentos";
import { useOrcamentoPdf } from "@/features/admin/modules/orcamentos/pdf/use-orcamento-pdf";
import { useToast } from "@/features/admin/hooks/use-toast";
import { useAuth } from "@/features/admin/contexts/AuthContextSimple";
import { format, isThisMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrcamentoCard } from "@/features/admin/components/orcamentos/OrcamentoCard";
import { SolicitacaoCard } from "@/features/admin/components/orcamentos/SolicitacaoCard";
import {
  ConfirmShowModal,
  type ConfirmShowModalConfirmPayload,
} from "@/features/admin/components/modals/ConfirmShowModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@shared/lib/utils";

type SupabaseLikeError = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

type AppliedShowStockMovement = {
  produtoId: string;
  produtoNome: string;
  quantidadePlanejada: number;
  quantidadeUsada: number;
  quantidadeAnterior: number;
  quantidadeAtual: number;
};

const isSupabaseLikeError = (error: unknown): error is SupabaseLikeError =>
  typeof error === "object" && error !== null;

const isMissingTableError = (error: unknown): error is SupabaseLikeError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as SupabaseLikeError).code === "42P01";

const isOrcamentosStatusConstraintError = (error: unknown): boolean =>
  isSupabaseLikeError(error) &&
  error.code === "23514" &&
  typeof error.message === "string" &&
  error.message.includes("orcamentos_status_check");

const getReadableErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (isSupabaseLikeError(error)) {
    // Erro de Constraint (ex: status Realizado não permitido)
    if (isOrcamentosStatusConstraintError(error)) {
      return "O banco ainda não permite o status REALIZADO. Aplique a migration de constraint e tente novamente.";
    }

    // Erro de Coluna Inexistente (42703) - Comum quando a migration não foi rodada
    if (error.code === "42703") {
      if (error.message?.includes("evento_hora") || error.message?.includes("hora_evento")) {
        return "A coluna de 'Horário' não existe no seu banco de dados. Você PRECISA rodar o script SQL (ALTER TABLE...) no painel do Supabase para ativar esta função.";
      }
      return `Coluna inexistente: ${error.message}`;
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const buildInsufficientStockInlineMessage = (
  items: Array<{
    nome_produto: string;
    quantidade_disponivel: number;
    quantidade_usada: number;
  }>,
): string => {
  if (items.length === 0) {
    return "";
  }

  const preview = items
    .slice(0, 3)
    .map(
      (item) =>
        `${item.nome_produto} (disp: ${item.quantidade_disponivel}, uso: ${item.quantidade_usada})`,
    )
    .join("; ");

  if (items.length <= 3) {
    return preview;
  }

  return `${preview}; +${items.length - 3} item(ns)`;
};

const MANUAL_STATUS_OPTIONS = ORCAMENTO_STATUS_OPTIONS.filter(
  (statusOption) => statusOption.value !== "realizado",
);

const AdminOrcamentos = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const { generatePDF: handleGeneratePDF } = useOrcamentoPdf();
  
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [orcamentos, setOrcamentos] = useState<OrcamentoCompleto[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTipo, setFilterTipo] = useState("all");
  const [selectedTab, setSelectedTab] = useState("solicitacoes");
  const [isOrcamentoDialogOpen, setIsOrcamentoDialogOpen] = useState(false);
  const [editingOrcamento, setEditingOrcamento] = useState<OrcamentoCompleto | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoCompleto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFullEditOpen, setIsFullEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [orcamentoToDelete, setOrcamentoToDelete] = useState<string | null>(null);
  const [isConfirmShowOpen, setIsConfirmShowOpen] = useState(false);
  const [confirmShowOrcamento, setConfirmShowOrcamento] = useState<OrcamentoCompleto | null>(null);
  const [isProcessingShowConfirmation, setIsProcessingShowConfirmation] = useState(false);
  const [isSyncingLeads, setIsSyncingLeads] = useState(false);
  
  // Estados para o modal de Confirmação de Show
  const [confirmShowItems, setConfirmShowItems] = useState<ShowUsageItem[]>([]);
  const [confirmShowFinalTotal, setConfirmShowFinalTotal] = useState<string>("0");
  const [allowFinalizeWithoutStock, setAllowFinalizeWithoutStock] = useState(false);

  // Memos para o modal de Confirmação de Show
  const confirmShowOriginalTotal = useMemo(() => {
    if (!confirmShowOrcamento) return 0;
    return confirmShowOrcamento.valor_total || 0;
  }, [confirmShowOrcamento]);

  const confirmShowDiscountValue = useMemo(() => {
    const final = parseFloat(confirmShowFinalTotal) || 0;
    return Math.max(0, confirmShowOriginalTotal - final);
  }, [confirmShowOriginalTotal, confirmShowFinalTotal]);

  const confirmShowAvailability = useMemo(() => {
    if (!confirmShowOrcamento) return [];
    
    return confirmShowOrcamento.orcamentos_produtos.map((op, idx) => {
      const itemState = confirmShowItems[idx];
      const planejado = op.quantidade;
      const usado = itemState ? itemState.quantidade_usada : planejado;
      const disponivel = op.produtos?.quantidade_disponivel ?? 0;
      const insuficiente = usado > disponivel;

      return {
        produto_id: op.produto_id!,
        nome_produto: op.produtos?.nome_produto || "Produto não identificado",
        efeito: op.produtos?.efeito || null,
        quantidade_planejada: planejado,
        quantidade_usada: usado,
        quantidade_disponivel: disponivel,
        estoque_insuficiente: insuficiente,
        quantidade_faltante: insuficiente ? usado - disponivel : 0
      };
    });
  }, [confirmShowOrcamento, confirmShowItems]);

  const insufficientShowItems = useMemo(() => {
    return confirmShowAvailability.filter(item => item.estoque_insuficiente);
  }, [confirmShowAvailability]);

  // Handlers para o modal de Confirmação de Show
  const handleConfirmShowItemUsageChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newItems = [...confirmShowItems];
    
    if (newItems[index]) {
      newItems[index].quantidade_usada = newValue;
    } else if (confirmShowOrcamento?.orcamentos_produtos[index]) {
      const op = confirmShowOrcamento.orcamentos_produtos[index];
      newItems[index] = {
        produto_id: op.produto_id!,
        quantidade_planejada: op.quantidade,
        quantidade_usada: newValue
      };
    }
    
    setConfirmShowItems(newItems);
  };

  const handleConfirmShowTotalChange = (value: string) => {
    setConfirmShowFinalTotal(value);
  };

  const [editForm, setEditForm] = useState({
    nome_contratante: '',
    telefone: '',
    cpf: '',
    evento_nome: '',
    evento_data: '',
    evento_hora: '',
    evento_local: '',
    valor_total: 0,
    status: 'pendente' as OrcamentoStatus,
    produtos: [] as OrcamentoFormProduct[]
  });
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productEffectFilter, setProductEffectFilter] = useState("all");
  const [productPriceSort, setProductPriceSort] = useState("none");
  const [productDurationSort, setProductDurationSort] = useState("none");
  const [isSolicitacaoDetailsOpen, setIsSolicitacaoDetailsOpen] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [isSolicitacaoEditOpen, setIsSolicitacaoEditOpen] = useState(false);
  const [solicitacaoEditForm, setSolicitacaoEditForm] = useState({
    nome_completo: '',
    email: '',
    whatsapp: '',
    tipo_solicitacao: '',
    tipo_evento: '',
    data_evento: '',
    hora_evento: '',
    localizacao_evento: '',
    detalhes_adicionais: ''
  });
  const [selectedProducts, setSelectedProducts] = useState<OrcamentoFormProduct[]>([]);
  const [newProduct, setNewProduct] = useState({ produto_id: '', nome: '', quantidade: 1, valor_unitario: 0 });
  const [orcamentoForm, setOrcamentoForm] = useState({
    tipo: 'venda_artigos' as 'show_pirotecnico' | 'venda_artigos',
    nome_contratante: '',
    telefone: '',
    cpf: '',
    evento_nome: '',
    evento_data: '',
    evento_local: '',
    modo_pagamento: 'dinheiro' as 'dinheiro' | 'pix' | 'cartao' | 'transferencia',
    margem_lucro: 30
  });

  const fetchSolicitacoes = useCallback(async () => {
    setIsSyncingLeads(true);
    try {
      if (hasLeadsSource && supabaseLeads) {
        const { data, error } = await supabaseLeads
          .from('lead_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[Orçamentos] lead_submissions indisponível:', error.message);
          setSolicitacoes([]);
        } else {
          setSolicitacoes((data || []).map(mapLeadToSolicitacao));
        }
      } else {
        const { data, error } = await supabase
          .from('solicitacoes_orcamento')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          // 42P01 = undefined_table. Tratar como ausência do recurso no ambiente atual.
          if (isMissingTableError(error)) {
            console.warn('[Orçamentos] solicitacoes_orcamento indisponível:', error.message);
            setSolicitacoes([]);
          } else {
            console.error('Erro ao buscar solicitações:', error);
            throw error;
          }
        } else {
          setSolicitacoes(data || []);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar solicitações:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações de orçamento.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingLeads(false);
    }
  }, [toast]);

  const fetchOrcamentos = useCallback(async () => {
    try {
      
      // Buscar orçamentos regulares
      const { data: orcamentosData, error: orcamentosError } = await supabase
        .from('orcamentos')
        .select(`
          *,
          orcamentos_produtos!inner (
            id,
            produto_id,
            quantidade,
            valor_unitario,
            produtos (
              id,
              codigo,
              nome_produto,
              descricao_completa,
              valor_venda,
              duracao_segundos,
              efeito
            )
          ),
          usuarios (
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (orcamentosError) {
        console.error('Erro ao buscar orçamentos:', orcamentosError);
        throw orcamentosError;
      }

      const orcamentosLimpos = (orcamentosData || []).map((orcamento) => ({
        ...orcamento,
        status: normalizeOrcamentoStatus(orcamento.status),
        orcamentos_produtos: dedupeOrcamentoProdutos(orcamento.orcamentos_produtos),
      }));

      // Buscar solicitações "Contratar Equipe" para mostrar como orçamentos
      const { data: solicitacoesEquipe, error: solicitacoesError } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .eq('tipo_solicitacao', 'contratar_equipe')
        .order('created_at', { ascending: false });

      if (solicitacoesError) {
        if ((solicitacoesError as { code?: string }).code === '42P01') {
          console.warn('[Orçamentos] solicitacoes_orcamento indisponível:', solicitacoesError.message);
        } else {
          console.error('Erro ao buscar solicitações de equipe:', solicitacoesError);
          throw solicitacoesError;
        }
      }

      // Converter solicitações "Contratar Equipe" para formato de orçamento
      const orcamentosFromSolicitacoes = (solicitacoesEquipe || []).map(solicitacao => ({
        id: `solicitacao_${solicitacao.id}`,
        tipo: 'show_pirotecnico' as const,
        nome_contratante: solicitacao.nome_completo,
        telefone: solicitacao.whatsapp,
        cpf: '',
        evento_nome: `${solicitacao.tipo_evento} - ${solicitacao.nome_completo}`,
        evento_data: solicitacao.data_evento || '',
        evento_hora: solicitacao.hora_evento || '',
        evento_local: solicitacao.localizacao_evento || '',
        modo_pagamento: 'dinheiro' as const,
        valor_total: 0,
        margem_lucro: 0,
        status: 'pendente' as OrcamentoStatus,
        created_at: solicitacao.created_at,
        solicitacao_origem: solicitacao, // Manter referência à solicitação original
        orcamentos_produtos: [],
        usuarios: null
      }));

      // Combinar orçamentos regulares (limpos) com os convertidos de solicitações
      const todosOrcamentos = [...(orcamentosLimpos || []), ...orcamentosFromSolicitacoes];
      
      setOrcamentos(todosOrcamentos);
    } catch (error) {
      console.error('❌ Erro ao carregar orçamentos:', error);
      toast({
        title: "Erro ao carregar orçamentos",
        description: "Não foi possível carregar os orçamentos.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchProdutos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('nome_produto');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchSolicitacoes(),
      fetchOrcamentos(),
      fetchProdutos()
    ]);
  }, [fetchSolicitacoes, fetchOrcamentos, fetchProdutos]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const isStatusLocked = useCallback(
    (status: string | null | undefined) =>
      normalizeOrcamentoStatus(status) === "realizado",
    [],
  );

  const canRunShowConfirmation = useCallback((orcamento: OrcamentoCompleto) => {
    if (!orcamento || orcamento.id.startsWith("solicitacao_")) {
      return false;
    }

    if (normalizeOrcamentoStatus(orcamento.status) !== "confirmado") {
      return false;
    }

    return canFinalizeShow(orcamento.evento_data);
  }, []);

  // Função para filtrar e ordenar produtos
  const sortedFilteredProducts = produtos.filter(produto => {
    // Filtro por termo de busca
    const searchMatch = !productSearchTerm || 
      produto.nome_produto.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(productSearchTerm.toLowerCase());
    
    // Filtro por categoria
    const categoryMatch = productCategoryFilter === "all" || 
      produto.categoria.toLowerCase() === productCategoryFilter;
    
    // Filtro por efeito
    const effectMatch = productEffectFilter === "all" || 
      (produto.efeito && produto.efeito.toLowerCase() === productEffectFilter.toLowerCase());
    
    return searchMatch && categoryMatch && effectMatch;
  });

  // Ordenação por preço
  if (productPriceSort === "asc") {
    sortedFilteredProducts.sort((a, b) => a.valor_venda - b.valor_venda);
  } else if (productPriceSort === "desc") {
    sortedFilteredProducts.sort((a, b) => b.valor_venda - a.valor_venda);
  }

  // Ordenação por duração
  if (productDurationSort === "asc") {
    sortedFilteredProducts.sort((a, b) => (a.duracao_segundos || 0) - (b.duracao_segundos || 0));
  } else if (productDurationSort === "desc") {
    sortedFilteredProducts.sort((a, b) => (b.duracao_segundos || 0) - (a.duracao_segundos || 0));
  }

  const filteredSolicitacoes = solicitacoes.filter(solicitacao => {
    const matchesSearch = 
      solicitacao.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitacao.whatsapp.includes(searchTerm) ||
      (solicitacao.email && solicitacao.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTipo = filterTipo === "all" || solicitacao.tipo_solicitacao === filterTipo;

    return matchesSearch && matchesTipo;
  });

  // Filtros base sem busca de texto (otimizado)
  const baseFilteredOrcamentos = useMemo(() => {
    return orcamentos.filter(orcamento => {
      const matchesStatus =
        filterStatus === "all" ||
        normalizeOrcamentoStatus(orcamento.status) === filterStatus;
      return matchesStatus;
    });
  }, [orcamentos, filterStatus]);

  // Busca otimizada com debounce
  const { filteredItems: filteredOrcamentos } = useDebouncedSearch(
    baseFilteredOrcamentos,
    searchTerm,
    ['nome_contratante', 'evento_nome', 'telefone']
  );

  // Estatísticas otimizadas com memoização
  const stats = useMemoizedStats(orcamentos, {
    total: (items) => items.length,
    confirmados: (items) =>
      items.filter((o) => normalizeOrcamentoStatus(o.status) === 'confirmado').length,
    pendentes: (items) =>
      items.filter((o) => normalizeOrcamentoStatus(o.status) === 'pendente').length,
    realizados: (items) =>
      items.filter((o) => normalizeOrcamentoStatus(o.status) === 'realizado').length,
  });

  const solicitacoesPendentes = useMemo(() => 
    solicitacoes.filter(s => !s.enviado_email).length, 
    [solicitacoes]
  );

  const getStatusColor = (enviado: boolean) => {
    return enviado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === "artigos_pirotecnicos" ? "Artigos Pirotécnicos" : "Contratar Equipe";
  };

  // Evita deslocamento de fuso: formata usando apenas a parte da data (YYYY-MM-DD)
  const formatDate = (date: string) => {
    if (!date) return '';
    const [y, m, d] = date.split('T')[0].split('-');
    return `${d}/${m}/${y}`;
  };

  const formatDateOnly = formatDate;

  const calculateOrcamentoTotal = () => {
    const subtotal = selectedProducts.reduce((sum, item) => 
      sum + (item.quantidade * item.valor_unitario), 0
    );
    // Aplicar margem de lucro: para 30% de margem, adiciona 30% ao subtotal
    return subtotal + (subtotal * orcamentoForm.margem_lucro / 100);
  };

  const handleCreateOrcamento = async () => {
    if (!userData || selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto ao orçamento.",
        variant: "destructive",
      });
      return;
    }

    try {
      const valorTotal = calculateOrcamentoTotal();
      
      // Corrigir a data do evento para evitar problemas de timezone
      const eventoDataCorrigida = orcamentoForm.evento_data 
        ? new Date(orcamentoForm.evento_data + 'T12:00:00').toISOString().split('T')[0]
        : orcamentoForm.evento_data;
      
      const { data: orcamento, error: orcamentoError } = await supabase
        .from('orcamentos')
        .insert({
          ...orcamentoForm,
          evento_data: eventoDataCorrigida,
          evento_hora: orcamentoForm.evento_hora || null,
          valor_total: valorTotal,
          status: 'pendente',
          created_by: userData.id
        })
        .select()
        .single();

      if (orcamentoError) throw orcamentoError;

      // Inserir produtos do orçamento
      const orcamentoProdutos = selectedProducts.map(item => ({
        orcamento_id: orcamento.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.quantidade * item.valor_unitario
      }));

      const { error: produtosError } = await supabase
        .from('orcamentos_produtos')
        .insert(orcamentoProdutos);

      if (produtosError) throw produtosError;

      toast({
        title: "Orçamento criado!",
        description: "O orçamento foi criado com sucesso.",
      });

      setIsOrcamentoDialogOpen(false);
      resetOrcamentoForm();
      fetchOrcamentos();
    } catch (error) {
      console.error('❌ Erro ao criar orçamento:', error);
      toast({
        title: "Erro ao criar orçamento",
        description: getReadableErrorMessage(error, "Não foi possível criar o orçamento."),
        variant: "destructive",
      });
    }
  };

  const resetOrcamentoForm = () => {
    setOrcamentoForm({
      tipo: 'venda_artigos',
      nome_contratante: '',
      telefone: '',
      cpf: '',
      evento_nome: '',
      evento_data: '',
      evento_hora: '',
      evento_local: '',
      modo_pagamento: 'dinheiro',
      margem_lucro: 30
    });
    setSelectedProducts([]);
    setEditingOrcamento(null);
  };

  const addProductToOrcamento = (product: OrcamentoFormProduct) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProductFromOrcamento = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProductInOrcamento = (index: number, updatedProduct: { produto_id: string; nome: string; quantidade: number; valor_unitario: number }) => {
    const updated = [...selectedProducts];
    updated[index] = updatedProduct;
    setSelectedProducts(updated);
  };

  const handleMarkSolicitacaoProcessed = async (id: string) => {
    // Quando a fonte é externa, evitamos mutar o outro projeto.
    if (hasLeadsSource) {
      toast({
        title: "Fonte externa",
        description: "Processamento visual apenas — não alteramos lead_submissions.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .update({ enviado_email: true })
        .eq('id', id);

      if (error && !isMissingTableError(error)) throw error;

      toast({
        title: "Solicitação marcada como processada",
        description: "A solicitação foi marcada como processada.",
      });

      fetchSolicitacoes();
    } catch (error) {
      toast({
        title: "Erro ao processar solicitação",
        description: "Não foi possível marcar a solicitação como processada.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrcamento = (id: string) => {
    setOrcamentoToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteOrcamento = async () => {
    if (!orcamentoToDelete) return;
    
    try {
      // Verificar se é um orçamento real ou convertido de solicitação
      if (orcamentoToDelete.startsWith('solicitacao_')) {
        // É uma solicitação convertida - excluir da tabela solicitacoes_orcamento
        const solicitacaoId = orcamentoToDelete.replace('solicitacao_', '');
        
        const { error: solicitacaoError } = await supabase
          .from('solicitacoes_orcamento')
          .delete()
          .eq('id', solicitacaoId);

        if (solicitacaoError && !isMissingTableError(solicitacaoError)) {
          console.error('Erro ao excluir solicitação:', solicitacaoError);
          throw solicitacaoError;
        }

        toast({
          title: "Solicitação excluída!",
          description: "A solicitação foi removida com sucesso.",
        });
      } else {
        // É um orçamento real - excluir da tabela orcamentos
        // Primeiro, excluir produtos associados do orçamento
        const { error: produtosError } = await supabase
          .from('orcamentos_produtos')
          .delete()
          .eq('orcamento_id', orcamentoToDelete);

        if (produtosError) {
          console.error('Erro ao excluir produtos do orçamento:', produtosError);
          throw produtosError;
        }

        // Depois, excluir o orçamento
        const { error: orcamentoError } = await supabase
          .from('orcamentos')
          .delete()
          .eq('id', orcamentoToDelete);

        if (orcamentoError) {
          console.error('Erro ao excluir orçamento:', orcamentoError);
          throw orcamentoError;
        }

        toast({
          title: "Orçamento excluído!",
          description: "O orçamento foi removido com sucesso.",
        });
      }

      fetchOrcamentos();
      setIsDeleteConfirmOpen(false);
      setOrcamentoToDelete(null);
    } catch (error) {
      console.error('Erro completo ao excluir:', error);
      toast({
        title: "Erro ao excluir",
        description: error?.message || "Não foi possível excluir o item.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = useCallback((orcamento: OrcamentoCompleto) => {
    setSelectedOrcamento(orcamento);
    setIsDetailsOpen(true);
  }, []);

  const handleEditOrcamento = useCallback((orcamento: OrcamentoCompleto) => {
    setSelectedOrcamento(orcamento);
    setIsEditOpen(true);
  }, []);

  const handleOpenConfirmShow = useCallback(
    (orcamento: OrcamentoCompleto) => {
      if (orcamento.id.startsWith("solicitacao_")) {
        toast({
          title: "Ação não permitida",
          description:
            "Somente orçamentos reais podem ser finalizados como show realizado.",
          variant: "destructive",
        });
        return;
      }

      const normalizedStatus = normalizeOrcamentoStatus(orcamento.status);
      if (normalizedStatus !== "confirmado") {
        toast({
          title: "Status inválido",
          description:
            "Somente orçamentos confirmados podem passar pelo fechamento manual de show.",
          variant: "destructive",
        });
        return;
      }

      if (!canFinalizeShow(orcamento.evento_data)) {
        toast({
          title: "Data ainda não elegível",
          description:
            "O fechamento do show só fica habilitado na data do evento ou depois.",
          variant: "destructive",
        });
        return;
      }

      setConfirmShowOrcamento(orcamento);
      setIsConfirmShowOpen(true);
    },
    [toast],
  );

  const handleConfirmShowOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isProcessingShowConfirmation) {
      return;
    }

    setIsConfirmShowOpen(nextOpen);

    if (!nextOpen) {
      setConfirmShowOrcamento(null);
    }
  };

  const closeConfirmShowDialog = (force = false) => {
    if (!force && isProcessingShowConfirmation) {
      return;
    }

    setIsConfirmShowOpen(false);
    setConfirmShowOrcamento(null);
  };

  const handleConfirmShowCompletion = async ({
    items,
    finalTotal,
    allowFinalizeWithoutStock,
  }: ConfirmShowModalConfirmPayload) => {
    if (!confirmShowOrcamento) return;

    if (confirmShowOrcamento.id.startsWith("solicitacao_")) {
      toast({
        title: "Ação não permitida",
        description: "Solicitações convertidas precisam virar orçamento real antes.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingShowConfirmation(true);

    try {
      const { data: orcamentoAtual, error: fetchError } = await supabase
        .from("orcamentos")
        .select(`
          id,
          evento_nome,
          evento_data,
          status,
          valor_total,
          orcamentos_produtos (
            produto_id,
            quantidade
          )
        `)
        .eq("id", confirmShowOrcamento.id)
        .single();

      if (fetchError) throw fetchError;

      const statusAtual = normalizeOrcamentoStatus(orcamentoAtual.status);
      if (statusAtual !== "confirmado") {
        throw new Error(
          "Este orçamento não está mais confirmado. Atualize a tela antes de finalizar o show.",
        );
      }

      if (!canFinalizeShow(orcamentoAtual.evento_data)) {
        throw new Error(
          "A finalização do show só é permitida na data do evento ou após ela.",
        );
      }

      const usagePayload: ShowUsageItem[] = items.map((item) => ({
        produto_id: item.produto_id,
        quantidade_planejada: item.quantidade_planejada,
        quantidade_usada: item.quantidade_usada,
      }));
      const finalTotalValue = Math.max(0, Number(finalTotal) || 0);

      const targetStatus = getShowCompletionTargetStatus(usagePayload);
      if (targetStatus === "cancelado") {
        const { error: cancelError } = await supabase
          .from("orcamentos")
          .update({ status: "cancelado", valor_total: finalTotalValue })
          .eq("id", confirmShowOrcamento.id);

        if (cancelError) throw cancelError;

        toast({
          title: "Show cancelado",
          description:
            `Nenhum item foi consumido. O orçamento foi marcado como cancelado com valor final de R$ ${finalTotalValue.toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 2 },
            )}.`,
        });

        closeConfirmShowDialog(true);
        await Promise.all([fetchOrcamentos(), fetchProdutos()]);
        return;
      }

      const showMarker = `[show:${confirmShowOrcamento.id}]`;
      const consumptions = buildShowConsumptionItems(usagePayload).filter(
        (item) => item.quantidadeUsada > 0,
      );

      let pendingConsumptions = consumptions;
      const produtosMap = new Map<
        string,
        { nome_produto: string; quantidade_disponivel: number }
      >();
      const consumptionsToDeduct: Array<{
        produtoId: string;
        produtoNome: string;
        quantidadePlanejada: number;
        quantidadeUsada: number;
        quantidadeDisponivel: number;
      }> = [];
      const insufficientConsumptions: Array<{
        produtoId: string;
        produtoNome: string;
        quantidadePlanejada: number;
        quantidadeUsada: number;
        quantidadeDisponivel: number;
      }> = [];

      if (consumptions.length > 0) {
        const consumptionProductIds = consumptions.map((item) => item.produtoId);

        const { data: existingHistory, error: historyError } = await supabase
          .from("historico_estoque")
          .select("produto_id, motivo")
          .in("produto_id", consumptionProductIds)
          .like("motivo", `%${showMarker}%`);

        if (historyError) throw historyError;

        const alreadyProcessedProducts = new Set(
          (existingHistory || [])
            .map((item) => item.produto_id)
            .filter((produtoId): produtoId is string => Boolean(produtoId)),
        );

        pendingConsumptions = consumptions.filter(
          (item) => !alreadyProcessedProducts.has(item.produtoId),
        );

        if (pendingConsumptions.length > 0) {
          const { data: produtosData, error: produtosError } = await supabase
            .from("produtos")
            .select("id, nome_produto, quantidade_disponivel")
            .in(
              "id",
              pendingConsumptions.map((item) => item.produtoId),
            );

          if (produtosError) throw produtosError;

          (produtosData || []).forEach((produto) => {
            produtosMap.set(produto.id, {
              nome_produto: produto.nome_produto,
              quantidade_disponivel: produto.quantidade_disponivel ?? 0,
            });
          });

          pendingConsumptions.forEach((consumption) => {
            const produto = produtosMap.get(consumption.produtoId);
            if (!produto) {
              throw new Error(
                `Produto ${consumption.produtoId} não encontrado para dedução de estoque.`,
              );
            }

            if (produto.quantidade_disponivel < consumption.quantidadeUsada) {
              insufficientConsumptions.push({
                produtoId: consumption.produtoId,
                produtoNome: produto.nome_produto,
                quantidadePlanejada: consumption.quantidadePlanejada,
                quantidadeUsada: consumption.quantidadeUsada,
                quantidadeDisponivel: produto.quantidade_disponivel,
              });
              return;
            }

            consumptionsToDeduct.push({
              produtoId: consumption.produtoId,
              produtoNome: produto.nome_produto,
              quantidadePlanejada: consumption.quantidadePlanejada,
              quantidadeUsada: consumption.quantidadeUsada,
              quantidadeDisponivel: produto.quantidade_disponivel,
            });
          });

          if (insufficientConsumptions.length > 0 && !allowFinalizeWithoutStock) {
            throw new Error(
              `Estoque insuficiente para finalizar com baixa completa: ${buildInsufficientStockInlineMessage(
                insufficientConsumptions.map((item) => ({
                  nome_produto: item.produtoNome,
                  quantidade_disponivel: item.quantidadeDisponivel,
                  quantidade_usada: item.quantidadeUsada,
                })),
              )}. Marque a opção para finalizar como realizado mesmo sem estoque.`,
            );
          }
        }
      }

      const { error: statusError } = await supabase
        .from("orcamentos")
        .update({ status: "realizado", valor_total: finalTotalValue })
        .eq("id", confirmShowOrcamento.id);

      if (statusError) throw statusError;

      const appliedMovements: AppliedShowStockMovement[] = [];

      try {
        for (const consumption of consumptionsToDeduct) {
          const produto = produtosMap.get(consumption.produtoId);
          if (!produto) {
            throw new Error(
              `Produto ${consumption.produtoId} não encontrado para dedução de estoque.`,
            );
          }

          const quantidadeAnterior = produto.quantidade_disponivel;
          const quantidadeAtual = quantidadeAnterior - consumption.quantidadeUsada;

          const { error: updateError } = await supabase
            .from("produtos")
            .update({ quantidade_disponivel: quantidadeAtual })
            .eq("id", consumption.produtoId);

          if (updateError) throw updateError;

          const motivo = `Consumo real do show ${showMarker} - ${orcamentoAtual.evento_nome} | Planejado: ${consumption.quantidadePlanejada} | Usado: ${consumption.quantidadeUsada}`;

          const { error: historicoError } = await supabase
            .from("historico_estoque")
            .insert({
              produto_id: consumption.produtoId,
              tipo_movimentacao: "saida",
              quantidade_anterior: quantidadeAnterior,
              quantidade_movimentada: consumption.quantidadeUsada,
              quantidade_atual: quantidadeAtual,
              motivo,
            });

          if (historicoError) throw historicoError;

          appliedMovements.push({
            produtoId: consumption.produtoId,
            produtoNome: produto.nome_produto,
            quantidadePlanejada: consumption.quantidadePlanejada,
            quantidadeUsada: consumption.quantidadeUsada,
            quantidadeAnterior,
            quantidadeAtual,
          });

          produto.quantidade_disponivel = quantidadeAtual;
        }
      } catch (stockError) {
        const rollbackErrors: string[] = [];

        for (const movement of [...appliedMovements].reverse()) {
          const { error: rollbackProductError } = await supabase
            .from("produtos")
            .update({ quantidade_disponivel: movement.quantidadeAnterior })
            .eq("id", movement.produtoId);

          if (rollbackProductError) {
            rollbackErrors.push(
              `Falha ao reverter estoque de ${movement.produtoNome}: ${rollbackProductError.message}`,
            );
            continue;
          }

          const rollbackMotivo = `Rollback do consumo real ${showMarker} - ${orcamentoAtual.evento_nome} | Planejado: ${movement.quantidadePlanejada} | Usado: ${movement.quantidadeUsada}`;

          const { error: rollbackHistoricoError } = await supabase
            .from("historico_estoque")
            .insert({
              produto_id: movement.produtoId,
              tipo_movimentacao: "entrada",
              quantidade_anterior: movement.quantidadeAtual,
              quantidade_movimentada: movement.quantidadeUsada,
              quantidade_atual: movement.quantidadeAnterior,
              motivo: rollbackMotivo,
            });

          if (rollbackHistoricoError) {
            rollbackErrors.push(
              `Falha ao registrar rollback de ${movement.produtoNome}: ${rollbackHistoricoError.message}`,
            );
          }
        }

        const { error: rollbackStatusError } = await supabase
          .from("orcamentos")
          .update({
            status: "confirmado",
            valor_total: Math.max(0, Number(orcamentoAtual.valor_total) || 0),
          })
          .eq("id", confirmShowOrcamento.id);

        if (rollbackStatusError) {
          rollbackErrors.push(
            `Falha ao restaurar status para confirmado: ${rollbackStatusError.message}`,
          );
        }

        const stockFailureMessage = getReadableErrorMessage(
          stockError,
          "Falha ao processar a baixa de estoque.",
        );

        if (rollbackErrors.length > 0) {
          throw new Error(
            `${stockFailureMessage} O rollback teve falhas: ${rollbackErrors.join(" | ")}`,
          );
        }

        throw new Error(
          `${stockFailureMessage} A finalizacao foi revertida automaticamente para manter consistencia.`,
        );
      }

      if (insufficientConsumptions.length > 0) {
        const historicoPendencias = insufficientConsumptions.map((item) => ({
          produto_id: item.produtoId,
          tipo_movimentacao: "ajuste" as const,
          quantidade_anterior: item.quantidadeDisponivel,
          quantidade_movimentada: 0,
          quantidade_atual: item.quantidadeDisponivel,
          motivo: `Consumo real do show ${showMarker} - ${orcamentoAtual.evento_nome} | Sem baixa por estoque insuficiente | Planejado: ${item.quantidadePlanejada} | Usado: ${item.quantidadeUsada} | Disponível: ${item.quantidadeDisponivel}`,
        }));

        const { error: pendenciaHistoricoError } = await supabase
          .from("historico_estoque")
          .insert(historicoPendencias);

        if (pendenciaHistoricoError) {
          console.warn(
            "Falha ao registrar pendencias de estoque no historico:",
            pendenciaHistoricoError,
          );
          toast({
            title: "Show realizado com pendencias",
            description:
              "O status foi atualizado, mas não foi possível registrar todas as pendências de estoque no histórico.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Show finalizado com sucesso",
        description:
          insufficientConsumptions.length > 0
            ? `Orçamento marcado como REALIZADO (R$ ${finalTotalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}). ${consumptionsToDeduct.length} item(ns) baixados e ${insufficientConsumptions.length} item(ns) registrados sem baixa por falta de estoque.`
            : consumptionsToDeduct.length > 0
              ? `O orçamento foi atualizado para REALIZADO com valor final de R$ ${finalTotalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} e o consumo real foi baixado no estoque.`
              : `O orçamento foi atualizado para REALIZADO com valor final de R$ ${finalTotalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}. O consumo real já havia sido baixado anteriormente.`,
      });

      closeConfirmShowDialog(true);
      await Promise.all([fetchOrcamentos(), fetchProdutos()]);
    } catch (error) {
      console.error("Erro ao confirmar show:", error);
      toast({
        title: "Erro ao finalizar show",
        description: getReadableErrorMessage(
          error,
          "Não foi possível finalizar o show agora.",
        ),
        variant: "destructive",
      });
    } finally {
      setIsProcessingShowConfirmation(false);
    }
  };

  const handleFullEdit = useCallback((orcamento: OrcamentoCompleto) => {
    setSelectedOrcamento(orcamento);
    
    // Preparar dados do formulário
    setEditForm({
      nome_contratante: orcamento.nome_contratante,
      telefone: orcamento.telefone || '',
      cpf: orcamento.cpf || '',
      evento_nome: orcamento.evento_nome,
      evento_data: orcamento.evento_data,
      evento_hora: orcamento.evento_hora || '',
      evento_local: orcamento.evento_local,
      valor_total: orcamento.valor_total || 0,
      status: normalizeEditableStatus(orcamento.status),
      produtos: dedupeOrcamentoProdutos(orcamento.orcamentos_produtos)
        .map(op => ({
          produto_id: op.produto_id!,
          nome: op.produtos?.nome_produto || '',
          quantidade: op.quantidade,
          valor_unitario: op.produtos?.valor_venda || op.valor_unitario
        }))
    });
    
    setIsFullEditOpen(true);
  }, []);

  const handleSaveFullEdit = async () => {
    if (!selectedOrcamento) return;

    try {
      // Calcular valor total
      const valorTotal = editForm.produtos.reduce((sum, p) => {
        const quantidade = Number(p.quantidade) || 0;
        const valorUnitario = Number(p.valor_unitario) || 0;
        return sum + (quantidade * valorUnitario);
      }, 0);

      const statusAtual = normalizeOrcamentoStatus(selectedOrcamento.status);
      const novoStatus = normalizeEditableStatus(editForm.status);

      if (statusAtual === "realizado" && novoStatus !== "realizado") {
        toast({
          title: "Status bloqueado",
          description:
            "Orçamentos realizados não podem voltar para outros status pelo painel.",
          variant: "destructive",
        });
        return;
      }

      if (statusAtual !== "realizado" && novoStatus === "realizado") {
        toast({
          title: "Ação não permitida",
          description:
            "Para marcar como REALIZADO, use o fluxo manual de Confirmar Show.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualizar dados básicos do orçamento
      const { error: orcamentoError } = await supabase
        .from('orcamentos')
        .update({
          nome_contratante: editForm.nome_contratante,
          telefone: editForm.telefone,
          cpf: editForm.cpf,
          evento_nome: editForm.evento_nome,
          evento_data: editForm.evento_data,
          evento_hora: editForm.evento_hora || null,
          evento_local: editForm.evento_local,
          valor_total: valorTotal,
          status: novoStatus
        })
        .eq('id', selectedOrcamento.id);

      if (orcamentoError) throw orcamentoError;

      // Deletar produtos existentes
      const { error: deleteError } = await supabase
        .from('orcamentos_produtos')
        .delete()
        .eq('orcamento_id', selectedOrcamento.id);

      if (deleteError) throw deleteError;

      // Inserir novos produtos
      if (editForm.produtos.length > 0) {
        const novosProducts = editForm.produtos.map(p => ({
          orcamento_id: selectedOrcamento.id,
          produto_id: p.produto_id,
          quantidade: p.quantidade,
          valor_unitario: p.valor_unitario,
          valor_total: p.quantidade * p.valor_unitario
        }));

        const { error: insertError } = await supabase
          .from('orcamentos_produtos')
          .insert(novosProducts);

        if (insertError) throw insertError;
      }

      toast({
        title: "Orçamento atualizado!",
        description: "O orçamento foi atualizado com sucesso.",
      });

      setIsFullEditOpen(false);
      
      // Recarregar dados
      await fetchOrcamentos();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      toast({
        title: "Erro ao salvar",
        description: getReadableErrorMessage(error, "Não foi possível atualizar o orçamento"),
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: OrcamentoStatus) => {
    try {
      // Verificar se é um orçamento real ou convertido de solicitação
      if (id.startsWith('solicitacao_')) {
        // Para solicitações convertidas, não podemos atualizar status já que não existem na tabela orcamentos
        // Elas devem ser convertidas em orçamentos reais primeiro
        toast({
          title: "Ação não permitida",
          description: "Para alterar o status, primeiro converta a solicitação em orçamento.",
          variant: "destructive",
        });
        return;
      }

      if (newStatus === "realizado") {
        toast({
          title: "Ação não permitida",
          description: "Use o fluxo manual de Confirmar Show para finalizar o evento.",
          variant: "destructive",
        });
        return;
      }

      // Buscar orçamento atual
      const { data: orcamentoAtual, error: fetchError } = await supabase
        .from('orcamentos')
        .select("id, status")
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const statusAnterior = normalizeOrcamentoStatus(orcamentoAtual.status);
      if (statusAnterior === "realizado") {
        toast({
          title: "Status bloqueado",
          description:
            "Este orçamento já foi realizado e não pode ter o status alterado.",
          variant: "destructive",
        });
        return;
      }

      const dbStatus = normalizeEditableStatus(newStatus);
      if (dbStatus === statusAnterior) {
        setIsEditOpen(false);
        return;
      }

      // Atualizar status do orçamento no banco
      const { error } = await supabase
        .from('orcamentos')
        .update({ status: dbStatus })
        .eq('id', id);

      if (error) throw error;

      const statusMeta = getOrcamentoStatusMeta(dbStatus);
      toast({
        title: "Status atualizado",
        description: `Status do orçamento foi alterado para ${statusMeta.label}.`,
      });

      fetchOrcamentos();
      fetchProdutos(); // Atualizar lista de produtos para refletir mudanças no estoque
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  // Funções para gerenciar solicitações
  const handleViewSolicitacaoDetails = (solicitacao: SolicitacaoOrcamento) => {
    setSelectedSolicitacao(solicitacao);
    setIsSolicitacaoDetailsOpen(true);
  };

  const handleEditSolicitacao = (solicitacao: SolicitacaoOrcamento) => {
    // Se for solicitação de contratar equipe, abrir formulário de orçamento preenchido
    if (solicitacao.tipo_solicitacao === 'contratar_equipe') {
      setEditForm({
        nome_contratante: solicitacao.nome_completo,
        telefone: solicitacao.whatsapp,
        cpf: '',
        evento_nome: solicitacao.tipo_evento || 'Show Pirotécnico',
        evento_data: solicitacao.data_evento || '',
        evento_hora: solicitacao.hora_evento || '',
        evento_local: solicitacao.localizacao_evento || '',
        valor_total: 0,
        status: 'pendente',
        produtos: []
      });
      setEditingOrcamento(null);
      setIsOrcamentoDialogOpen(true);
      toast({
        title: "📋 Orçamento Iniciado",
        description: `Dados de ${solicitacao.nome_completo} carregados. Adicione produtos para completar.`,
        className: "border-blue-200 bg-blue-50 text-blue-800",
      });
    } else {
      // Para outros tipos, usar edição normal de solicitação
      setSelectedSolicitacao(solicitacao);
      setSolicitacaoEditForm({
        nome_completo: solicitacao.nome_completo,
        email: solicitacao.email || '',
        whatsapp: solicitacao.whatsapp,
        tipo_solicitacao: solicitacao.tipo_solicitacao,
        tipo_evento: solicitacao.tipo_evento || '',
        data_evento: solicitacao.data_evento || '',
        hora_evento: solicitacao.hora_evento || '',
        localizacao_evento: solicitacao.localizacao_evento || '',
        detalhes_adicionais: solicitacao.detalhes_adicionais || ''
      });
      setIsSolicitacaoEditOpen(true);
    }
  };

  const handleUpdateSolicitacao = async () => {
    if (!selectedSolicitacao) return;

    if (hasLeadsSource) {
      toast({
        title: "Edição indisponível",
        description: "Leads vêm de outro projeto (lead_submissions). Edite lá ou converta em orçamento aqui.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sanitizar dados para evitar erro de string vazia em colunas de tipo DATE/TIME
      const sanitizedData = {
        ...solicitacaoEditForm,
        data_evento: solicitacaoEditForm.data_evento || null,
        hora_evento: solicitacaoEditForm.hora_evento || null,
        email: solicitacaoEditForm.email || null,
        tipo_evento: solicitacaoEditForm.tipo_evento || null
      };

      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .update(sanitizedData)
        .eq('id', selectedSolicitacao.id);

      if (error && !isMissingTableError(error)) throw error;

      toast({
        title: "Solicitação atualizada",
        description: "As informações da solicitação foram atualizadas com sucesso.",
      });

      setIsSolicitacaoEditOpen(false);
      fetchSolicitacoes();
    } catch (error) {
      toast({
        title: "Erro ao atualizar solicitação",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSolicitacao = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;

    if (hasLeadsSource) {
      toast({
        title: "Exclusão bloqueada",
        description: "Leads externos não são excluídos daqui.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .delete()
        .eq('id', id);

      if (error && !isMissingTableError(error)) throw error;

      toast({
        title: "Solicitação excluída!",
        description: "A solicitação foi removida com sucesso.",
      });

      fetchSolicitacoes();
    } catch (error) {
      toast({
        title: "Erro ao excluir solicitação",
        description: "Não foi possível excluir a solicitação.",
        variant: "destructive",
      });
    }
  };

  const getOrcamentoStatusBadge = (status: string | null | undefined) => {
    const statusMeta = getOrcamentoStatusMeta(status);
    return (
      <Badge variant="outline" className={statusMeta.badgeClassName}>
        {statusMeta.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-40 sm:h-52 md:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex min-h-full w-full max-w-[1400px] flex-col gap-8 mx-auto">
        <div className="flex-1 space-y-8">
          {/* Título e Ações Principais Premium */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-[0.9]">
                Gestão de<br/>Orçamentos
              </h1>
              <p className="text-zinc-500 font-medium mt-3 tracking-wide">
                Inteligência comercial e conversão M5 Max.
              </p>
            </motion.div>
            
            <Button 
              onClick={() => setIsOrcamentoDialogOpen(true)}
              className="w-full bg-primary hover:bg-orange-500 text-black font-black uppercase tracking-[0.2em] text-[13px] rounded-2xl h-14 shadow-lg shadow-primary/20 transition-all"
            >
              Novo Orçamento
            </Button>
          </div>

          {/* Header Stats Side-by-side */}
          <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-zinc-500 mb-0.5">Total</p>
                <p className="text-xl font-black text-white">{stats.total}</p>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-orange-500 mb-0.5">Pendente</p>
                <p className="text-xl font-black text-orange-500">{stats.pendentes}</p>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-emerald-500 mb-0.5">Confir.</p>
                <p className="text-xl font-black text-emerald-500">{stats.confirmados}</p>
              </div>
          </div>
          {/* Busca e Filtros Inteligentes */}
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary sm:left-6 sm:h-6 sm:w-6" />
              <Input
                placeholder="Buscar por cliente, evento, localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-[22px] border-white/[0.06] bg-white/[0.02] pl-12 text-base font-medium shadow-2xl transition-all placeholder:text-white/10 focus:border-primary/40 focus:ring-0 sm:h-16 sm:rounded-[24px] sm:pl-16 sm:text-lg"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-white/[0.01] border border-white/5 p-3 sm:p-4 rounded-[22px] sm:rounded-[24px]">
              <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] mr-2 ml-2">Filtros Operacionais</span>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 rounded-full px-4 sm:px-6 focus:ring-primary/40 text-[10px] font-black uppercase tracking-widest min-w-[150px] sm:min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3 w-3 text-primary" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 rounded-2xl">
                  <SelectItem value="all" className="rounded-xl font-medium">Todos Status</SelectItem>
                  <SelectItem value="pendente" className="rounded-xl font-medium">Pendentes</SelectItem>
                  <SelectItem value="confirmado" className="rounded-xl font-medium">Confirmados</SelectItem>
                  <SelectItem value="realizado" className="rounded-xl font-medium">Realizados</SelectItem>
                  <SelectItem value="cancelado" className="rounded-xl font-medium">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 rounded-full px-4 sm:px-6 focus:ring-primary/40 text-[10px] font-black uppercase tracking-widest min-w-[170px] sm:min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-primary" />
                    <SelectValue placeholder="Tipo de Operação" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 rounded-2xl">
                  <SelectItem value="all" className="rounded-xl font-medium">Todos Tipos</SelectItem>
                  <SelectItem value="show_pirotecnico" className="rounded-xl font-medium">Show Pirotécnico</SelectItem>
                  <SelectItem value="venda_artigos" className="rounded-xl font-medium">Venda de Artigos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs de Navegação */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="mb-8 flex h-14 w-full rounded-[20px] border border-white/5 bg-white/[0.02] p-1.5 md:mb-10 md:h-16 md:w-fit md:rounded-full">
              <TabsTrigger 
                value="solicitacoes" 
                className="flex-1 md:w-60 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-black tracking-widest text-[10px] uppercase transition-all duration-500 h-full"
              >
                Entrada de Leads ({solicitacoes.length})
              </TabsTrigger>
              <TabsTrigger 
                value="orcamentos" 
                className="flex-1 md:w-60 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg font-black tracking-widest text-[10px] uppercase transition-all duration-500 h-full"
              >
                Propostas ({orcamentos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solicitacoes" className="mt-0 outline-none focus-visible:ring-0">
              <Card className="overflow-hidden rounded-[28px] border-white/5 bg-white/[0.01] shadow-2xl sm:rounded-[40px]">
                <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 bg-white/[0.01] hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16 pl-10">Qualificação do Lead</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Tipo / Serviço</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Planejamento</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16 pr-10 text-right">Controle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSolicitacoes.map((solicitacao) => (
                      <TableRow key={solicitacao.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="pl-10 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{solicitacao.nome_completo}</span>
                            <span className="text-xs text-muted-foreground/60 font-medium tracking-tight mt-1">{solicitacao.whatsapp}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-lg">
                            {getTipoLabel(solicitacao.tipo_solicitacao)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 font-bold text-xs text-foreground/90">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              {solicitacao.data_evento ? formatDateOnly(solicitacao.data_evento) : 'DATA A DEFINIR'}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[180px]">{solicitacao.localizacao_evento || 'LOCAL NÃO INFORMADO'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] font-black uppercase tracking-[0.15em] py-1.5 px-4 rounded-full border shadow-sm",
                            solicitacao.enviado_email 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-primary/10 text-primary border-primary/20 animate-pulse"
                          )}>
                            {solicitacao.enviado_email ? "CONVERTIDO" : "PENDENTE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-10 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!solicitacao.enviado_email && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-10 w-10 rounded-xl hover:bg-green-500/10 hover:text-green-500 transition-all border border-transparent hover:border-green-500/20"
                                onClick={() => handleMarkSolicitacaoProcessed(solicitacao.id)}
                                title="Converter lead"
                              >
                                <CheckCircle className="h-5 w-5" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                              onClick={() => handleViewSolicitacaoDetails(solicitacao)}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                              onClick={() => handleEditSolicitacao(solicitacao)}
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                              onClick={() => handleDeleteSolicitacao(solicitacao.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="space-y-4 p-4 md:hidden sm:p-6 sm:space-y-6">
                {filteredSolicitacoes.map((solicitacao) => (
                  <SolicitacaoCard
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                    onView={handleViewSolicitacaoDetails}
                    onEdit={handleEditSolicitacao}
                    onDelete={handleDeleteSolicitacao}
                    onProcess={handleMarkSolicitacaoProcessed}
                    formatDate={formatDate}
                    getTipoLabel={getTipoLabel}
                    getStatusColor={getStatusColor}
                  />
                ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orcamentos" className="mt-0 outline-none focus-visible:ring-0">
          <Card className="glass-card overflow-hidden rounded-[28px] border-white/5 shadow-2xl sm:rounded-[2.5rem]">
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 bg-white/[0.01] hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16 pl-10">Cliente / Contratante</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Projeto / Agenda</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Volume Financeiro</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16">Fase Comercial</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-primary h-16 pr-10 text-right">Controle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrcamentos.map((orcamento) => {
                      const normalizedStatus = normalizeOrcamentoStatus(orcamento.status);
                      const statusLocked = normalizedStatus === "realizado";
                      const showConfirmationAvailable = canRunShowConfirmation(orcamento);

                      return (
                      <TableRow key={orcamento.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="pl-10 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{orcamento.nome_contratante}</span>
                            <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1">Ref: {orcamento.id.slice(0, 8)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <div className="font-bold text-xs text-foreground/90 uppercase truncate max-w-[200px]">{orcamento.evento_nome}</div>
                            <div className="flex items-center gap-2 text-[11px] text-primary font-bold">
                              <Calendar className="h-3.5 w-3.5" />
                              {orcamento.evento_data ? formatDateOnly(orcamento.evento_data) : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-lg font-black text-foreground tracking-tighter">
                              R$ {(orcamento.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                              {orcamento.orcamentos_produtos?.length || 0} Itens Composição
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getOrcamentoStatusBadge(orcamento.status || 'pendente')}
                        </TableCell>
                        <TableCell className="pr-10 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                              onClick={() => handleViewDetails(orcamento)}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-orange-500/10 hover:text-orange-500 transition-all border border-transparent hover:border-orange-500/20"
                              onClick={() => handleGeneratePDF(orcamento)}
                            >
                              <FileText className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                              onClick={() => handleFullEdit(orcamento)}
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost" 
                              size="icon" 
                              disabled={statusLocked}
                              className={cn(
                                "h-10 w-10 rounded-xl transition-all border border-transparent",
                                showConfirmationAvailable
                                  ? "hover:bg-cyan-500/10 hover:text-cyan-500 hover:border-cyan-500/20"
                                  : "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20",
                                statusLocked && "opacity-40 cursor-not-allowed",
                              )}
                              title={
                                statusLocked
                                  ? "Status bloqueado após realizado"
                                  : showConfirmationAvailable
                                    ? "Confirmar Show"
                                    : "Mudar status"
                              }
                              onClick={() => {
                                if (showConfirmationAvailable) {
                                  handleOpenConfirmShow(orcamento);
                                  return;
                                }
                                handleEditOrcamento(orcamento);
                              }}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteOrcamento(orcamento.id)}
                              className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="space-y-4 p-4 md:hidden sm:p-6 sm:space-y-6">
                {filteredOrcamentos.map((orcamento) => (
                  <OrcamentoCard
                    key={orcamento.id}
                    orcamento={orcamento}
                    onView={handleViewDetails}
                    onEdit={handleEditOrcamento}
                    onFullEdit={handleFullEdit}
                    onDelete={handleDeleteOrcamento}
                    onGeneratePdf={handleGeneratePDF}
                    formatDate={formatDate}
                    />
                    ))}
                    </div>
                    </CardContent>
                    </Card>
                    </TabsContent>
                    </Tabs>
                    </div>
      {/* Os modais (Dialogs) permanecem os mesmos mas herdam o tema Midnight via CSS global */}
      {/* Modal de Orçamento */}
      <Dialog open={isOrcamentoDialogOpen} onOpenChange={setIsOrcamentoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[calc(100dvh-0.75rem)] overflow-y-auto bg-card/95 backdrop-blur-xl border-white/5 rounded-[28px] md:rounded-[2.5rem] p-5 md:p-10">
          <DialogHeader className="mb-6 md:mb-8">
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Criar Proposta Comercial</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">Configure os produtos, margens e dados do cliente para gerar um novo orçamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-10">
            {/* Dados do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="tipo" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Tipo de Operação</Label>
                <Select 
                  value={orcamentoForm.tipo} 
                  onValueChange={(value: 'show_pirotecnico' | 'venda_artigos') => 
                    setOrcamentoForm({...orcamentoForm, tipo: value})
                  }
                >
                  <SelectTrigger className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 rounded-2xl">
                    <SelectItem value="venda_artigos" className="rounded-xl font-medium">Venda de Artigos</SelectItem>
                    <SelectItem value="show_pirotecnico" className="rounded-xl font-medium">Show Pirotécnico (Operação)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="nome_contratante" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Nome do Contratante</Label>
                <Input
                  id="nome_contratante"
                  value={orcamentoForm.nome_contratante}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, nome_contratante: e.target.value})}
                  placeholder="Nome completo do cliente"
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="telefone" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Telefone de Contato</Label>
                <Input
                  id="telefone"
                  value={orcamentoForm.telefone}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, telefone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="cpf" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">CPF / Documento</Label>
                <Input
                  id="cpf"
                  value={orcamentoForm.cpf}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold font-mono"
                />
              </div>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Dados do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label htmlFor="evento_nome" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Título do Projeto</Label>
                <Input
                  id="evento_nome"
                  value={orcamentoForm.evento_nome}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, evento_nome: e.target.value})}
                  placeholder="Ex: Casamento Silva, Show de Virada..."
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="evento_data" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Data Agendada</Label>
                <Input
                  id="evento_data"
                  type="date"
                  value={orcamentoForm.evento_data}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, evento_data: e.target.value})}
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="evento_hora" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Horário (Opcional)</Label>
                <Input
                  id="evento_hora"
                  type="time"
                  value={orcamentoForm.evento_hora || ''}
                  onChange={(e) => setOrcamentoForm({...orcamentoForm, evento_hora: e.target.value})}
                  className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold color-scheme-dark"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="evento_local" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Localização da Operação</Label>
              <Input
                id="evento_local"
                value={orcamentoForm.evento_local}
                onChange={(e) => setOrcamentoForm({...orcamentoForm, evento_local: e.target.value})}
                placeholder="Endereço completo onde ocorrerá o show ou entrega"
                className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold"
              />
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Seleção de Produtos */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  Itens da Composição ({selectedProducts.length})
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedProducts([])}
                  className="text-red-400 hover:bg-red-500/10 h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-widest"
                  disabled={selectedProducts.length === 0}
                >
                  Esvaziar Lista
                </Button>
              </div>

              {selectedProducts.length > 0 ? (
                <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/[0.03] border-white/5">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary h-12 pl-6">Produto</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary h-12">Valor Unit.</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary h-12">Qtd</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary h-12 text-right">Subtotal</TableHead>
                        <TableHead className="w-12 h-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index} className="border-white/5 hover:bg-white/[0.02]">
                          <TableCell className="font-bold text-sm pl-6 py-4">{product.nome}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.valor_unitario}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value) || 0;
                                updateProductInOrcamento(index, {
                                  ...product,
                                  valor_unitario: newValue
                                });
                              }}
                              className="h-10 bg-white/5 border-white/5 w-24 rounded-xl text-center font-bold"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={product.quantidade}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                updateProductInOrcamento(index, {
                                  ...product,
                                  quantidade: newQty
                                });
                              }}
                              className="h-10 bg-white/5 border-white/5 w-20 rounded-xl text-center font-bold"
                            />
                          </TableCell>
                          <TableCell className="text-right font-black text-foreground">
                            R$ {(product.quantidade * product.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="pr-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProductFromOrcamento(index)}
                              className="h-8 w-8 text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-12 text-center bg-white/[0.01]">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground font-medium">A composição do orçamento está vazia.</p>
                  <p className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest mt-2">Selecione itens no catálogo abaixo</p>
                </div>
              )}

              {/* Seletor de produtos simplificado */}
              <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Catálogo Disponível
                  </h4>
                  <div className="relative w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Filtrar catálogo..."
                      className="pl-9 h-10 bg-white/5 border-white/5 rounded-xl text-xs"
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {produtos.filter(p => 
                      p.ativo && (p.nome_produto.toLowerCase().includes(productSearchTerm.toLowerCase()) || p.codigo?.toLowerCase().includes(productSearchTerm.toLowerCase()))
                    ).slice(0, 12).map(produto => (
                      <div key={produto.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter truncate">{produto.codigo}</span>
                          <span className="font-bold text-xs text-foreground truncate">{produto.nome_produto}</span>
                          <span className="text-[10px] font-black text-foreground/80 mt-1">R$ {produto.valor_venda.toFixed(2)}</span>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all ml-4"
                          onClick={() => {
                            addProductToOrcamento({
                              produto_id: produto.id,
                              nome: produto.nome_produto,
                              valor_unitario: produto.valor_venda,
                              quantidade: 1
                            });
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Pagamento e Lucratividade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="modo_pagamento" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Condição de Pagamento</Label>
                <Select 
                  value={orcamentoForm.modo_pagamento} 
                  onValueChange={(value: 'dinheiro' | 'pix' | 'cartao' | 'transferencia') => 
                    setOrcamentoForm({...orcamentoForm, modo_pagamento: value})
                  }
                >
                  <SelectTrigger className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 rounded-2xl">
                    <SelectItem value="dinheiro" className="rounded-xl font-medium">Dinheiro à Vista</SelectItem>
                    <SelectItem value="pix" className="rounded-xl font-medium">PIX Instantâneo</SelectItem>
                    <SelectItem value="cartao" className="rounded-xl font-medium">Cartão de Crédito/Débito</SelectItem>
                    <SelectItem value="transferencia" className="rounded-xl font-medium">Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="margem_lucro" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Margem Operacional (%)</Label>
                <div className="relative">
                  <Input
                    id="margem_lucro"
                    type="number"
                    min="0"
                    max="100"
                    value={orcamentoForm.margem_lucro}
                    onChange={(e) => setOrcamentoForm({...orcamentoForm, margem_lucro: parseFloat(e.target.value) || 0})}
                    className="h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/40 text-sm font-black pr-12"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
                </div>
              </div>
            </div>

            {/* Bloco de Fechamento Financeiro */}
            <Card className="bg-primary/10 border-primary/20 p-8 rounded-[2rem] shadow-lg shadow-primary/5">
               <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between md:justify-start md:gap-20 items-center">
                      <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Custo Base:</span>
                      <span className="text-lg font-bold text-foreground">R$ {selectedProducts.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:gap-20 items-center">
                      <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Overhead ({orcamentoForm.margem_lucro}%):</span>
                      <span className="text-lg font-bold text-primary">R$ {(calculateOrcamentoTotal() - selectedProducts.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="h-px md:h-20 md:w-px bg-primary/20"></div>
                  <div className="flex flex-col items-center md:items-end justify-center">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Total do Projeto</span>
                    <span className="text-4xl font-black text-foreground tracking-tighter">R$ {calculateOrcamentoTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </Card>

            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button 
                onClick={handleCreateOrcamento} 
                disabled={selectedProducts.length === 0} 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-lg shadow-sm transition-all"
              >
                Gerar e Salvar Orçamento
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOrcamentoDialogOpen(false)} 
                className="h-16 px-10 bg-white/5 border-white/10 rounded-[1.5rem] font-bold text-muted-foreground hover:text-foreground"
              >
                Descartar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        {/* Modal de Detalhes do Orçamento - VERSÃO PREMIUM (MOBILE FIRST) */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="p-0 border-none bg-[#050505] max-w-4xl w-[calc(100vw-0.75rem)] h-[calc(100dvh-0.75rem)] sm:w-full sm:h-[92vh] rounded-[28px] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header Premium (Fixo) */}
            <div className="shrink-0 bg-black/20 backdrop-blur-xl border-b border-white/[0.05] px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:py-5 flex items-center justify-between z-50">
              <div className="flex flex-col">
                <DialogTitle className="text-lg md:text-2xl font-black text-white tracking-tight uppercase">
                  Ficha do Orçamento<span className="text-primary">.</span>
                </DialogTitle>
                <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Visão Estratégica</span>
              </div>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            {selectedOrcamento && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scroll Content */}
                <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 space-y-8 md:space-y-10 scrollbar-thin scrollbar-track-transparent pb-32 md:pb-40">
                  
                  {/* Dados do Cliente e Operação */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 ml-1">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h3 className="font-bold text-xs uppercase tracking-[0.3em] text-white/40">Dados Comerciais</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">Cliente</Label>
                        <p className="text-base font-bold text-white">{selectedOrcamento.nome_contratante}</p>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">WhatsApp</Label>
                        <p className="text-base font-bold text-white/80">{selectedOrcamento.telefone || 'Não informado'}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">CPF / CNPJ</Label>
                        <p className="text-base font-bold text-white/80">{selectedOrcamento.cpf || 'Não informado'}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">Status da Proposta</Label>
                        <div className="mt-1">
                          {getOrcamentoStatusBadge(selectedOrcamento.status || 'pendente')}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">Tipo de Venda</Label>
                        <p className="text-sm font-bold text-white/60">
                          {selectedOrcamento.tipo === 'show_pirotecnico' ? 'Show Pirotécnico' : 'Venda Direta'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Label className="text-[9px] uppercase font-black text-primary mb-1.5 block tracking-widest">Pagamento</Label>
                        <p className="text-sm font-bold text-white/60 capitalize">{selectedOrcamento.modo_pagamento || 'A definir'}</p>
                      </div>
                    </div>
                  </section>

                  {/* Detalhes do Projeto / Show */}
                  <section className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                      <Calendar className="h-24 w-24" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-black text-primary tracking-widest block">Projeto</Label>
                        <p className="text-lg font-black text-white">{selectedOrcamento.evento_nome}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-black text-primary tracking-widest block">Data e Hora do Evento</Label>
                        <div className="flex items-center gap-2 flex-wrap">
                           <div className="flex items-center gap-2">
                             <Calendar className="h-4 w-4 text-primary" />
                             <p className="text-lg font-black text-white">{formatDateOnly(selectedOrcamento.evento_data)}</p>
                           </div>
                           {selectedOrcamento.evento_hora && (
                             <div className="flex items-center gap-2 border-l border-white/10 pl-2 ml-1">
                               <Clock className="h-4 w-4 text-primary" />
                               <p className="text-lg font-black text-white">{selectedOrcamento.evento_hora.substring(0, 5)}</p>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <Label className="text-[9px] uppercase font-black text-primary tracking-widest block">Local da Operação</Label>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <p className="text-base font-medium text-white/70">{selectedOrcamento.evento_local || 'Local não especificado'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Composição de Itens */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/70">Itens Técnicos</h3>
                        <span className="text-[9px] font-bold text-white/20 uppercase mt-1 tracking-widest">Detalhamento de Consumo</span>
                      </div>
                      <Badge className="bg-white/5 text-white/40 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                        {selectedOrcamento.orcamentos_produtos?.length || 0} Itens
                      </Badge>
                    </div>

                    {selectedOrcamento.orcamentos_produtos && selectedOrcamento.orcamentos_produtos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrcamento.orcamentos_produtos.map((item, index) => (
                          <div key={index} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-5 transition-all hover:bg-white/[0.04]">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20 shrink-0">
                               <span className="text-[8px] font-black text-primary uppercase">Qtd</span>
                               <span className="text-xl font-black text-white leading-none">{item.quantidade}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-sm font-black text-white leading-tight mb-1 truncate">{item.produtos?.nome_produto || 'Item não localizado'}</p>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.produtos?.codigo || 'S/N'}</span>
                                  <div className="h-2 w-px bg-white/5" />
                                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Dur: {item.produtos?.duracao_segundos ? `${item.produtos.duracao_segundos}s` : '—'}</span>
                                  {item.produtos?.efeito && (
                                    <>
                                      <div className="h-2 w-px bg-white/5" />
                                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{item.produtos.efeito}</span>
                                    </>
                                  )}
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-white">R$ {(item.quantidade * item.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                               <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">R$ {item.valor_unitario.toFixed(2)} un.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 border border-dashed border-white/10 rounded-[2rem] text-center bg-white/[0.01]">
                        <Package className="h-12 w-12 mx-auto text-white/5 mb-4" />
                        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Nenhum item vinculado</p>
                      </div>
                    )}
                  </section>
                </div>

                {/* Footer de Impacto Financeiro (Fixo) */}
                <div className="shrink-0 bg-[#080808]/95 backdrop-blur-3xl border-t border-white/5 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 z-50">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Investimento Total</span>
                    <div className="flex items-baseline justify-center md:justify-start gap-1">
                      <span className="text-sm font-bold text-white/30">R$</span>
                      <span className="text-5xl font-black text-white tracking-tighter">
                        {(selectedOrcamento.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {normalizeOrcamentoStatus(selectedOrcamento.status) === 'pendente' && (
                      <Button 
                        onClick={() => {
                          handleUpdateStatus(selectedOrcamento.id, 'confirmado');
                          setIsDetailsOpen(false);
                        }}
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl h-14 px-8 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                      >
                        Confirmar Orçamento
                      </Button>
                    )}
                    {normalizeOrcamentoStatus(selectedOrcamento.status) === "confirmado" && (
                      <Button
                        onClick={() => {
                          handleOpenConfirmShow(selectedOrcamento);
                          setIsDetailsOpen(false);
                        }}
                        disabled={!canRunShowConfirmation(selectedOrcamento)}
                        className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl h-14 px-8 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                        title={
                          canRunShowConfirmation(selectedOrcamento)
                            ? "Confirmar Show"
                            : "Disponível apenas na data do evento ou depois"
                        }
                      >
                        Confirmar Show
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDetailsOpen(false)}
                      className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white/60 font-bold rounded-2xl h-14 px-10"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>

                {normalizeOrcamentoStatus(selectedOrcamento.status) === "confirmado" &&
                  !canRunShowConfirmation(selectedOrcamento) && (
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                       <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">
                         O fechamento do show será habilitado na data do evento ou depois.
                       </p>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição de Status */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-background border-border rounded-[28px] p-5 md:p-8">
            <DialogHeader className="mb-4 md:mb-6">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">Editar Status do Orçamento</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Altere o status do orçamento conforme necessário
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrcamento && (
              <div className="space-y-4">
                <div>
                  <Label>Cliente: {selectedOrcamento.nome_contratante}</Label>
                  <p className="text-sm text-muted-foreground">Evento: {selectedOrcamento.evento_nome}</p>
                </div>

                {isStatusLocked(selectedOrcamento.status) ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                    Este orçamento já foi finalizado como REALIZADO. O status permanece bloqueado.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Novo Status</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {MANUAL_STATUS_OPTIONS.map((statusOption) => (
                          <Button
                            key={statusOption.value}
                            variant={
                              normalizeOrcamentoStatus(selectedOrcamento.status) === statusOption.value
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              handleUpdateStatus(selectedOrcamento.id, statusOption.value);
                              setIsEditOpen(false);
                            }}
                            className={`text-xs ${statusOption.value === "cancelado" ? "col-span-2" : ""}`}
                          >
                            {statusOption.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {normalizeOrcamentoStatus(selectedOrcamento.status) === "confirmado" && (
                      <Button
                        className="w-full"
                        onClick={() => {
                          handleOpenConfirmShow(selectedOrcamento);
                          setIsEditOpen(false);
                        }}
                        disabled={!canRunShowConfirmation(selectedOrcamento)}
                      >
                        Confirmar Show
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação Manual do Show */}
        <Dialog open={isConfirmShowOpen} onOpenChange={closeConfirmShowDialog}>
          <DialogContent className="admin-modal-panel max-w-5xl md:max-h-[90vh]">
            <div className="flex h-full min-h-0 flex-col">
              <DialogHeader className="admin-modal-header space-y-2 text-left">
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Confirmar Show
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Revise consumo, valor final e pendências de estoque antes de concluir o evento.
                </DialogDescription>
              </DialogHeader>

              {confirmShowOrcamento && (
                <>
                  <div className="admin-modal-body space-y-5">
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <div className="admin-stat-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                          Cliente
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {confirmShowOrcamento.nome_contratante}
                        </p>
                      </div>

                      <div className="admin-stat-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                          Evento
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {confirmShowOrcamento.evento_nome}
                        </p>
                      </div>

                      <div className="admin-stat-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                          Data
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {confirmShowOrcamento.evento_data
                            ? formatDateOnly(confirmShowOrcamento.evento_data)
                            : "Não informada"}
                        </p>
                      </div>

                      <div className="admin-stat-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                          Status
                        </p>
                        <div className="mt-2">
                          {getOrcamentoStatusBadge(confirmShowOrcamento.status || "pendente")}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="admin-stat-card border-primary/10 bg-background/60 p-4 shadow-none">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Valor Atual
                          </Label>
                          <p className="mt-2 text-xl font-semibold text-foreground">
                            R${" "}
                            {confirmShowOriginalTotal.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <div className="admin-stat-card border-primary/10 bg-background/60 p-4 shadow-none">
                          <Label
                            htmlFor="confirm-show-final-total"
                            className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            Valor Final
                          </Label>
                          <Input
                            id="confirm-show-final-total"
                            type="number"
                            min="0"
                            step="0.01"
                            value={confirmShowFinalTotal}
                            onChange={(event) =>
                              handleConfirmShowTotalChange(event.target.value)
                            }
                            disabled={isProcessingShowConfirmation}
                            className="mt-2 h-11 rounded-xl border-white/10 bg-background/70 text-base md:text-sm"
                          />
                        </div>

                        <div className="admin-stat-card border-primary/10 bg-background/60 p-4 shadow-none">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Desconto Aplicado
                          </Label>
                          <p className="mt-2 text-xl font-semibold text-emerald-400">
                            R${" "}
                            {confirmShowDiscountValue.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {insufficientShowItems.length > 0 && (
                      <div className="rounded-2xl border border-destructive/35 bg-destructive/10 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-destructive">
                              Estoque insuficiente em {insufficientShowItems.length} item(ns)
                            </p>
                            <ul className="space-y-1 text-sm text-destructive">
                              {insufficientShowItems.map((item) => (
                                <li key={`insuf-${item.produto_id}`}>
                                  {item.nome_produto}: disponível {item.quantidade_disponivel}, uso{" "}
                                  {item.quantidade_usada}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 md:max-w-sm">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="allow-finalize-without-stock"
                                checked={allowFinalizeWithoutStock}
                                onCheckedChange={(checked) =>
                                  setAllowFinalizeWithoutStock(checked === true)
                                }
                                className="mt-1"
                              />
                              <div className="space-y-1">
                                <Label
                                  htmlFor="allow-finalize-without-stock"
                                  className="text-sm font-medium leading-relaxed text-foreground"
                                >
                                  Permitir marcar como REALIZADO mesmo sem estoque suficiente
                                </Label>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                  Os itens sem saldo ficam registrados no histórico sem baixa de estoque.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <section className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            Consumo por item
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Em mobile os ajustes aparecem em cartões para reduzir rolagem lateral.
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground"
                        >
                          {confirmShowAvailability.length} item(ns)
                        </Badge>
                      </div>

                      <div className="space-y-3 md:hidden">
                        {confirmShowAvailability.map((item, index) => (
                          <div
                            key={`${item.produto_id}-${index}`}
                            className={cn(
                              "rounded-2xl border p-4 shadow-floating",
                              item.estoque_insuficiente
                                ? "border-destructive/30 bg-destructive/5"
                                : "border-white/10 bg-white/[0.03]",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {item.nome_produto}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                    Plano: {item.quantidade_planejada}
                                  </p>
                                  {item.efeito && (
                                    <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">
                                      • {item.efeito}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 rounded-full px-2.5 py-1 text-[11px]",
                                  item.estoque_insuficiente
                                    ? "border-destructive/30 bg-destructive/12 text-destructive"
                                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                                )}
                              >
                                {item.estoque_insuficiente
                                  ? `Falta ${item.quantidade_faltante}`
                                  : "Saldo OK"}
                              </Badge>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-2xl border border-white/10 bg-background/60 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                  Estoque atual
                                </p>
                                <p
                                  className={cn(
                                    "mt-2 text-lg font-semibold",
                                    item.estoque_insuficiente
                                      ? "text-destructive"
                                      : "text-foreground",
                                  )}
                                >
                                  {item.quantidade_disponivel}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-white/10 bg-background/60 p-3">
                                <Label
                                  htmlFor={`show-usage-${item.produto_id}-${index}`}
                                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                  Qtd usada
                                </Label>
                                <Input
                                  id={`show-usage-${item.produto_id}-${index}`}
                                  type="number"
                                  min="0"
                                  value={item.quantidade_usada}
                                  onChange={(event) =>
                                    handleConfirmShowItemUsageChange(
                                      index,
                                      event.target.value,
                                    )
                                  }
                                  className="mt-2 h-11 rounded-xl border-white/10 bg-background/80 text-base"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="hidden overflow-hidden rounded-2xl border border-primary/20 md:block">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-primary/20 bg-primary/5">
                              <TableHead className="!text-primary font-semibold">
                                Produto
                              </TableHead>
                              <TableHead className="!text-primary font-semibold">
                                Qtd Planejada
                              </TableHead>
                              <TableHead className="!text-primary font-semibold">
                                Estoque Atual
                              </TableHead>
                              <TableHead className="!text-primary font-semibold">
                                Qtd Usada
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {confirmShowAvailability.map((item, index) => (
                              <TableRow
                                key={`${item.produto_id}-${index}`}
                                className={cn(
                                  "border-primary/10",
                                  item.estoque_insuficiente && "bg-destructive/5",
                                )}
                              >
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span className="text-white">{item.nome_produto}</span>
                                    {item.efeito && (
                                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">{item.efeito}</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{item.quantidade_planejada}</TableCell>
                                <TableCell>
                                  <span
                                    className={cn(
                                      "font-medium",
                                      item.estoque_insuficiente && "text-destructive",
                                    )}
                                  >
                                    {item.quantidade_disponivel}
                                  </span>
                                  {item.estoque_insuficiente && (
                                    <p className="text-xs text-destructive">
                                      Falta {item.quantidade_faltante}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={item.quantidade_usada}
                                    onChange={(event) =>
                                      handleConfirmShowItemUsageChange(
                                        index,
                                        event.target.value,
                                      )
                                    }
                                    className="h-11 w-28 rounded-xl border-white/10 bg-background/80"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </section>
                  </div>

                  <div className="admin-modal-footer">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                          Consumo informado
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {confirmShowAvailability.reduce(
                            (sum, item) => sum + (Number(item.quantidade_usada) || 0),
                            0,
                          )}{" "}
                          item(ns)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Se o total ficar 0, o orçamento será marcado como cancelado.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:flex md:justify-end">
                        <Button
                          variant="outline"
                          onClick={closeConfirmShowDialog}
                          disabled={isProcessingShowConfirmation}
                          className="touch-target h-11 rounded-xl border-white/10 bg-white/[0.03]"
                        >
                          Fechar
                        </Button>
                        <Button
                          onClick={handleConfirmShowCompletion}
                          disabled={
                            isProcessingShowConfirmation ||
                            (insufficientShowItems.length > 0 &&
                              !allowFinalizeWithoutStock)
                          }
                          className="touch-target h-11 rounded-xl"
                        >
                          {isProcessingShowConfirmation ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Finalizando...
                            </>
                          ) : insufficientShowItems.length > 0 &&
                            !allowFinalizeWithoutStock ? (
                            "Autorize a exceção"
                          ) : (
                            "Finalizar Show"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Detalhes da Solicitação */}
        <Dialog open={isSolicitacaoDetailsOpen} onOpenChange={setIsSolicitacaoDetailsOpen}>
          <DialogContent className="max-w-2xl bg-background border-border rounded-[28px] p-5 md:p-8">
            <DialogHeader className="mb-4 md:mb-6">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">Detalhes da Solicitação</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Informações completas sobre a solicitação de orçamento
              </DialogDescription>
            </DialogHeader>
            
            {selectedSolicitacao && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nome Completo</Label>
                    <p className="text-sm mt-1">{selectedSolicitacao.nome_completo}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedSolicitacao.enviado_email || false)} text-xs`}>
                        {selectedSolicitacao.enviado_email ? "Processada" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">WhatsApp</Label>
                    <p className="text-sm mt-1">{selectedSolicitacao.whatsapp}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm mt-1">{selectedSolicitacao.email || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Tipo de Solicitação</Label>
                    <p className="text-sm mt-1">{getTipoLabel(selectedSolicitacao.tipo_solicitacao)}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Tipo de Evento</Label>
                    <p className="text-sm mt-1">{selectedSolicitacao.tipo_evento || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Data e Hora do Evento</Label>
                    <p className="text-sm mt-1">
                      {selectedSolicitacao.data_evento ? formatDateOnly(selectedSolicitacao.data_evento) : 'Não informado'}
                      {selectedSolicitacao.hora_evento ? ` às ${selectedSolicitacao.hora_evento.substring(0, 5)}` : ''}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Localização</Label>
                    <p className="text-sm mt-1">{selectedSolicitacao.localizacao_evento || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Recebido em</Label>
                    <p className="text-sm mt-1">{formatDate(selectedSolicitacao.created_at!)}</p>
                  </div>
                </div>
                
                {selectedSolicitacao.detalhes_adicionais && (
                  <div>
                    <Label className="text-sm font-medium">Detalhes Adicionais</Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedSolicitacao.detalhes_adicionais}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4">
                  {!selectedSolicitacao.enviado_email && (
                    <Button 
                      onClick={() => {
                        handleMarkSolicitacaoProcessed(selectedSolicitacao.id);
                        setIsSolicitacaoDetailsOpen(false);
                      }}
                    >
                      Marcar como Processada
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsSolicitacaoDetailsOpen(false);
                      handleEditSolicitacao(selectedSolicitacao);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSolicitacaoDetailsOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edição da Solicitação */}
        <Dialog open={isSolicitacaoEditOpen} onOpenChange={setIsSolicitacaoEditOpen}>
          <DialogContent className="max-w-2xl max-h-[calc(100dvh-0.75rem)] overflow-y-auto bg-background border-border rounded-[28px] p-5 md:p-8">
            <DialogHeader className="mb-4 md:mb-6">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground">Editar Solicitação</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Modifique as informações da solicitação de orçamento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_completo" className="text-foreground">Nome Completo</Label>
                  <Input
                    id="nome_completo"
                    value={solicitacaoEditForm.nome_completo}
                    onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, nome_completo: e.target.value})}
                    placeholder="Nome completo do cliente"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp" className="text-foreground">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={solicitacaoEditForm.whatsapp}
                    onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, whatsapp: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={solicitacaoEditForm.email}
                    onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo_solicitacao" className="text-foreground">Tipo de Solicitação</Label>
                  <Select 
                    value={solicitacaoEditForm.tipo_solicitacao} 
                    onValueChange={(value) => setSolicitacaoEditForm({...solicitacaoEditForm, tipo_solicitacao: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artigos_pirotecnicos">Artigos Pirotécnicos</SelectItem>
                      <SelectItem value="contratar_equipe">Contratar Equipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipo_evento" className="text-foreground">Tipo de Evento</Label>
                  <Input
                    id="tipo_evento"
                    value={solicitacaoEditForm.tipo_evento}
                    onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, tipo_evento: e.target.value})}
                    placeholder="Ex: Casamento, Formatura..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="data_evento" className="text-foreground">Data do Evento</Label>
                  <Input
                    id="data_evento"
                    type="date"
                    value={solicitacaoEditForm.data_evento}
                    onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, data_evento: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="localizacao_evento" className="text-foreground">Localização do Evento</Label>
                <Input
                  id="localizacao_evento"
                  value={solicitacaoEditForm.localizacao_evento}
                  onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, localizacao_evento: e.target.value})}
                  placeholder="Endereço do evento"
                />
              </div>
              
              <div>
                <Label htmlFor="detalhes_adicionais" className="text-foreground">Detalhes Adicionais</Label>
                <Textarea
                  id="detalhes_adicionais"
                  value={solicitacaoEditForm.detalhes_adicionais}
                  onChange={(e) => setSolicitacaoEditForm({...solicitacaoEditForm, detalhes_adicionais: e.target.value})}
                  placeholder="Informações adicionais sobre a solicitação..."
                  rows={4}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsSolicitacaoEditOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateSolicitacao}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição Completa do Orçamento - VERSÃO 3 FINAL (PRODUÇÃO) */}
        <Dialog open={isFullEditOpen} onOpenChange={setIsFullEditOpen}>
          <DialogContent className="max-w-6xl w-[calc(100vw-0.75rem)] h-[calc(100dvh-0.75rem)] sm:w-full sm:h-[92vh] overflow-hidden bg-[#050505] border-none sm:border-white/5 rounded-[28px] sm:rounded-[2.5rem] p-0 flex flex-col shadow-2xl">
            
            {/* Header Ghost Style */}
            <div className="shrink-0 bg-black/20 backdrop-blur-xl border-b border-white/[0.05] px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 sm:py-5 flex items-center justify-between z-50">
              <div className="flex flex-col">
                <DialogTitle className="text-lg md:text-2xl font-black text-white tracking-tight uppercase">
                  Editar Proposta<span className="text-primary">_</span>
                </DialogTitle>
                <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Configuração Estratégica</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSaveFullEdit}
                  className="text-primary font-black uppercase tracking-[0.2em] text-xs hover:opacity-80 transition-opacity hidden sm:block"
                >
                  Salvar Alterações
                </button>
                <button 
                  onClick={() => setIsFullEditOpen(false)}
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X className="h-5 w-5 text-white/50" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-8 space-y-10 md:space-y-12 scrollbar-thin scrollbar-track-transparent pb-32 md:pb-40">
              
              <div className="space-y-2 mb-8 ml-1">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Detalhes do Projeto</h2>
                <p className="text-zinc-500 text-sm font-medium">Gestão comercial de alta performance M5 Max.</p>
              </div>

              {/* Status Segmented Control */}
              <section className="space-y-4">
                <Label className="text-[10px] uppercase font-black text-white/20 ml-2 tracking-widest">Fase da Proposta</Label>
                <div className="flex flex-wrap sm:flex-nowrap bg-white/5 p-1.5 rounded-[2rem] border border-white/5 gap-1">
                  {ORCAMENTO_STATUS_OPTIONS.filter(o => o.value !== 'realizado').map((s) => (
                    <button 
                      key={s.value} 
                      onClick={() => setEditForm({...editForm, status: s.value})}
                      className={cn(
                        "flex-1 py-3.5 rounded-[1.5rem] items-center justify-center transition-all duration-300",
                        editForm.status === s.value 
                          ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                          : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Form Fields: Dados do Cliente */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Contratante</Label>
                    <input
                      value={editForm.nome_contratante}
                      onChange={(e) => setEditForm({...editForm, nome_contratante: e.target.value})}
                      className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0"
                      placeholder="Ex: Bruna Cunha Souza"
                    />
                  </div>

                  <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">WhatsApp</Label>
                    <div className="flex items-center">
                      <input
                        value={editForm.telefone}
                        onChange={(e) => setEditForm({...editForm, telefone: e.target.value})}
                        className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0"
                        placeholder="Ex: 61984559495"
                      />
                      <Phone className="h-5 w-5 text-white/10" />
                    </div>
                  </div>

                  <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">CPF / CNPJ</Label>
                    <input
                      value={editForm.cpf}
                      onChange={(e) => setEditForm({...editForm, cpf: e.target.value})}
                      className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0 font-mono"
                      placeholder="Não informado"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Evento</Label>
                    <input
                      value={editForm.evento_nome}
                      onChange={(e) => setEditForm({...editForm, evento_nome: e.target.value})}
                      className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0"
                      placeholder="Ex: Casamento Bruna"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Data</Label>
                      <div className="flex items-center">
                        <input
                          type="date"
                          value={editForm.evento_data}
                          onChange={(e) => setEditForm({...editForm, evento_data: e.target.value})}
                          className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0 appearance-none color-scheme-dark"
                        />
                        <Calendar className="h-5 w-5 text-white/10" />
                      </div>
                    </div>
                    <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                      <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Horário</Label>
                      <div className="flex items-center">
                        <input
                          type="time"
                          value={editForm.evento_hora || ''}
                          onChange={(e) => setEditForm({...editForm, evento_hora: e.target.value})}
                          className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0 appearance-none color-scheme-dark"
                        />
                        <Clock className="h-5 w-5 text-white/10" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] px-6 py-4 rounded-[1.8rem] border border-white/5 group focus-within:border-primary/30 transition-all">
                    <Label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Localização</Label>
                    <div className="flex items-center">
                      <input
                        value={editForm.evento_local}
                        onChange={(e) => setEditForm({...editForm, evento_local: e.target.value})}
                        className="bg-transparent border-none text-white text-lg font-bold w-full focus:outline-none p-0"
                        placeholder="Ex: Brasília"
                      />
                      <MapPin className="h-5 w-5 text-white/10" />
                    </div>
                  </div>
                </div>
              </section>

              {/* SEÇÃO: COMPOSIÇÃO TÉCNICA - PRECISION GRID LAYOUT */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]" />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white">Composição Técnica</h3>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Análise e Especificação de Itens</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total de Itens</span>
                    <span className="text-sm font-black text-primary">{editForm.produtos.length.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Desktop Header Guide */}
                <div className="hidden lg:grid grid-cols-[1fr_140px_160px_160px_60px] gap-6 px-8 py-3 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  <div>Especificação do Produto</div>
                  <div className="text-center">Valor Unitário</div>
                  <div className="text-center">Quantidade</div>
                  <div className="text-right">Subtotal Total</div>
                  <div className="text-right">Ação</div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <AnimatePresence mode="popLayout">
                    {editForm.produtos.map((produto, index) => (
                      <motion.div 
                        key={produto.produto_id + index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="group/item relative rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-5 lg:p-0 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.05] shadow-2xl"
                      >
                        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_140px_160px_160px_60px] lg:gap-6 lg:items-center lg:h-24 lg:px-8">
                          
                          {/* Coluna 1: Produto */}
                          <div className="flex items-center gap-5 min-w-0">
                            <div className="hidden lg:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/5 group-hover/item:border-primary/30 transition-colors">
                              <Package className="h-5 w-5 text-white/20 group-hover/item:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base lg:text-lg font-black text-white truncate group-hover/item:text-primary transition-colors duration-300">
                                {produto.nome}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                  M5-{produto.produto_id.slice(0, 5).toUpperCase()}
                                </span>
                                {produtos.find(p => p.id === produto.produto_id)?.efeito && (
                                  <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest flex items-center gap-1">
                                    <Zap size={8} /> {produtos.find(p => p.id === produto.produto_id)?.efeito}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Coluna 2: Unitário (Mobile label inclusa) */}
                          <div className="mt-6 lg:mt-0 flex flex-row lg:flex-col justify-between items-center lg:text-center">
                            <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest">Valor Unitário</span>
                            <div className="flex flex-col lg:items-center">
                              <span className="text-sm font-bold text-white/60 tabular-nums">
                                R$ {produto.valor_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          {/* Coluna 3: Stepper Quantidade */}
                          <div className="mt-4 lg:mt-0 flex flex-row lg:flex-col justify-between items-center">
                            <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest">Quantidade</span>
                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 shadow-inner">
                              <button 
                                onClick={() => {
                                  const updated = [...editForm.produtos];
                                  updated[index].quantidade = Math.max(1, updated[index].quantidade - 1);
                                  setEditForm({...editForm, produtos: updated});
                                }}
                                className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-primary transition-all active:scale-90"
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <div className="w-12 text-center">
                                <span className="text-lg font-black text-white tabular-nums">
                                  {produto.quantidade.toString().padStart(2, '0')}
                                </span>
                              </div>
                              <button 
                                onClick={() => {
                                  const updated = [...editForm.produtos];
                                  updated[index].quantidade += 1;
                                  setEditForm({...editForm, produtos: updated});
                                }}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          </div>

                          {/* Coluna 4: Subtotal */}
                          <div className="mt-6 lg:mt-0 flex flex-row lg:flex-col justify-between items-center lg:text-right">
                            <span className="lg:hidden text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">Subtotal do Item</span>
                            <div className="flex flex-col lg:items-end">
                              <span className="text-xl font-black text-white tracking-tighter tabular-nums bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                R$ {(produto.quantidade * produto.valor_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          {/* Coluna 5: Ações */}
                          <div className="mt-6 lg:mt-0 flex justify-end">
                            <button 
                              onClick={() => {
                                const updated = editForm.produtos.filter((_, i) => i !== index);
                                setEditForm({...editForm, produtos: updated});
                                toast({ description: "Item removido com sucesso" });
                              }}
                              className="h-12 w-12 lg:h-10 lg:w-10 flex items-center justify-center rounded-2xl bg-red-500/5 text-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 group-hover/item:opacity-100 lg:opacity-0"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Visual Ornament: Progress line */}
                        <div className="hidden lg:block absolute left-8 right-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.button 
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => {
                       toast({ description: "Utilize o catálogo abaixo para adicionar novos itens", className: "bg-primary text-white border-none font-black uppercase tracking-widest text-[10px]" });
                    }}
                    className="w-full py-12 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.02] hover:border-primary/20 transition-all duration-500 group"
                  >
                    <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                      <Plus size={28} className="text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <span className="text-zinc-500 font-black mt-4 uppercase tracking-[0.4em] text-[10px] group-hover:text-white transition-colors">Expandir Composição</span>
                  </motion.button>
                </div>
              </section>

              {/* SEÇÃO: CATÁLOGO RÁPIDO */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h3 className="font-bold text-xs uppercase tracking-[0.3em] text-white/40">Acrescentar do Catálogo</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                   <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                     <Input 
                       placeholder="Pesquisar itens..." 
                       value={productSearchTerm}
                       onChange={(e) => setProductSearchTerm(e.target.value)}
                       className="h-12 pl-11 bg-transparent border-none rounded-xl focus:ring-0"
                     />
                   </div>
                   <button 
                     onClick={() => setProductSearchTerm("")} 
                     className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                   >
                     Reset
                   </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                   {sortedFilteredProducts.slice(0, 15).map((p) => (
                     <div key={p.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
                       <div className="flex-1 min-w-0 mr-4">
                         <p className="font-black text-sm text-white truncate group-hover:text-primary transition-colors">{p.nome_produto}</p>
                         <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black text-primary uppercase">R$ {p.valor_venda.toFixed(2)}</span>
                           <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest">SKU: {p.codigo}</span>
                         </div>
                       </div>
                       <Button 
                        onClick={() => {
                          const existing = editForm.produtos.find(item => item.produto_id === p.id);
                          if (existing) {
                            const updated = editForm.produtos.map(item => 
                              item.produto_id === p.id ? { ...item, quantidade: item.quantidade + 1 } : item
                            );
                            setEditForm({...editForm, produtos: updated});
                          } else {
                            setEditForm({...editForm, produtos: [...editForm.produtos, {
                              produto_id: p.id,
                              nome: p.nome_produto,
                              valor_unitario: p.valor_venda,
                              quantidade: 1
                            }]});
                          }
                          toast({ description: `${p.nome_produto} adicionado` });
                        }}
                        className="h-9 w-9 rounded-full bg-primary text-white p-0 shadow-lg shadow-primary/30"
                       >
                         <Plus className="h-4 w-4" />
                       </Button>
                     </div>
                   ))}
                </div>
              </section>
            </div>

            {/* Sticky Action Footer */}
            <div className="shrink-0 bg-[#080808]/95 backdrop-blur-3xl border-t border-white/5 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 z-50">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Investimento Comercial</span>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-sm font-bold text-white/30">R$</span>
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {editForm.produtos.reduce((sum, p) => sum + (p.quantidade * p.valor_unitario), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setIsFullEditOpen(false)}
                  className="flex-1 md:flex-none h-16 px-10 rounded-2xl font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <Button 
                  onClick={handleSaveFullEdit}
                  className="flex-1 md:flex-none h-16 px-12 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 transition-all active:scale-95"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Salvar Proposta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação para Deletar Orçamento */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="bg-background border-border rounded-[28px] p-5 sm:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-foreground">Confirmar Exclusão</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsDeleteConfirmOpen(false);
                setOrcamentoToDelete(null);
              }}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteOrcamento}>
                Excluir Orçamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrcamentos;
