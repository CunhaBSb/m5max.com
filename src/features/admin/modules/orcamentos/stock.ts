import {
  isOrcamentoConfirmado,
  normalizeOrcamentoStatus,
} from "@/features/admin/modules/orcamentos/status";
import type {
  OrcamentoFormProduct,
  OrcamentoProduto,
  OrcamentoStatus,
} from "@/features/admin/modules/orcamentos/types";

type ProductQuantityLike =
  | OrcamentoFormProduct
  | Pick<OrcamentoProduto, "produto_id" | "quantidade">;

export type StockDelta = {
  produtoId: string;
  quantityDelta: number;
};

export type ShowUsageItem = {
  produto_id: string;
  quantidade_planejada: number;
  quantidade_usada: number;
};

export type ShowConsumptionItem = {
  produtoId: string;
  quantidadePlanejada: number;
  quantidadeUsada: number;
};

const buildQuantityMap = (
  items: ProductQuantityLike[] = [],
): Map<string, number> => {
  const quantities = new Map<string, number>();

  items.forEach((item) => {
    if (!item.produto_id) {
      return;
    }

    const currentQuantity = quantities.get(item.produto_id) ?? 0;
    quantities.set(item.produto_id, currentQuantity + (item.quantidade || 0));
  });

  return quantities;
};

export const calculateReservedStockDeltas = ({
  previousStatus,
  nextStatus,
  previousItems,
  nextItems,
}: {
  previousStatus: string | null | undefined;
  nextStatus: OrcamentoStatus | string | null | undefined;
  previousItems?: ProductQuantityLike[];
  nextItems?: ProductQuantityLike[];
}): StockDelta[] => {
  const previousReserved = isOrcamentoConfirmado(previousStatus)
    ? buildQuantityMap(previousItems)
    : new Map<string, number>();

  const nextReserved = isOrcamentoConfirmado(nextStatus)
    ? buildQuantityMap(nextItems)
    : new Map<string, number>();

  const productIds = new Set([
    ...previousReserved.keys(),
    ...nextReserved.keys(),
  ]);

  return [...productIds]
    .map((produtoId) => {
      const previousQuantity = previousReserved.get(produtoId) ?? 0;
      const nextQuantity = nextReserved.get(produtoId) ?? 0;

      return {
        produtoId,
        quantityDelta: nextQuantity - previousQuantity,
      };
    })
    .filter((delta) => delta.quantityDelta !== 0);
};

const parseCivilDate = (
  value: string | null | undefined,
): Date | null => {
  if (!value) {
    return null;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  const localDate = new Date(year, month - 1, day);
  if (
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day
  ) {
    return null;
  }

  return localDate;
};

const toCivilDayTimestamp = (value: Date): number =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

export const canFinalizeShow = (
  eventoData: string | null | undefined,
  today: Date = new Date(),
): boolean => {
  const eventoCivilDate = parseCivilDate(eventoData);
  if (!eventoCivilDate) {
    return false;
  }

  return toCivilDayTimestamp(eventoCivilDate) <= toCivilDayTimestamp(today);
};

export const buildShowConsumptionItems = (
  usageItems: ShowUsageItem[],
): ShowConsumptionItem[] => {
  const consumptions = new Map<string, ShowConsumptionItem>();

  usageItems.forEach((item) => {
    if (!item.produto_id) {
      return;
    }

    const quantidadePlanejada = Math.max(0, Number(item.quantidade_planejada) || 0);
    const quantidadeUsada = Math.max(0, Number(item.quantidade_usada) || 0);
    const currentConsumption = consumptions.get(item.produto_id);

    if (currentConsumption) {
      currentConsumption.quantidadePlanejada += quantidadePlanejada;
      currentConsumption.quantidadeUsada += quantidadeUsada;
      return;
    }

    consumptions.set(item.produto_id, {
      produtoId: item.produto_id,
      quantidadePlanejada,
      quantidadeUsada,
    });
  });

  return [...consumptions.values()];
};

export const getShowCompletionTargetStatus = (
  usageItems: ShowUsageItem[],
): Extract<OrcamentoStatus, "realizado" | "cancelado"> => {
  const totalUsed = buildShowConsumptionItems(usageItems).reduce(
    (sum, item) => sum + item.quantidadeUsada,
    0,
  );

  return totalUsed > 0 ? "realizado" : "cancelado";
};

export const normalizeEditableStatus = (
  status: string | null | undefined,
): OrcamentoStatus => normalizeOrcamentoStatus(status);
