import { describe, expect, it } from "vitest";
import {
  buildShowConsumptionItems,
  canFinalizeShow,
  calculateReservedStockDeltas,
  getShowCompletionTargetStatus,
  normalizeEditableStatus,
} from "@/features/admin/modules/orcamentos/stock";

const sortDeltas = (
  deltas: ReturnType<typeof calculateReservedStockDeltas>,
) => [...deltas].sort((left, right) => left.produtoId.localeCompare(right.produtoId));

describe("calculateReservedStockDeltas", () => {
  it("reserva estoque ao confirmar um orcamento pendente", () => {
    const deltas = calculateReservedStockDeltas({
      previousStatus: "pendente",
      nextStatus: "confirmado",
      previousItems: [],
      nextItems: [
        { produto_id: "produto-a", quantidade: 2 },
        { produto_id: "produto-b", quantidade: 1 },
      ],
    });

    expect(sortDeltas(deltas)).toEqual([
      { produtoId: "produto-a", quantityDelta: 2 },
      { produtoId: "produto-b", quantityDelta: 1 },
    ]);
  });

  it("calcula apenas o delta liquido ao editar um orcamento confirmado", () => {
    const deltas = calculateReservedStockDeltas({
      previousStatus: "confirmado",
      nextStatus: "confirmado",
      previousItems: [
        { produto_id: "produto-a", quantidade: 2 },
        { produto_id: "produto-b", quantidade: 1 },
      ],
      nextItems: [
        { produto_id: "produto-a", quantidade: 4 },
        { produto_id: "produto-c", quantidade: 3 },
      ],
    });

    expect(sortDeltas(deltas)).toEqual([
      { produtoId: "produto-a", quantityDelta: 2 },
      { produtoId: "produto-b", quantityDelta: -1 },
      { produtoId: "produto-c", quantityDelta: 3 },
    ]);
  });

  it("devolve estoque ao cancelar um orcamento confirmado", () => {
    const deltas = calculateReservedStockDeltas({
      previousStatus: "confirmado",
      nextStatus: "cancelado",
      previousItems: [
        { produto_id: "produto-a", quantidade: 2 },
        { produto_id: "produto-b", quantidade: 1 },
      ],
      nextItems: [],
    });

    expect(sortDeltas(deltas)).toEqual([
      { produtoId: "produto-a", quantityDelta: -2 },
      { produtoId: "produto-b", quantityDelta: -1 },
    ]);
  });
});

describe("normalizeEditableStatus", () => {
  it("normaliza valores legados para o fluxo atual do painel", () => {
    expect(normalizeEditableStatus("aprovado")).toBe("confirmado");
    expect(normalizeEditableStatus("realizado")).toBe("realizado");
    expect(normalizeEditableStatus("cancelado")).toBe("cancelado");
    expect(normalizeEditableStatus("qualquer-coisa")).toBe("pendente");
  });
});

describe("canFinalizeShow", () => {
  it("permite finalizar no dia ou depois do evento", () => {
    const today = new Date(2026, 3, 18);

    expect(canFinalizeShow("2026-04-18", today)).toBe(true);
    expect(canFinalizeShow("2026-04-17", today)).toBe(true);
    expect(canFinalizeShow("2026-04-19", today)).toBe(false);
  });
});

describe("buildShowConsumptionItems", () => {
  it("agrega por produto e preserva consumo acima do planejado", () => {
    const consumptions = buildShowConsumptionItems([
      {
        produto_id: "produto-a",
        quantidade_planejada: 2,
        quantidade_usada: 1,
      },
      {
        produto_id: "produto-a",
        quantidade_planejada: 1,
        quantidade_usada: 3,
      },
      {
        produto_id: "produto-b",
        quantidade_planejada: 5,
        quantidade_usada: 0,
      },
    ]);

    expect(consumptions).toEqual([
      {
        produtoId: "produto-a",
        quantidadePlanejada: 3,
        quantidadeUsada: 4,
      },
      {
        produtoId: "produto-b",
        quantidadePlanejada: 5,
        quantidadeUsada: 0,
      },
    ]);
  });
});

describe("getShowCompletionTargetStatus", () => {
  it("define realizado quando existe consumo e cancelado quando nao existe", () => {
    expect(
      getShowCompletionTargetStatus([
        {
          produto_id: "produto-a",
          quantidade_planejada: 2,
          quantidade_usada: 1,
        },
      ]),
    ).toBe("realizado");

    expect(
      getShowCompletionTargetStatus([
        {
          produto_id: "produto-a",
          quantidade_planejada: 2,
          quantidade_usada: 0,
        },
      ]),
    ).toBe("cancelado");
  });
});
