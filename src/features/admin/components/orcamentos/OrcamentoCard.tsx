import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import { 
  Eye, 
  FileText, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  Clock,
  User, 
  MapPin, 
  Package,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { 
  getOrcamentoStatusMeta, 
  normalizeOrcamentoStatus,
  type OrcamentoCompleto 
} from "@/features/admin/modules/orcamentos";
import { cn } from "@shared/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

interface OrcamentoCardProps {
  orcamento: OrcamentoCompleto;
  onView: (orcamento: OrcamentoCompleto) => void;
  onEdit: (orcamento: OrcamentoCompleto) => void;
  onFullEdit: (orcamento: OrcamentoCompleto) => void;
  onDelete: (id: string) => void;
  onGeneratePdf: (orcamento: OrcamentoCompleto) => void;
  formatDate: (date: string) => string;
}

export const OrcamentoCard = ({ 
  orcamento, 
  onView, 
  onEdit, 
  onFullEdit, 
  onDelete, 
  onGeneratePdf,
  formatDate 
}: OrcamentoCardProps) => {
  const statusMeta = getOrcamentoStatusMeta(orcamento.status);
  const normalizedStatus = normalizeOrcamentoStatus(orcamento.status);
  const isStatusLocked = normalizedStatus === "realizado";

  const dataEvento = orcamento.evento_data ? parseISO(orcamento.evento_data) : null;

  return (
    <Card className="glass-card group relative overflow-hidden rounded-[2rem] border-white/5 p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:border-primary/20">
      {/* Background Decorativo Sutil */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity -rotate-12 pointer-events-none">
         <Package className="h-40 w-40" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Timeline Section: Date + Time side by side */}
          <div className="flex items-center gap-5">
            <div className={cn(
              "flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-white/5 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20",
              isStatusLocked ? "bg-emerald-500 text-white" : "bg-primary text-white"
            )}>
               <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1">
                 {dataEvento ? format(dataEvento, "MMM", { locale: ptBR }) : "M5"}
               </span>
               <span className="text-2xl font-black leading-none sm:text-3xl">
                 {dataEvento ? format(dataEvento, "dd") : "MAX"}
               </span>
            </div>

            {orcamento.evento_hora && (
              <div className="flex flex-col justify-center border-l border-white/10 pl-5 h-12">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Horário</span>
                 <div className="flex items-center gap-2 text-white group-hover:text-primary transition-colors">
                   <Clock className="h-4 w-4 opacity-40" />
                   <span className="text-xl font-black tracking-tighter">
                     {orcamento.evento_hora.substring(0, 5)}
                   </span>
                 </div>
              </div>
            )}
          </div>

          {/* Value Section */}
          <div className="flex flex-col md:items-end md:text-right">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Investimento Previsto</span>
             <span className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
               R$ {(orcamento.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={cn(
              "text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full border shadow-sm transition-colors",
              statusMeta.badgeClassName
            )}>
              {statusMeta.label}
            </Badge>
            <div className="h-1 w-1 rounded-full bg-white/10" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              {orcamento.tipo === 'show_pirotecnico' ? 'PROPOSTA TÁTICA' : 'VENDA DIRETA'}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white transition-colors group-hover:text-primary tracking-tighter">
            {orcamento.nome_contratante}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 text-white/40 group/info">
              <div className="p-2 rounded-xl bg-white/5 text-primary transition-all group-hover/info:bg-primary group-hover/info:text-white">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-white/80 truncate">{orcamento.evento_nome || 'Orçamento S/N'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/40 group/info">
              <div className="p-2 rounded-xl bg-white/5 text-primary transition-all group-hover/info:bg-primary group-hover/info:text-white">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium leading-relaxed truncate">{orcamento.evento_local || 'Local não definido'}</span>
            </div>
          </div>
        </div>

        {/* Footer: Responsável + Actions */}
        <div className="mt-4 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-primary shadow-inner">
              {(orcamento.usuarios?.nome || 'A').charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Responsável</span>
              <span className="text-xs font-bold text-white/60">{orcamento.usuarios?.nome || 'Sistema M5'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-11 rounded-2xl bg-white/5 hover:bg-primary hover:text-white px-6 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              onClick={() => onView(orcamento)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Abrir Ficha
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                <DropdownMenuItem onClick={() => onGeneratePdf(orcamento)} className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                  <FileText className="h-4 w-4 mr-3 opacity-50" />
                  Gerar PDF Oficial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFullEdit(orcamento)} className="rounded-xl focus:bg-blue-500/10 focus:text-blue-400 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                  <Edit className="h-4 w-4 mr-3 opacity-50" />
                  Editar Completo
                </DropdownMenuItem>
                {!isStatusLocked && (
                  <DropdownMenuItem onClick={() => onEdit(orcamento)} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle className="h-4 w-4 mr-3 opacity-50" />
                    Mudar Status
                  </DropdownMenuItem>
                )}
                <div className="h-px bg-white/5 my-2" />
                <DropdownMenuItem onClick={() => onDelete(orcamento.id)} className="rounded-xl focus:bg-red-500/10 focus:text-red-400 text-red-500/70 cursor-pointer py-3 font-bold text-xs uppercase tracking-widest">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Excluir Proposta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};
