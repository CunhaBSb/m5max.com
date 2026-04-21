import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  Loader2,
  Package,
  Pencil,
  Plus,
  Save,
  ShieldAlert,
} from "lucide-react";

import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import { Badge } from "@shared/ui/badge";
import { useDebouncedSearch } from "@/features/admin/hooks/use-debounced-search";
import { useToast } from "@/features/admin/hooks/use-toast";
import { useAuth } from "@/features/admin/contexts/AuthContextSimple";
import { produtoSchema } from "@/features/admin/lib/validations";
import { supabase } from "@/features/admin/lib/supabase";
import { cn } from "@shared/lib/utils";
import type { Database } from "@/features/admin/types/database";

type Produto = Database["public"]["Tables"]["produtos"]["Row"];
type ProdutoInsert = Database["public"]["Tables"]["produtos"]["Insert"];
type ProdutoUpdate = Database["public"]["Tables"]["produtos"]["Update"];
type HistoricoInsert = Database["public"]["Tables"]["historico_estoque"]["Insert"];
type ProdutoInsertWithoutCode = Omit<ProdutoInsert, "codigo"> & { codigo?: string };

const CATEGORY_OPTIONS = [
  { value: "tortas", label: "Tortas" },
  { value: "granadas", label: "Granadas" },
  { value: "metralhas", label: "Metralhas" },
  { value: "acessorios", label: "Acessorios/Fios" },
  { value: "kits", label: "Kits" },
  { value: "rojoes", label: "Rojoes" },
  { value: "fumacas", label: "Fumacas" },
  { value: "cascata", label: "Cascata" },
  { value: "morteiros", label: "Morteiros" },
  { value: "bombas", label: "Bombas" },
  { value: "cha_revelacao", label: "Cha Revelacao" },
  { value: "lancador", label: "Lancador" },
  { value: "papel_picado", label: "Papel Picado" },
];

const estoqueProductSchema = produtoSchema.omit({ codigo: true }).extend({
  descricao_completa: z
    .string()
    .max(800, "Descricao muito longa")
    .optional()
    .or(z.literal("")),
});

type EstoqueProductFormData = z.infer<typeof estoqueProductSchema>;
type InventoryAdjustmentType = "entrada" | "saida" | "ajuste";

type InventoryAdjustmentState = {
  type: InventoryAdjustmentType;
  quantity: string;
  reason: string;
};

const DEFAULT_ADJUSTMENT: InventoryAdjustmentState = {
  type: "entrada",
  quantity: "",
  reason: "",
};

const getCategoryDisplayName = (categoria: string): string =>
  CATEGORY_OPTIONS.find((option) => option.value === categoria)?.label ?? categoria;

const getProductFormDefaults = (produto?: Produto | null): EstoqueProductFormData => ({
  nome_produto: produto?.nome_produto ?? "",
  quantidade_disponivel: produto?.quantidade_disponivel ?? 0,
  tubos: produto?.tubos ?? "",
  categoria: produto?.categoria ?? "",
  fabricante: produto?.fabricante ?? "",
  efeito: produto?.efeito ?? "",
  duracao_segundos: produto?.duracao_segundos ?? undefined,
  valor_compra: produto?.valor_compra ?? 0,
  valor_venda: produto?.valor_venda ?? 0,
  ativo: produto?.ativo ?? true,
  descricao_completa: produto?.descricao_completa ?? "",
});

const normalizeNullableString = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const parsePositiveNumber = (value: string) => {
  const parsed = Number(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
};

const AdminEstoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<InventoryAdjustmentState>(DEFAULT_ADJUSTMENT);

  const { toast } = useToast();
  const { userData } = useAuth();

  const form = useForm<EstoqueProductFormData>({
    resolver: zodResolver(estoqueProductSchema),
    defaultValues: getProductFormDefaults(),
  });

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("ativo", true)
        .order("nome_produto");

      if (error) throw error;
      setProdutos(data ?? []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Falha ao carregar estoque",
        description: "Nao foi possivel sincronizar os produtos do painel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset(getProductFormDefaults());
      setStockAdjustment(DEFAULT_ADJUSTMENT);
      return;
    }

    form.reset(getProductFormDefaults(editingProduct));
    setStockAdjustment(DEFAULT_ADJUSTMENT);
  }, [editingProduct, form, isDialogOpen]);

  const { filteredItems: searchFilteredProdutos } = useDebouncedSearch(produtos, searchTerm, [
    "nome_produto",
    "codigo",
    "categoria",
    "efeito",
    "fabricante",
  ]);

  const finalFilteredProdutos = useMemo(() => {
    let result = [...searchFilteredProdutos];

    if (filterCategory !== "all") {
      result = result.filter((produto) => produto.categoria === filterCategory);
    }

    return result;
  }, [filterCategory, searchFilteredProdutos]);

  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter((produto) => produto.ativo).length;
  const produtosBaixoEstoque = produtos.filter((produto) => (produto.quantidade_disponivel ?? 0) <= 5).length;

  const adjustmentPreview = useMemo(() => {
    if (!editingProduct || !stockAdjustment.quantity.trim()) {
      return null;
    }

    const parsedQuantity = parsePositiveNumber(stockAdjustment.quantity);
    const currentQuantity = editingProduct.quantidade_disponivel ?? 0;

    if (parsedQuantity === null) {
      return null;
    }

    if (stockAdjustment.type === "entrada") {
      return currentQuantity + parsedQuantity;
    }

    if (stockAdjustment.type === "saida") {
      return currentQuantity - parsedQuantity;
    }

    return parsedQuantity;
  }, [editingProduct, stockAdjustment]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (produto: Produto) => {
    setEditingProduct(produto);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProduct(null);
    }
  };

  const persistStockHistory = useCallback(
    async (payload: HistoricoInsert) => {
      const { error } = await supabase.from("historico_estoque").insert(payload);

      if (error) {
        console.error("Erro ao registrar historico de estoque:", error);
        toast({
          title: "Item salvo com alerta",
          description: "O produto foi salvo, mas o historico de estoque nao foi registrado.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleDeactivateProduct = async (produto: Produto) => {
    const confirmed = window.confirm(`Desativar ${produto.nome_produto} do estoque ativo?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("produtos")
        .update({
          ativo: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", produto.id);

      if (error) throw error;

      toast({
        title: "Item desativado",
        description: `${produto.nome_produto} saiu da lista ativa do estoque.`,
      });

      if (selectedProduct?.id === produto.id) {
        setSelectedProduct(null);
      }

      if (editingProduct?.id === produto.id) {
        handleDialogChange(false);
      }

      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao desativar item:", error);
      toast({
        title: "Falha ao desativar item",
        description: "Nao foi possivel atualizar o status do produto.",
        variant: "destructive",
      });
    }
  };

  const buildProductPayload = (
    values: EstoqueProductFormData,
    quantity: number
  ): ProdutoInsertWithoutCode | ProdutoUpdate => ({
    nome_produto: values.nome_produto.trim(),
    categoria: values.categoria,
    quantidade_disponivel: quantity,
    tubos: normalizeNullableString(values.tubos),
    fabricante: normalizeNullableString(values.fabricante),
    efeito: normalizeNullableString(values.efeito),
    descricao_completa: normalizeNullableString(values.descricao_completa),
    duracao_segundos: values.duracao_segundos ?? null,
    valor_compra: values.valor_compra,
    valor_venda: values.valor_venda,
    ativo: values.ativo,
    updated_at: new Date().toISOString(),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSaving(true);

    try {
      if (!editingProduct) {
        const initialQuantity = values.quantidade_disponivel ?? 0;
        const payload = buildProductPayload(values, initialQuantity) as ProdutoInsert;

        const { data: insertedProduct, error: insertError } = await supabase
          .from("produtos")
          .insert(payload)
          .select("*")
          .single();

        if (insertError) {
          const normalizedMessage = insertError.message.toLowerCase();
          const missingAutoSku =
            normalizedMessage.includes("codigo") &&
            (normalizedMessage.includes("null") || normalizedMessage.includes("not-null"));

          if (missingAutoSku) {
            toast({
              title: "SKU automatico nao configurado no banco",
              description:
                "A coluna codigo ainda exige valor manual. Configure DEFAULT/TRIGGER de SKU ou regenere os tipos do Supabase.",
              variant: "destructive",
            });
            return;
          }

          throw insertError;
        }

        if (initialQuantity > 0) {
          await persistStockHistory({
            produto_id: insertedProduct.id,
            usuario_id: userData?.id ?? null,
            tipo_movimentacao: "entrada",
            quantidade_anterior: 0,
            quantidade_movimentada: initialQuantity,
            quantidade_atual: initialQuantity,
            motivo: "Carga inicial do cadastro de estoque.",
          });
        }

        toast({
          title: "Item cadastrado",
          description: `${insertedProduct.nome_produto} cadastrado com SKU ${insertedProduct.codigo ?? "gerado"}.`,
        });
      } else {
        const currentQuantity = editingProduct.quantidade_disponivel ?? 0;
        let nextQuantity = currentQuantity;
        let shouldPersistHistory = false;
        let historyPayload: HistoricoInsert | null = null;

        if (stockAdjustment.quantity.trim()) {
          const parsedAdjustment = parsePositiveNumber(stockAdjustment.quantity);

          if (parsedAdjustment === null) {
            toast({
              title: "Ajuste invalido",
              description: "Informe uma quantidade valida para o ajuste de estoque.",
              variant: "destructive",
            });
            setSaving(false);
            return;
          }

          if (!stockAdjustment.reason.trim()) {
            toast({
              title: "Motivo obrigatorio",
              description: "Descreva o motivo do ajuste para manter o historico auditavel.",
              variant: "destructive",
            });
            setSaving(false);
            return;
          }

          if (stockAdjustment.type === "entrada") {
            nextQuantity = currentQuantity + parsedAdjustment;
          }

          if (stockAdjustment.type === "saida") {
            if (parsedAdjustment > currentQuantity) {
              toast({
                title: "Saldo insuficiente",
                description: "A saida informada excede o saldo disponivel do item.",
                variant: "destructive",
              });
              setSaving(false);
              return;
            }
            nextQuantity = currentQuantity - parsedAdjustment;
          }

          if (stockAdjustment.type === "ajuste") {
            nextQuantity = parsedAdjustment;
          }

          if (nextQuantity !== currentQuantity) {
            shouldPersistHistory = true;
            historyPayload = {
              produto_id: editingProduct.id,
              usuario_id: userData?.id ?? null,
              tipo_movimentacao: stockAdjustment.type,
              quantidade_anterior: currentQuantity,
              quantidade_movimentada:
                stockAdjustment.type === "ajuste"
                  ? Math.abs(nextQuantity - currentQuantity)
                  : parsedAdjustment,
              quantidade_atual: nextQuantity,
              motivo: stockAdjustment.reason.trim(),
            };
          }
        }

        const payload = buildProductPayload(values, nextQuantity) as ProdutoUpdate;

        const { data: updatedProduct, error: updateError } = await supabase
          .from("produtos")
          .update(payload)
          .eq("id", editingProduct.id)
          .select("*")
          .single();

        if (updateError) throw updateError;

        if (shouldPersistHistory && historyPayload) {
          await persistStockHistory(historyPayload);
        }

        toast({
          title: "Estoque atualizado",
          description: `${updatedProduct.nome_produto} foi sincronizado com sucesso.`,
        });
      }

      handleDialogChange(false);
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : "Nao foi possivel persistir os dados do estoque.";

      toast({
        title: "Falha ao salvar item",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
          <div className="text-center">
            <Package className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando inventario...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex min-h-full w-full max-w-[1400px] flex-col gap-8 mx-auto">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-page-intro"
            >
              <h1 className="admin-page-title">
                Estoque Central<span className="text-primary opacity-50">_</span>
              </h1>
              <p className="admin-page-subtitle">
                Cadastro tecnico, saldo auditavel e operacao mobile sem quebrar o fluxo.
              </p>
            </motion.div>

            <Button
              onClick={openCreateDialog}
              className="h-12 rounded-xl bg-primary px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 sm:px-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-[24px] sm:rounded-3xl group transition-all hover:bg-white/[0.04]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Total Itens</p>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{totalProdutos}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-[24px] sm:rounded-3xl group transition-all hover:bg-white/[0.04]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Ativos</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tighter">{produtosAtivos}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-6 rounded-[24px] sm:rounded-3xl group transition-all hover:bg-red-500/[0.08]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Critico</p>
              <p className="text-2xl sm:text-3xl font-black text-red-500 tracking-tighter">{produtosBaixoEstoque}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative group">
              <Package className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary sm:left-6 sm:h-6 sm:w-6" />
              <Input
                placeholder="Pesquisar por SKU, nome, fabricante ou efeito..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-14 w-full rounded-[22px] border-white/[0.06] bg-white/[0.02] pl-12 text-base font-medium shadow-2xl transition-all placeholder:text-white/10 focus:border-primary/40 focus:ring-0 sm:h-16 sm:rounded-[24px] sm:pl-16 sm:text-lg"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-14 rounded-[22px] border-white/[0.06] bg-white/[0.02] text-sm font-semibold text-white shadow-2xl sm:h-16 sm:rounded-[24px]">
                <SelectValue placeholder="Filtrar categoria" />
              </SelectTrigger>
            <SelectContent sideOffset={6} className="max-h-64 rounded-xl border-white/10 bg-[#0b0b0b] text-white shadow-2xl">
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            {finalFilteredProdutos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 sm:py-40 border border-white/[0.04] bg-white/[0.01] rounded-[28px] sm:rounded-[40px]">
                <Package className="h-16 w-16 text-white/10 mb-6" />
                <h3 className="text-xl font-bold text-white/60">Nenhum item encontrado</h3>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                  }}
                  className="mt-8 h-12 rounded-full border border-primary/20 bg-primary/5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10"
                  variant="ghost"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-32 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {finalFilteredProdutos.map((produto, index) => {
                    const quantidadeDisponivel = produto.quantidade_disponivel ?? 0;
                    const estoqueCritico = quantidadeDisponivel <= 5;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, delay: index * 0.02 }}
                        key={produto.id}
                        className="group relative flex flex-col justify-between rounded-[26px] border border-white/[0.06] bg-[#050505] p-5 shadow-2xl transition-all hover:border-primary/30 sm:rounded-[24px] sm:p-8"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0 flex-1">
                            <Badge
                              variant="outline"
                              className="mb-3 border-white/10 bg-white/[0.03] px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/45"
                            >
                              {getCategoryDisplayName(produto.categoria)}
                            </Badge>
                            <h4 className="truncate text-xl font-black text-white transition-colors group-hover:text-primary">
                              {produto.nome_produto}
                            </h4>
                            <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                              SKU: {produto.codigo}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedProduct(produto)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                              aria-label={`Detalhes de ${produto.nome_produto}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditDialog(produto)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                              aria-label={`Editar ${produto.nome_produto}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                              Custo
                            </span>
                            <p className="mt-1 text-lg font-black text-white">
                              R$ {produto.valor_compra.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                              Venda
                            </span>
                            <p className="mt-1 text-lg font-black text-primary">
                              R$ {produto.valor_venda.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-7 flex items-end justify-between">
                          <div className="min-w-0">
                            <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                              Fabricante
                            </span>
                            <p className="mt-1 truncate text-sm font-semibold text-white/70">
                              {produto.fabricante || "Nao informado"}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="mb-1 flex items-center justify-end gap-2">
                              {estoqueCritico && <AlertTriangle className="h-4 w-4 animate-pulse text-red-500" />}
                              <span
                                className={cn(
                                  "text-2xl font-black tracking-tighter",
                                  estoqueCritico ? "text-red-500" : "text-emerald-500"
                                )}
                              >
                                {quantidadeDisponivel}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                              Qtd Disp.
                            </span>
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

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="admin-modal-panel max-w-4xl border-none bg-[#050505] p-0">
          <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
            <DialogHeader className="admin-modal-header space-y-2 text-left">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                {editingProduct ? "Ajustar Inventario" : "Novo Registro SKU"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                Cadastro tecnico com consistencia mobile e historico de saldo auditavel.
              </DialogDescription>
            </DialogHeader>

            <div className="admin-modal-body space-y-5">
              <section className="admin-mobile-panel p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                      Dados do Item
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Preencha o cadastro base antes de salvar no estoque.
                    </p>
                  </div>
                  {editingProduct && (
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/45"
                    >
                      SKU existente
                    </Badge>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome_produto" className="text-white/70">
                      Nome do produto
                    </Label>
                    <Input
                      id="nome_produto"
                      className="border-white/10 bg-white/[0.03] text-white"
                      placeholder="Nome comercial do item"
                      {...form.register("nome_produto")}
                    />
                    {form.formState.errors.nome_produto && (
                      <p className="text-xs text-red-400">{form.formState.errors.nome_produto.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70">Codigo SKU</Label>
                    <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/75">
                      {editingProduct?.codigo ?? "Gerado automaticamente pelo banco ao cadastrar"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/70">Categoria</Label>
                    <Controller
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="border-white/10 bg-white/[0.03] text-white">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent sideOffset={6} className="max-h-64 rounded-xl border-white/10 bg-[#0b0b0b] text-white shadow-2xl">
                            {CATEGORY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.categoria && (
                      <p className="text-xs text-red-400">{form.formState.errors.categoria.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fabricante" className="text-white/70">
                      Fabricante
                    </Label>
                    <Input
                      id="fabricante"
                      className="border-white/10 bg-white/[0.03] text-white"
                      placeholder="Fornecedor ou fabricante"
                      {...form.register("fabricante")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="efeito" className="text-white/70">
                      Efeito
                    </Label>
                    <Input
                      id="efeito"
                      className="border-white/10 bg-white/[0.03] text-white"
                      placeholder="Leque, reto, cometa, etc."
                      {...form.register("efeito")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tubos" className="text-white/70">
                      Tubos / composicao
                    </Label>
                    <Input
                      id="tubos"
                      className="border-white/10 bg-white/[0.03] text-white"
                      placeholder="Ex: 30 tubos"
                      {...form.register("tubos")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracao_segundos" className="text-white/70">
                      Duracao (segundos)
                    </Label>
                    <Input
                      id="duracao_segundos"
                      type="number"
                      min="0"
                      className="border-white/10 bg-white/[0.03] text-white"
                      {...form.register("duracao_segundos", {
                        setValueAs: (value) => (value === "" ? undefined : Number(value)),
                      })}
                    />
                    {form.formState.errors.duracao_segundos && (
                      <p className="text-xs text-red-400">{form.formState.errors.duracao_segundos.message}</p>
                    )}
                  </div>

                  {!editingProduct ? (
                    <div className="space-y-2">
                      <Label htmlFor="quantidade_disponivel" className="text-white/70">
                        Estoque
                      </Label>
                      <Input
                        id="quantidade_disponivel"
                        type="number"
                        min="0"
                        className="border-white/10 bg-white/[0.03] text-white"
                        {...form.register("quantidade_disponivel", {
                          setValueAs: (value) => Number(value),
                        })}
                      />
                      {form.formState.errors.quantidade_disponivel && (
                        <p className="text-xs text-red-400">
                          {form.formState.errors.quantidade_disponivel.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-white/70">Saldo atual</Label>
                      <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-black text-white">
                        {editingProduct.quantidade_disponivel ?? 0} unidades
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="valor_compra" className="text-white/70">
                      Valor de compra
                    </Label>
                    <Input
                      id="valor_compra"
                      type="number"
                      min="0"
                      step="0.01"
                      className="border-white/10 bg-white/[0.03] text-white"
                      {...form.register("valor_compra", {
                        setValueAs: (value) => Number(value),
                      })}
                    />
                    {form.formState.errors.valor_compra && (
                      <p className="text-xs text-red-400">{form.formState.errors.valor_compra.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_venda" className="text-white/70">
                      Valor de venda
                    </Label>
                    <Input
                      id="valor_venda"
                      type="number"
                      min="0"
                      step="0.01"
                      className="border-white/10 bg-white/[0.03] text-white"
                      {...form.register("valor_venda", {
                        setValueAs: (value) => Number(value),
                      })}
                    />
                    {form.formState.errors.valor_venda && (
                      <p className="text-xs text-red-400">{form.formState.errors.valor_venda.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white/70">Status</Label>
                    <Controller
                      control={form.control}
                      name="ativo"
                      render={({ field }) => (
                        <Select
                          value={field.value ? "ativo" : "inativo"}
                          onValueChange={(value) => field.onChange(value === "ativo")}
                        >
                          <SelectTrigger className="border-white/10 bg-white/[0.03] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent sideOffset={6} className="max-h-64 rounded-xl border-white/10 bg-[#0b0b0b] text-white shadow-2xl">
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descricao_completa" className="text-white/70">
                      Observacoes tecnicas
                    </Label>
                    <Textarea
                      id="descricao_completa"
                      className="min-h-[120px] border-white/10 bg-white/[0.03] text-white"
                      placeholder="Detalhes de uso, composicao, aplicacao ou particularidades operacionais."
                      {...form.register("descricao_completa")}
                    />
                  </div>
                </div>
              </section>

              {editingProduct && (
                <section className="admin-mobile-panel p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                        Ajuste de Inventario
                      </p>
                      <p className="mt-1 text-sm text-white/50">
                        Entradas, saidas e ajuste manual com trilha de historico.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                      <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-white/20">
                        Saldo atual
                      </span>
                      <span className="mt-1 block text-2xl font-black text-white">
                        {editingProduct.quantidade_disponivel ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-white/70">Tipo de movimentacao</Label>
                      <Select
                        value={stockAdjustment.type}
                        onValueChange={(value: InventoryAdjustmentType) =>
                          setStockAdjustment((previous) => ({ ...previous, type: value }))
                        }
                      >
                        <SelectTrigger className="border-white/10 bg-white/[0.03] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent sideOffset={6} className="max-h-64 rounded-xl border-white/10 bg-[#0b0b0b] text-white shadow-2xl">
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saida</SelectItem>
                          <SelectItem value="ajuste">Ajuste manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock-adjustment-quantity" className="text-white/70">
                        {stockAdjustment.type === "ajuste" ? "Saldo final" : "Quantidade movimentada"}
                      </Label>
                      <Input
                        id="stock-adjustment-quantity"
                        type="number"
                        min="0"
                        className="border-white/10 bg-white/[0.03] text-white"
                        placeholder={stockAdjustment.type === "ajuste" ? "Ex: 24" : "Ex: 5"}
                        value={stockAdjustment.quantity}
                        onChange={(event) =>
                          setStockAdjustment((previous) => ({
                            ...previous,
                            quantity: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="stock-adjustment-reason" className="text-white/70">
                      Motivo do ajuste
                    </Label>
                    <Textarea
                      id="stock-adjustment-reason"
                      className="min-h-[110px] border-white/10 bg-white/[0.03] text-white"
                      placeholder="Ex: reposicao de lote, baixa operacional, conferencia fisica, avaria."
                      value={stockAdjustment.reason}
                      onChange={(event) =>
                        setStockAdjustment((previous) => ({
                          ...previous,
                          reason: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-white/20">
                        Preview do saldo
                      </span>
                      <span
                        className={cn(
                          "mt-2 block text-2xl font-black",
                          adjustmentPreview !== null && adjustmentPreview < 0 ? "text-red-400" : "text-primary"
                        )}
                      >
                        {adjustmentPreview ?? editingProduct.quantidade_disponivel ?? 0}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                      <div className="flex items-center gap-2 text-white/75">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        Historico obrigatorio quando houver movimentacao.
                      </div>
                      <p className="mt-2 leading-relaxed">
                        O item continua editavel mesmo sem ajuste. Ao informar quantidade, o motivo passa a ser exigido.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="admin-modal-footer flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                {editingProduct && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleDeactivateProduct(editingProduct)}
                    className="h-12 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Desativar Item
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleDialogChange(false)}
                  className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Cancelar
                </Button>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="h-12 rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingProduct ? "Salvar Ajustes" : "Criar Item"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="admin-modal-panel max-w-2xl border-none bg-[#050505] p-0">
          {selectedProduct && (
            <div className="flex h-full min-h-0 flex-col">
              <DialogHeader className="admin-modal-header space-y-2 text-left">
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">
                  {selectedProduct.nome_produto}
                </DialogTitle>
                <DialogDescription className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/35">
                  Detalhamento tecnico do item em estoque.
                </DialogDescription>
              </DialogHeader>

              <div className="admin-modal-body space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">SKU</span>
                    <p className="mt-2 text-xl font-black text-white">{selectedProduct.codigo}</p>
                  </div>
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Categoria</span>
                    <p className="mt-2 text-xl font-black text-white">
                      {getCategoryDisplayName(selectedProduct.categoria)}
                    </p>
                  </div>
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">
                      Estoque disponivel
                    </span>
                    <p
                      className={cn(
                        "mt-2 text-3xl font-black",
                        (selectedProduct.quantidade_disponivel ?? 0) <= 5 ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {selectedProduct.quantidade_disponivel ?? 0}
                    </p>
                  </div>
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Status</span>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em]",
                          selectedProduct.ativo
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-white/[0.04] text-white/45"
                        )}
                      >
                        {selectedProduct.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Compra</span>
                    <p className="mt-2 text-xl font-black text-white">R$ {selectedProduct.valor_compra.toFixed(2)}</p>
                  </div>
                  <div className="admin-mobile-panel p-5">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Venda</span>
                    <p className="mt-2 text-xl font-black text-primary">R$ {selectedProduct.valor_venda.toFixed(2)}</p>
                  </div>
                </div>

                <div className="admin-mobile-panel p-5 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Fabricante</span>
                      <p className="mt-2 text-sm font-semibold text-white/75">
                        {selectedProduct.fabricante || "Nao informado"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Efeito</span>
                      <p className="mt-2 text-sm font-semibold text-white/75">
                        {selectedProduct.efeito || "Nao informado"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Tubos</span>
                      <p className="mt-2 text-sm font-semibold text-white/75">
                        {selectedProduct.tubos || "Nao informado"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">Duracao</span>
                      <p className="mt-2 text-sm font-semibold text-white/75">
                        {selectedProduct.duracao_segundos ? `${selectedProduct.duracao_segundos}s` : "Nao informada"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/20">
                      Observacoes tecnicas
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {selectedProduct.descricao_completa || "Sem observacoes cadastradas."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedProduct(null)}
                  className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Fechar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    openEditDialog(selectedProduct);
                  }}
                  className="h-12 rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Ajustar Inventario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEstoque;
