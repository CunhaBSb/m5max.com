import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Smartphone,
  Mail,
  Zap
} from "lucide-react";
import { type SolicitacaoOrcamento } from "@/features/admin/modules/orcamentos";

interface SolicitacaoCardProps {
  solicitacao: SolicitacaoOrcamento;
  onView: (solicitacao: SolicitacaoOrcamento) => void;
  onEdit: (solicitacao: SolicitacaoOrcamento) => void;
  onDelete: (id: string) => void;
  onProcess: (id: string) => void;
  formatDate: (date: string) => string;
  getTipoLabel: (tipo: string) => string;
  getStatusColor: (enviado: boolean) => string;
}

export const SolicitacaoCard = ({ 
  solicitacao, 
  onView, 
  onEdit, 
  onDelete, 
  onProcess,
  formatDate,
  getTipoLabel,
  getStatusColor
}: SolicitacaoCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#0A0A0D] shadow-2xl transition-all duration-300 hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
              {solicitacao.nome_completo}
            </h3>
            <div className="mt-1 flex items-center text-[10px] text-muted-foreground sm:text-xs">
              <Calendar className="h-3 w-3 mr-1 text-primary/70" />
              <span>Recebido em {formatDate(solicitacao.created_at!)}</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(solicitacao.enviado_email || false)} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
            {solicitacao.enviado_email ? "Processada" : "Pendente"}
          </Badge>
        </div>
        
        <div className="mb-5 grid grid-cols-1 gap-x-4 gap-y-3 text-xs sm:grid-cols-2">
          <div className="space-y-1">
            <span className="text-muted-foreground block font-medium uppercase text-[9px] tracking-tight">Tipo de Serviço:</span>
            <div className="flex items-center font-semibold text-foreground">
              <Zap className="h-3 w-3 mr-1 text-primary/70" />
              <span className="truncate">{getTipoLabel(solicitacao.tipo_solicitacao)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-muted-foreground block font-medium uppercase text-[9px] tracking-tight">Evento:</span>
            <div className="font-semibold text-foreground truncate">
              {solicitacao.tipo_evento || 'Não informado'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground block font-medium uppercase text-[9px] tracking-tight">Contato:</span>
            <div className="space-y-1">
              <div className="flex items-center font-medium text-foreground text-[11px]">
                <Smartphone className="h-3 w-3 mr-1 text-primary/70 flex-shrink-0" />
                <span>{solicitacao.whatsapp}</span>
              </div>
              {solicitacao.email && (
                <div className="flex items-center font-medium text-foreground text-[11px] truncate">
                  <Mail className="h-3 w-3 mr-1 text-primary/70 flex-shrink-0" />
                  <span className="truncate">{solicitacao.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground block font-medium uppercase text-[9px] tracking-tight">Data/Local:</span>
            <div className="space-y-1">
              <div className="font-semibold text-foreground">
                {solicitacao.data_evento ? formatDate(solicitacao.data_evento) : 'Data não informada'}
                {solicitacao.hora_evento ? ` às ${solicitacao.hora_evento.substring(0, 5)}` : ''}
              </div>
              <div className="flex items-start font-medium text-foreground text-[11px] leading-tight">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 text-primary/70 flex-shrink-0" />
                <span className="line-clamp-1">{solicitacao.localizacao_evento || 'Local não informado'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {solicitacao.observacoes && (
          <div className="mb-4 rounded-xl bg-primary/5 p-3 border border-primary/10">
            <span className="text-muted-foreground block font-medium uppercase text-[9px] tracking-tight mb-1">Observações:</span>
            <p className="text-xs text-foreground/80 leading-relaxed italic">
              "{solicitacao.observacoes}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-1.5 border-t border-white/10 pt-4 sm:gap-2">
          {!solicitacao.enviado_email && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onProcess(solicitacao.id)}
              className="h-9 w-9 p-0 rounded-xl border border-green-500/10 bg-green-500/5 text-green-400 transition-colors hover:bg-green-500/20 hover:text-green-300"
              title="Marcar como processada"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(solicitacao)}
            className="h-9 w-9 p-0 rounded-xl border border-primary/10 bg-primary/5 text-primary transition-colors hover:bg-primary/20 hover:text-primary"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(solicitacao)}
            className="h-9 w-9 p-0 rounded-xl border border-blue-500/10 bg-blue-500/5 text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
            title="Editar / Converter"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(solicitacao.id)}
            className="h-9 w-9 p-0 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
