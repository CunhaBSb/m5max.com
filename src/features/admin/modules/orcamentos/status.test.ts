import { describe, expect, it } from "vitest";
import {
  getOrcamentoStatusMeta,
  isOrcamentoConfirmado,
  normalizeOrcamentoStatus,
} from "@/features/admin/modules/orcamentos/status";

describe("normalizeOrcamentoStatus", () => {
  it.each([
    ["confirmado", "confirmado"],
    [" cancelado ", "cancelado"],
    ["aprovado", "confirmado"],
    ["processado", "confirmado"],
    ["REALIZADO", "realizado"],
    ["pendente", "pendente"],
    ["desconhecido", "pendente"],
    [undefined, "pendente"],
    [null, "pendente"],
  ])("normaliza %p para %p", (input, expected) => {
    expect(normalizeOrcamentoStatus(input)).toBe(expected);
  });
});

describe("getOrcamentoStatusMeta", () => {
  it("reaproveita os metadados do status normalizado", () => {
    expect(getOrcamentoStatusMeta("realizado")).toEqual(
      expect.objectContaining({
        value: "realizado",
        label: "Realizado",
      }),
    );
  });
});

describe("isOrcamentoConfirmado", () => {
  it("reconhece status legados confirmados", () => {
    expect(isOrcamentoConfirmado("aprovado")).toBe(true);
    expect(isOrcamentoConfirmado("realizado")).toBe(false);
    expect(isOrcamentoConfirmado("pendente")).toBe(false);
  });
});
