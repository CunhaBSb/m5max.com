import { useEffect, useMemo, useState } from "react";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/table";
import {
  dedupeOrcamentoProdutos,
  getOrcamentoStatusMeta,
  type OrcamentoCompleto,
  type Produto,
} from "@/features/admin/modules/orcamentos";
import { Loader2 } from "lucide-react";
import { cn } from "@shared/lib/utils";

export type ConfirmShowModalItem = {
  produto_id: string;
  nome_produto: string;
  quantidade_planejada: number;
  quantidade_usada: number;
};

export type ConfirmShowModalConfirmPayload = {
  items: ConfirmShowModalItem[];
  finalTotal: number;
  allowFinalizeWithoutStock: boolean;
};

type ConfirmShowStockAvailabilityRow = ConfirmShowModalItem & {
  quantidade_disponivel: number;
  quantidade_faltante: number;
  estoque_insuficiente: boolean;
};

type ConfirmShowModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: OrcamentoCompleto | null;
  produtos: Produto[];
  isSubmitting?: boolean;
  onConfirm: (payload: ConfirmShowModalConfirmPayload) => void | Promise<void>;
};

const formatDateOnly = (date: string | null | undefined) => {
  if (!date) return "Nao informada";
  const [y, m, d] = date.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const buildShowUsageRows = (orcamento: OrcamentoCompleto): ConfirmShowModalItem[] =>
  dedupeOrcamentoProdutos(orcamento.orcamentos_produtos)
    .filter((item) => Boolean(item.produto_id))
    .map((item) => ({
      produto_id: item.produto_id!,
      nome_produto: item.produtos?.nome_produto || "Produto sem nome",
      quantidade_planejada: Math.max(0, Number(item.quantidade) || 0),
      quantidade_usada: Math.max(0, Number(item.quantidade) || 0),
    }));

export const ConfirmShowModal = ({
  open,
  onOpenChange,
  orcamento,
  produtos,
  isSubmitting = false,
  onConfirm,
}: ConfirmShowModalProps) => {
  const [items, setItems] = useState<ConfirmShowModalItem[]>([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [allowFinalizeWithoutStock, setAllowFinalizeWithoutStock] = useState(false);

  useEffect(() => {
    if (open && orcamento) {
      setItems(buildShowUsageRows(orcamento));
      setFinalTotal(Math.max(0, Number(orcamento.valor_total) || 0));
      setAllowFinalizeWithoutStock(false);
      return;
    }

    if (!open) {
      setItems([]);
      setFinalTotal(0);
      setAllowFinalizeWithoutStock(false);
    }
  }, [open, orcamento]);

  const productStockMap = useMemo(
    () =>
      new Map(
        produtos.map((produto) => [
          produto.id,
          Math.max(0, Number(produto.quantidade_disponivel) || 0),
        ]),
      ),
    [produtos],
  );

  const availability = useMemo<ConfirmShowStockAvailabilityRow[]>(
    () =>
      items.map((item) => {
        const quantidadeDisponivel = productStockMap.get(item.produto_id) ?? 0;
        const quantidadeUsada = Math.max(0, Number(item.quantidade_usada) || 0);
        const quantidadeFaltante = Math.max(0, quantidadeUsada - quantidadeDisponivel);

        return {
          ...item,
          quantidade_disponivel: quantidadeDisponivel,
          quantidade_faltante: quantidadeFaltante,
          estoque_insuficiente: quantidadeFaltante > 0,
        };
      }),
    [items, productStockMap],
  );

  const insufficientItems = useMemo(
    () =>
      availability.filter(
        (item) => item.estoque_insuficiente && item.quantidade_usada > 0,
      ),
    [availability],
  );

  const originalTotal = useMemo(
    () => Math.max(0, Number(orcamento?.valor_total) || 0),
    [orcamento],
  );

  const discountValue = useMemo(
    () => Math.max(0, originalTotal - finalTotal),
    [finalTotal, originalTotal],
  );

  const totalUsed = useMemo(
    () =>
      availability.reduce(
        (sum, item) => sum + (Number(item.quantidade_usada) || 0),
        0,
      ),
    [availability],
  );

  const statusMeta = getOrcamentoStatusMeta(orcamento?.status);

  const handleItemUsageChange = (index: number, rawValue: string) => {
    const parsedValue = Number(rawValue);
    const quantityToUse = Number.isNaN(parsedValue)
      ? 0
      : Math.max(0, Math.floor(parsedValue));

    setItems((previousItems) =>
      previousItems.map((item, currentIndex) =>
        currentIndex === index
          ? { ...item, quantidade_usada: quantityToUse }
          : item,
      ),
    );
  };

  const handleFinalTotalChange = (rawValue: string) => {
    const parsedValue = Number(rawValue.replace(",", "."));
    const nextValue = Number.isNaN(parsedValue)
      ? 0
      : Math.max(0, Number(parsedValue.toFixed(2)));

    setFinalTotal(nextValue);
  };

  const handleConfirm = () => {
    onConfirm({
      items,
      finalTotal,
      allowFinalizeWithoutStock,
    });
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="admin-modal-panel max-w-5xl md:max-h-[90vh]">
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="admin-modal-header space-y-2 text-left">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Confirmar Show
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Revise consumo, valor final e pendencias de estoque antes de concluir o evento.
            </DialogDescription>
          </DialogHeader>

          {orcamento && (
            <>
              <div className="admin-modal-body space-y-5">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="admin-stat-card p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                      Cliente
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {orcamento.nome_contratante}
                    </p>
                  </div>

                  <div className="admin-stat-card p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                      Evento
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {orcamento.evento_nome}
                    </p>
                  </div>

                  <div className="admin-stat-card p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                      Data
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatDateOnly(orcamento.evento_data)}
                    </p>
                  </div>

                  <div className="admin-stat-card p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                      Status
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className={statusMeta.badgeClassName}>
                        {statusMeta.label}
                      </Badge>
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
                        {originalTotal.toLocaleString("pt-BR", {
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
                        value={finalTotal}
                        onChange={(event) => handleFinalTotalChange(event.target.value)}
                        disabled={isSubmitting}
                        className="mt-2 h-11 rounded-xl border-white/10 bg-background/70 text-base md:text-sm"
                      />
                    </div>

                    <div className="admin-stat-card border-primary/10 bg-background/60 p-4 shadow-none">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Desconto Aplicado
                      </Label>
                      <p className="mt-2 text-xl font-semibold text-emerald-400">
                        R${" "}
                        {discountValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {insufficientItems.length > 0 && (
                  <div className="rounded-2xl border border-destructive/35 bg-destructive/10 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-destructive">
                          Estoque insuficiente em {insufficientItems.length} item(ns)
                        </p>
                        <ul className="space-y-1 text-sm text-destructive">
                          {insufficientItems.map((item) => (
                            <li key={`insuf-${item.produto_id}`}>
                              {item.nome_produto}: disponivel {item.quantidade_disponivel}, uso{" "}
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
                              Os itens sem saldo ficam registrados no historico sem baixa de estoque.
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
                        Em mobile os ajustes aparecem em cartoes para reduzir rolagem lateral.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground"
                    >
                      {availability.length} item(ns)
                    </Badge>
                  </div>

                  <div className="space-y-3 md:hidden">
                    {availability.map((item, index) => (
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
                            <p className="mt-1 text-xs text-muted-foreground">
                              Planejado: {item.quantidade_planejada} item(ns)
                            </p>
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
                                handleItemUsageChange(index, event.target.value)
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
                        {availability.map((item, index) => (
                          <TableRow
                            key={`${item.produto_id}-${index}`}
                            className={cn(
                              "border-primary/10",
                              item.estoque_insuficiente && "bg-destructive/5",
                            )}
                          >
                            <TableCell className="font-medium">
                              {item.nome_produto}
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
                                  handleItemUsageChange(index, event.target.value)
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
                      {totalUsed} item(ns)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Se o total ficar 0, o orçamento sera marcado como cancelado.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:flex md:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleDialogOpenChange(false)}
                      disabled={isSubmitting}
                      className="touch-target h-11 rounded-xl border-white/10 bg-white/[0.03]"
                    >
                      Fechar
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={
                        isSubmitting ||
                        (insufficientItems.length > 0 && !allowFinalizeWithoutStock)
                      }
                      className="touch-target h-11 rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finalizando...
                        </>
                      ) : insufficientItems.length > 0 && !allowFinalizeWithoutStock ? (
                        "Autorize a excecao"
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
  );
};
