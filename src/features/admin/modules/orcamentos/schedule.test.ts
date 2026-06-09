import { describe, expect, it } from "vitest";
import {
  buildScheduleDateConflicts,
  findScheduleConflictForDate,
  formatScheduleConflictSummary,
  toCivilDate,
} from "@/features/admin/modules/orcamentos/schedule";

const baseItems = [
  {
    id: "1",
    evento_data: "2026-06-20",
    evento_hora: "20:00",
    evento_nome: "Casamento",
    nome_contratante: "Ana",
    status: "confirmado",
  },
  {
    id: "2",
    evento_data: "2026-06-20T12:00:00Z",
    evento_hora: "18:00",
    evento_nome: "Condominio",
    nome_contratante: "Bruno",
    status: "pendente",
  },
  {
    id: "3",
    evento_data: "2026-06-21",
    evento_nome: "Evento cancelado",
    status: "cancelado",
  },
  {
    id: "4",
    evento_data: "2026-06-21",
    evento_nome: "Evento realizado",
    status: "realizado",
  },
];

describe("schedule conflict helpers", () => {
  it("normaliza datas civis sem deslocar fuso", () => {
    expect(toCivilDate("2026-06-20")).toBe("2026-06-20");
    expect(toCivilDate("2026-06-20T12:00:00Z")).toBe("2026-06-20");
    expect(toCivilDate("")).toBeNull();
    expect(toCivilDate("20/06/2026")).toBeNull();
  });

  it("agrupa conflitos apenas para eventos ativos no mesmo dia", () => {
    const conflicts = buildScheduleDateConflicts(baseItems);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].date).toBe("2026-06-20");
    expect(conflicts[0].events.map((event) => event.id)).toEqual(["2", "1"]);
  });

  it("encontra conflitos para criacao ou edicao excluindo o proprio item", () => {
    expect(findScheduleConflictForDate(baseItems, "2026-06-20")?.events).toHaveLength(2);
    expect(findScheduleConflictForDate(baseItems, "2026-06-20", "1")?.events).toHaveLength(1);
    expect(findScheduleConflictForDate(baseItems, "2026-06-21")).toBeNull();
  });

  it("formata resumo operacional curto", () => {
    const conflict = buildScheduleDateConflicts(baseItems)[0];

    expect(formatScheduleConflictSummary(conflict)).toBe(
      "18:00 - Condominio (Bruno); 20:00 - Casamento (Ana)",
    );
  });
});
