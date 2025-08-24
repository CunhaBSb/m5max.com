import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, FileText, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/utils/whatsapp';
import { ConversionContext } from '@/types/forms';
import { AudienceType } from '@/types/common';
import QualificationForm from './QualificationForm';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience: AudienceType;
  source: string;
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
}

const ConversionModal: React.FC<ConversionModalProps> = ({
  isOpen,
  onClose,
  audience,
  source,
  context
}) => {
  const [selectedOption, setSelectedOption] = useState<'whatsapp' | 'form' | null>(null);
  const { attribution } = useAppStore();
  const { trackWhatsAppClick, trackFormEvent } = useAnalytics();

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage(audience);
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience, source }
    );

    trackWhatsAppClick({
      audience,
      source,
      message_template: message,
      phone_number: '556182735575'
    });

    window.open(url, '_blank');
    onClose();
  };

  const handleFormOption = () => {
    setSelectedOption('form');
    trackFormEvent('start', {
      form_type: audience,
      form_name: `${audience}_qualification_form`
    });
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    console.log('Form submitted:', data);
    trackFormEvent('submit', {
      form_type: audience,
      form_name: `${audience}_qualification_form`,
      lead_score: data.leadScore || 0
    });
    onClose();
  };

  const getModalContent = () => {
    if (selectedOption === 'form') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <DialogTitle>Preencha seus dados</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedOption(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <QualificationForm
            audience={audience}
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedOption(null)}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold text-center">
            Como você prefere ser atendido?
          </DialogTitle>
          <p className="text-sm sm:text-base text-muted-foreground text-center px-2">
            Escolha a forma mais conveniente para você
          </p>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4">
          {/* Opção WhatsApp */}
          <Card 
            className="p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
            onClick={handleWhatsAppClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">WhatsApp Direto</h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento imediato
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-green-600 font-medium">RÁPIDO</div>
              </div>
            </div>
          </Card>

          {/* Opção Formulário */}
          <Card 
            className="p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
            onClick={handleFormOption}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">Formulário do Site</h3>
                <p className="text-sm text-muted-foreground">
                  Dados completos
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-primary font-medium">COMPLETO</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Seus dados estão seguros conosco • Não fazemos spam
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <div className="space-y-4">
          {getModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionModal;