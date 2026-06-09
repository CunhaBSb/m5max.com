import { normalizeOrcamentoStatus } from "@/features/admin/modules/orcamentos/status";
import type { OrcamentoStatus } from "@/features/admin/modules/orcamentos/types";

export type ScheduleConflictItem = {
  id: string;
  evento_data?: string | null;
  evento_hora?: string | null;
  evento_nome?: string | null;
  evento_local?: string | null;
  nome_contratante?: string | null;
  status?: string | null;
};

export type ScheduleDateConflict = {
  date: string;
  events: ScheduleConflictItem[];
};

const CONFLICT_ACTIVE_STATUSES = new Set<OrcamentoStatus>([
  "pendente",
  "confirmado",
]);

export const toCivilDate = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
};

export const isScheduleConflictCandidate = (
  item: Pick<ScheduleConflictItem, "evento_data" | "status">,
): boolean => {
  const date = toCivilDate(item.evento_data);
  if (!date) return false;
  return CONFLICT_ACTIVE_STATUSES.has(normalizeOrcamentoStatus(item.status));
};

export const buildScheduleDateConflicts = (
  items: ScheduleConflictItem[],
): ScheduleDateConflict[] => {
  const byDate = new Map<string, ScheduleConflictItem[]>();

  items.forEach((item) => {
    if (!isScheduleConflictCandidate(item)) return;

    const date = toCivilDate(item.evento_data);
    if (!date) return;

    const current = byDate.get(date) ?? [];
    current.push(item);
    byDate.set(date, current);
  });

  return [...byDate.entries()]
    .filter(([, events]) => events.length > 1)
    .map(([date, events]) => ({
      date,
      events: [...events].sort((a, b) => {
        const timeA = a.evento_hora || "00:00";
        const timeB = b.evento_hora || "00:00";
        return timeA.localeCompare(timeB);
      }),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const findScheduleConflictForDate = (
  items: ScheduleConflictItem[],
  date: string | null | undefined,
  excludeId?: string | null,
): ScheduleDateConflict | null => {
  const civilDate = toCivilDate(date);
  if (!civilDate) return null;

  const events = items
    .filter((item) => item.id !== excludeId)
    .filter((item) => isScheduleConflictCandidate(item))
    .filter((item) => toCivilDate(item.evento_data) === civilDate)
    .sort((a, b) => {
      const timeA = a.evento_hora || "00:00";
      const timeB = b.evento_hora || "00:00";
      return timeA.localeCompare(timeB);
    });

  if (events.length === 0) return null;

  return {
    date: civilDate,
    events,
  };
};

export const formatScheduleConflictSummary = (
  conflict: ScheduleDateConflict,
): string => {
  const preview = conflict.events
    .slice(0, 3)
    .map((event) => {
      const time = event.evento_hora ? `${event.evento_hora.slice(0, 5)} - ` : "";
      const name = event.evento_nome || "Evento sem nome";
      const client = event.nome_contratante ? ` (${event.nome_contratante})` : "";
      return `${time}${name}${client}`;
    })
    .join("; ");

  if (conflict.events.length <= 3) return preview;
  return `${preview}; +${conflict.events.length - 3} evento(s)`;
};
