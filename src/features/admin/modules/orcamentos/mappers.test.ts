import { describe, expect, it } from "vitest";
import {
  dedupeOrcamentoProdutos,
  mapOrcamentoToEventoResumo,
  mapOrcamentoToPdfData,
} from "@/features/admin/modules/orcamentos/mappers";
import type { OrcamentoCompleto } from "@/features/admin/modules/orcamentos/types";

describe("dedupeOrcamentoProdutos", () => {
  it("remove apenas itens realmente duplicados", () => {
    const items = [
      { produto_id: "produto-a", quantidade: 2, valor_unitario: 100 },
      { produto_id: "produto-a", quantidade: 2, valor_unitario: 100 },
      { produto_id: "produto-a", quantidade: 3, valor_unitario: 100 },
    ];

    expect(dedupeOrcamentoProdutos(items)).toEqual([
      { produto_id: "produto-a", quantidade: 2, valor_unitario: 100 },
      { produto_id: "produto-a", quantidade: 3, valor_unitario: 100 },
    ]);
  });
});

describe("mapOrcamentoToPdfData", () => {
  it("normaliza status legado e preserva apenas produtos unicos", () => {
    const orcamento = {
      id: "orc-001",
      cpf: "12345678900",
      created_at: "2026-04-18T10:00:00.000Z",
      created_by: null,
      evento_data: "2026-05-10",
      evento_local: "Luziânia",
      evento_nome: "Casamento",
      margem_lucro: null,
      modo_pagamento: "pix",
      nome_contratante: "Jose da Silva",
      pdf_url: null,
      status: "realizado",
      telefone: "61999999999",
      tipo: "show",
      updated_at: null,
      valor_total: 4500,
      usuarios: null,
      solicitacao_origem: null,
      orcamentos_produtos: [
        {
          id: "item-1",
          created_at: null,
          orcamento_id: "orc-001",
          produto_id: "produto-a",
          quantidade: 2,
          valor_total: 2000,
          valor_unitario: 1000,
          produtos: {
            id: "produto-a",
            ativo: true,
            categoria: "show",
            codigo: "A001",
            created_at: null,
            duracao_segundos: 30,
            efeito: null,
            fabricante: null,
            nome_produto: "Kit A",
            quantidade_disponivel: 10,
            tubos: null,
            updated_at: null,
            valor_compra: 600,
            valor_venda: 1000,
          },
        },
        {
          id: "item-2",
          created_at: null,
          orcamento_id: "orc-001",
          produto_id: "produto-a",
          quantidade: 2,
          valor_total: 2000,
          valor_unitario: 1000,
          produtos: {
            id: "produto-a",
            ativo: true,
            categoria: "show",
            codigo: "A001",
            created_at: null,
            duracao_segundos: 30,
            efeito: null,
            fabricante: null,
            nome_produto: "Kit A",
            quantidade_disponivel: 10,
            tubos: null,
            updated_at: null,
            valor_compra: 600,
            valor_venda: 1000,
          },
        },
      ],
    } as OrcamentoCompleto;

    const pdfData = mapOrcamentoToPdfData(orcamento);

    expect(pdfData.status).toBe("realizado");
    expect(pdfData.orcamentos_produtos).toHaveLength(1);
    expect(pdfData.orcamentos_produtos?.[0]).toEqual(
      expect.objectContaining({
        quantidade: 2,
        valor_unitario: 1000,
        produtos: expect.objectContaining({
          nome_produto: "Kit A",
        }),
      }),
    );
  });
});

describe("mapOrcamentoToEventoResumo", () => {
  it("aplica fallbacks e normaliza o status exibido no dashboard", () => {
    const resumo = mapOrcamentoToEventoResumo({
      id: "orc-002",
      evento_nome: "",
      evento_data: "",
      evento_local: "",
      nome_contratante: "",
      status: "aprovado",
    });

    expect(resumo).toEqual({
      id: "orc-002",
      nome: "Evento sem nome",
      data: "",
      local: "Local nao definido",
      status: "confirmado",
      cliente_nome: "Cliente nao definido",
    });
  });
});
