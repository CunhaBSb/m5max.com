import type {
  OrcamentoStatus,
  OrcamentoStatusMeta,
} from "@/features/admin/modules/orcamentos/types";

export const ORCAMENTO_STATUS_OPTIONS: OrcamentoStatusMeta[] = [
  {
    value: "pendente",
    label: "Pendente",
    badgeClassName: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  {
    value: "confirmado",
    label: "Confirmado",
    badgeClassName: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    value: "realizado",
    label: "Realizado",
    badgeClassName: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    value: "cancelado",
    label: "Cancelado",
    badgeClassName: "bg-red-500/10 text-red-400 border-red-500/20",
  },
];

export const normalizeOrcamentoStatus = (
  status: string | null | undefined,
): OrcamentoStatus => {
  const normalizedStatus = status?.trim().toLowerCase();

  if (
    normalizedStatus === "confirmado" ||
    normalizedStatus === "aprovado" ||
    normalizedStatus === "processado"
  ) {
    return "confirmado";
  }

  if (normalizedStatus === "realizado") {
    return "realizado";
  }

  if (normalizedStatus === "cancelado") {
    return "cancelado";
  }

  return "pendente";
};

export const getOrcamentoStatusMeta = (
  status: string | null | undefined,
): OrcamentoStatusMeta => {
  const normalizedStatus = normalizeOrcamentoStatus(status);

  return (
    ORCAMENTO_STATUS_OPTIONS.find((option) => option.value === normalizedStatus) ??
    ORCAMENTO_STATUS_OPTIONS[0]
  );
};

export const isOrcamentoConfirmado = (
  status: string | null | undefined,
): boolean => {
  const normalizedStatus = status?.trim().toLowerCase();

  return (
    normalizedStatus === "confirmado" ||
    normalizedStatus === "aprovado" ||
    normalizedStatus === "processado"
  );
};
