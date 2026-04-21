import type { Database } from "@/features/admin/types/database";

export type SolicitacaoOrcamento =
  Database["public"]["Tables"]["solicitacoes_orcamento"]["Row"];
export type Orcamento = Database["public"]["Tables"]["orcamentos"]["Row"];
export type Produto = Database["public"]["Tables"]["produtos"]["Row"];
export type OrcamentoProduto =
  Database["public"]["Tables"]["orcamentos_produtos"]["Row"] & {
    produtos?: Produto | null;
  };

export type OrcamentoCompleto = Orcamento & {
  orcamentos_produtos?: OrcamentoProduto[];
  usuarios?: { nome: string } | null;
  solicitacao_origem?: SolicitacaoOrcamento;
};

export type OrcamentoStatus =
  | "pendente"
  | "confirmado"
  | "realizado"
  | "cancelado";

export type OrcamentoStatusMeta = {
  value: OrcamentoStatus;
  label: string;
  badgeClassName: string;
};

export type OrcamentoFormProduct = {
  produto_id: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
};

export type OrcamentoPdfData = Pick<
  Orcamento,
  | "id"
  | "nome_contratante"
  | "telefone"
  | "cpf"
  | "evento_nome"
  | "evento_data"
  | "evento_hora"
  | "evento_local"
  | "valor_total"
  | "status"
  | "created_at"
> & {
  observacoes?: string | null;
  orcamentos_produtos?: Array<{
    quantidade: number;
    valor_unitario: number;
    produtos?: {
      nome_produto: string;
      codigo: string;
      descricao_completa?: string;
      categoria: string;
      duracao_segundos?: number | null;
    } | null;
  }>;
};

export type EventoResumo = {
  id: string;
  nome: string;
  data: string;
  local: string;
  status: OrcamentoStatus;
  cliente_nome: string;
};
