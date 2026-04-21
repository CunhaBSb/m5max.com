import { normalizeOrcamentoStatus } from "@/features/admin/modules/orcamentos/status";
import type {
  EventoResumo,
  Orcamento,
  OrcamentoCompleto,
  OrcamentoPdfData,
  OrcamentoProduto,
} from "@/features/admin/modules/orcamentos/types";

export const dedupeOrcamentoProdutos = <T extends Pick<
  OrcamentoProduto,
  "produto_id" | "quantidade" | "valor_unitario"
>>(
  items?: T[] | null,
): T[] => {
  if (!items?.length) {
    return [];
  }

  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.produto_id}-${item.quantidade}-${item.valor_unitario}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const mapOrcamentoToPdfData = (
  orcamento: OrcamentoCompleto,
): OrcamentoPdfData => ({
  id: orcamento.id,
  nome_contratante: orcamento.nome_contratante,
  telefone: orcamento.telefone,
  cpf: orcamento.cpf,
  evento_nome: orcamento.evento_nome,
  evento_data: orcamento.evento_data,
  evento_local: orcamento.evento_local,
  observacoes: null,
  valor_total: orcamento.valor_total ?? 0,
  status: normalizeOrcamentoStatus(orcamento.status),
  created_at: orcamento.created_at,
  orcamentos_produtos: dedupeOrcamentoProdutos(
    orcamento.orcamentos_produtos,
  ).map((item) => ({
    quantidade: item.quantidade,
    valor_unitario: item.valor_unitario,
    produtos: item.produtos
      ? {
          nome_produto: item.produtos.nome_produto,
          codigo: item.produtos.codigo,
          descricao_completa: item.produtos.descricao_completa ?? undefined,
          categoria: item.produtos.categoria,
          duracao_segundos: item.produtos.duracao_segundos,
        }
      : null,
  })),
});

export const mapOrcamentoToEventoResumo = (
  orcamento: Pick<
    Orcamento,
    | "id"
    | "evento_nome"
    | "evento_data"
    | "evento_local"
    | "nome_contratante"
    | "status"
  >,
): EventoResumo => ({
  id: orcamento.id,
  nome: orcamento.evento_nome || "Evento sem nome",
  data: orcamento.evento_data || "",
  local: orcamento.evento_local || "Local nao definido",
  status: normalizeOrcamentoStatus(orcamento.status),
  cliente_nome: orcamento.nome_contratante || "Cliente nao definido",
});
