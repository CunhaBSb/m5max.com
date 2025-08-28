import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { Phone, MessageSquare, Clock, Calendar } from 'lucide-react';

const ReveillonCallToAction = () => {
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'final_cta',
      audience: 'b2b',
      page: 'reveillon',
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2b', source: 'final_cta' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'final_cta',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400/10 via-purple-500/10 to-indigo-600/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Garanta Já o Seu
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Réveillon 2025
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              As melhores datas se esgotam rapidamente. Entre em contato agora e 
              reserve o show mais esperado do ano!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                onClick={handleOrçamentoClick}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 px-8"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                WhatsApp Direto
              </Button>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span>Resposta em até 2 horas</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-green-500" />
                <span>Atendimento especializado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReveillonCallToAction;