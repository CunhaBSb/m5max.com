import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { AudienceType } from '@/shared/types/common';

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
  const { attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

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


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <div className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl font-bold text-center">
              Atendimento WhatsApp
            </DialogTitle>
            <p className="text-sm sm:text-base text-muted-foreground text-center px-2">
              Fale diretamente com nossa equipe
            </p>
          </DialogHeader>

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
                <div className="text-xs text-green-600 font-medium">ONLINE</div>
              </div>
            </div>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            Seus dados estão seguros conosco • Não fazemos spam
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversionModal;