import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Search, RefreshCw, AlertTriangle, PackageSearch, Filter, Zap } from "lucide-react";
import { supabase } from "@/features/admin/lib/supabase";
import type { Database } from "@/features/admin/types/database";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@shared/lib/utils";

type Produto = Database["public"]["Tables"]["produtos"]["Row"];

const getCategoryDisplayName = (categoria: string): string => {
  const categoryNames: Record<string, string> = {
    tortas: "Tortas",
    granadas: "Granadas",
    metralhas: "Metralhas",
    acessorios: "Acessórios",
    kits: "Kits",
    rojoes: "Rojões",
    fumacas: "Fumaças",
    cascata: "Cascata",
    morteiros: "Morteiros",
    bombas: "Bombas",
    cha_revelacao: "Chá Revelação",
    lancador: "Lançador",
    papel_picado: "Papel Picado",
  };
  return categoryNames[categoria] || categoria;
};

const EFEITOS_RAPIDOS = [
  { id: "all", label: "TODOS EFEITOS" },
  { id: "leque", label: "LEQUE" },
  { id: "reto", label: "RETO" },
];

export default function AdminProdutos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterEffect, setFilterEffect] = useState("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [durationSort, setDurationSort] = useState<"none" | "asc" | "desc">("none");
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: produtos,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["produtos", debouncedSearch, filterEffect, priceSort, durationSort],
    queryFn: async () => {
      let query = supabase.from("produtos").select("*");

      if (debouncedSearch) {
        query = query.or(
          `nome_produto.ilike.%${debouncedSearch}%,codigo.ilike.%${debouncedSearch}%,categoria.ilike.%${debouncedSearch}%`
        );
      }

      if (filterEffect !== "all") {
        if (filterEffect === "leque") {
          query = query.ilike("efeito", "%leque%");
        } else if (filterEffect === "reto") {
          query = query.or("efeito.ilike.%reto%,efeito.ilike.%reta%");
        }
      }

      // Ordenação básica no banco para performance (se apenas um filtro ativo)
      if (priceSort !== "none" && durationSort === "none") {
        query = query.order("valor_venda", { ascending: priceSort === "asc" });
      } else if (durationSort !== "none" && priceSort === "none") {
        query = query.order("duracao_segundos", { ascending: durationSort === "asc", nullsFirst: false });
      } else if (priceSort === "none" && durationSort === "none") {
        query = query.order("nome_produto", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      const result = data as Produto[];

      // INTELIGÊNCIA M5 MAX: Ordenação Composta (Melhor Custo-Benefício)
      // Preço Baixo (↓ / asc) + Duração Alta (↑ / desc) = Topo da lista
      if (priceSort !== "none" && durationSort !== "none") {
        const sortedResult = [...result];
        sortedResult.sort((a, b) => {
          const durA = a.duracao_segundos || 0;
          const durB = b.duracao_segundos || 0;

          const ratioA = durA > 0 ? a.valor_venda / durA : 999999;
          const ratioB = durB > 0 ? b.valor_venda / durB : 999999;

          if (priceSort === "asc" && durationSort === "desc") return ratioA - ratioB;
          if (priceSort === "desc" && durationSort === "asc") return ratioB - ratioA;

          if (Math.abs(a.valor_venda - b.valor_venda) > 0.01) {
            return priceSort === "asc" ? a.valor_venda - b.valor_venda : b.valor_venda - a.valor_venda;
          }
          return durationSort === "asc" ? durA - durB : durB - durA;
        });
        return sortedResult;
      }

      return result;
    },
    staleTime: 2 * 60 * 1000,
  });

  const getStockColor = (qtd: number | null) => {
    if (qtd === null) return "text-white/20";
    if (qtd <= 5) return "text-red-500 font-bold";
    if (qtd <= 15) return "text-orange-500/80";
    return "text-emerald-500/80";
  };

  return (
    <AdminLayout>
      <div className="flex min-h-full w-full max-w-[1400px] flex-col gap-8 mx-auto">
        <div className="flex-1 space-y-8">
          <div className="space-y-6">
            {/* Barra de Pesquisa */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary sm:left-6 sm:h-6 sm:w-6" />
              <Input
                placeholder="Pesquisar por SKU, Nome ou Categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-[22px] border-white/[0.06] bg-white/[0.02] pl-12 text-base font-medium shadow-2xl transition-all placeholder:text-white/10 focus:border-primary/40 focus:ring-0 sm:h-16 sm:rounded-[24px] sm:pl-16 sm:text-lg"
              />
            </div>

            {/* Painel de Controle de Filtros (Centralizado e Paralelo) */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-5xl bg-white/[0.01] border border-white/5 rounded-[28px] sm:rounded-[40px] p-2 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col lg:flex-row items-stretch gap-2">
                  
                  {/* Lado Esquerdo: Efeitos */}
                  <div className="flex-1 bg-white/[0.02] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] mb-4">Categorias de Fogos</span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {EFEITOS_RAPIDOS.map((effect) => (
                        <button
                          key={effect.id}
                          onClick={() => setFilterEffect(effect.id)}
                          className={cn(
                            "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 border sm:px-6 sm:py-2.5 sm:text-[10px]",
                            filterEffect === effect.id
                              ? "bg-primary border-primary text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] scale-105"
                              : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:bg-white/[0.08] hover:text-white"
                          )}
                        >
                          {effect.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lado Direito: Ordenação */}
                  <div className="flex-1 bg-white/[0.02] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] mb-4">Ordenação Estratégica</span>
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-fit">
                        <button
                          onClick={() => setPriceSort(prev => prev === "none" ? "asc" : prev === "asc" ? "desc" : "none")}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 border sm:px-5",
                            priceSort !== "none"
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "border-transparent text-white/30 hover:bg-white/5"
                          )}
                        >
                          Preço {priceSort === "asc" ? "↓" : priceSort === "desc" ? "↑" : ""}
                        </button>

                        <button
                          onClick={() => setDurationSort(prev => prev === "none" ? "asc" : prev === "asc" ? "desc" : "none")}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 border sm:px-5",
                            durationSort !== "none"
                              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                              : "border-transparent text-white/30 hover:bg-white/5"
                          )}
                        >
                          Duração {durationSort === "asc" ? "↓" : durationSort === "desc" ? "↑" : ""}
                        </button>
                      </div>

                      {priceSort === "asc" && durationSort === "desc" && (
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Custo-Benefício Ativo</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Grid de Produtos - Layout Relativo e Simétrico */}
          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-2 pb-28 md:grid-cols-2 lg:gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-28 w-full rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
                ))}
              </div>
            ) : produtos?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 sm:py-40 border border-white/[0.04] bg-white/[0.01] rounded-[28px] sm:rounded-[40px]">
                <PackageSearch className="h-16 w-16 text-white/10 mb-6" />
                <h3 className="text-xl font-bold text-white/60 uppercase tracking-widest">Nenhum produto indexado</h3>
                <button
                  onClick={() => {
                    setFilterEffect("all");
                    setPriceSort("none");
                    setDurationSort("none");
                    setSearchTerm("");
                  }}
                  className="mt-8 px-10 h-14 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
                >
                  Resetar Catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 pb-28 md:grid-cols-2 lg:gap-3">
                <AnimatePresence mode="popLayout">
                  {produtos?.map((produto, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: i * 0.02 }}
                      key={produto.id}
                      onClick={() => setSelectedProduct(produto)}
                      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/35 px-3 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-all duration-300 cursor-pointer backdrop-blur-md hover:border-primary/45 hover:bg-zinc-900/55 sm:px-4 sm:py-3 sm:gap-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-blue-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative z-10 min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-primary">
                            M5 MAX
                          </span>
                          <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white/40">
                            {getCategoryDisplayName(produto.categoria)}
                          </span>
                          <span className="rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-white/35">
                            ID {produto.codigo}
                          </span>
                        </div>

                        <h4 className="truncate text-sm font-black leading-tight tracking-tight text-white uppercase transition-colors group-hover:text-primary sm:text-base">
                          {produto.nome_produto}
                        </h4>

                        {produto.efeito && (
                          <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                            Efeito: {produto.efeito}
                          </p>
                        )}
                      </div>

                      <div className="relative z-10 shrink-0 rounded-xl border border-blue-500/25 bg-blue-500/10 px-2.5 py-1.5 text-right">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400/65">Duração</p>
                        <p className="text-sm font-black leading-none tracking-tight text-blue-300 sm:text-base">
                          {produto.duracao_segundos !== null ? `${produto.duracao_segundos}s` : "—"}
                        </p>
                      </div>

                      <div className="relative z-10 flex shrink-0 items-center gap-2.5 sm:gap-3">
                        <div className="text-right">
                          <span className="block text-[8px] font-black uppercase tracking-[0.18em] text-white/35">
                            Preço
                          </span>
                          <p className="text-sm font-black tracking-tight text-white group-hover:text-primary transition-colors sm:text-base">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 0
                            }).format(produto.valor_venda)}
                          </p>
                        </div>

                        <div className="h-8 w-px bg-white/10" />

                        <div className="min-w-[54px] text-right">
                          <div className="mb-0.5 flex items-center justify-end gap-1">
                            <span className={cn(
                              "text-base font-black tracking-tight leading-none",
                              getStockColor(produto.quantidade_disponivel)
                            )}>
                              {produto.quantidade_disponivel ?? "—"}
                            </span>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">
                            Estoque
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="w-[90vw] max-w-md sm:w-full border border-white/[0.08] bg-[#161616] p-0 shadow-2xl rounded-[24px] sm:rounded-[32px] overflow-hidden">
          <div className="flex flex-col">
            <DialogHeader className="border-b border-white/[0.05] bg-black/20 p-5 sm:p-6 text-left">
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
                <PackageSearch className="h-5 w-5 text-primary" />
                Ficha do Produto
              </DialogTitle>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="p-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-black/40 p-4 sm:p-5">
                  <div className="flex flex-col">
                    <span className="mb-1 text-[9px] uppercase tracking-widest text-white/40 font-bold">Preço de Venda</span>
                    <span className="text-xl sm:text-2xl font-black tracking-tighter text-primary">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(selectedProduct.valor_venda)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="mb-1 text-[9px] uppercase tracking-widest text-white/40 font-bold">Disponibilidade</span>
                    <span className={cn("text-xl sm:text-2xl font-black tracking-tighter", getStockColor(selectedProduct.quantidade_disponivel))}>
                      {selectedProduct.quantidade_disponivel ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-lg sm:text-xl font-black leading-tight tracking-tight text-white mb-3">{selectedProduct.nome_produto}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="border-none bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-widest text-white/60 font-bold">
                        {selectedProduct.codigo}
                      </Badge>
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                        {getCategoryDisplayName(selectedProduct.categoria)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 border-t border-white/[0.05] pt-5 text-sm sm:grid-cols-2">
                    <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                      <span className="block text-[8px] font-black uppercase tracking-widest text-white/40">Fabricante</span>
                      <span className="font-bold text-white/90">{selectedProduct.fabricante || "Não informado"}</span>
                    </div>
                    <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                      <span className="block text-[8px] font-black uppercase tracking-widest text-white/40">Tipo de Efeito</span>
                      <span className="font-bold text-white/90">{selectedProduct.efeito || "Não informado"}</span>
                    </div>
                    <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                      <span className="block text-[8px] font-black uppercase tracking-widest text-white/40">Tubos / Tiros</span>
                      <span className="font-bold text-white/90">{selectedProduct.tubos || "N/A"}</span>
                    </div>
                    <div className="space-y-1 bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                      <span className="block text-[8px] font-black uppercase tracking-widest text-white/40">Duração Show</span>
                      <span className="font-bold text-white/90">{selectedProduct.duracao_segundos ? `${selectedProduct.duracao_segundos}s` : "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button 
                    onClick={() => setSelectedProduct(null)} 
                    variant="ghost"
                    className="h-10 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-white"
                  >
                    Fechar Ficha
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
