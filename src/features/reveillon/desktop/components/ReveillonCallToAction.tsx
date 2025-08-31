import { Button } from '@/shared/ui/button';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { Phone, MessageSquare, Clock, Calendar, Sparkles } from 'lucide-react';

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
    <section className="py-8 xs:py-12 lg:py-20 bg-gradient-to-br from-fire-gold/10 via-fire-orange/10 to-fire-gold/10 relative overflow-hidden">
      {/* Mobile Decorative Elements */}
      <div className="absolute inset-0 opacity-20 lg:opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 lg:w-48 lg:h-48 bg-fire-gold/20 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 lg:w-48 lg:h-48 bg-fire-orange/20 rounded-full blur-2xl lg:blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mobile Badge - Premium */}
          <div className="flex items-center justify-center gap-2 mb-3 xs:mb-4 lg:hidden">
            <div className="bg-gradient-to-r from-fire-gold/20 to-fire-orange/20 border border-fire-gold/40 px-3 py-1.5 rounded-full flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-fire-gold animate-pulse" />
              <span className="text-xs font-bold text-fire-gold">Oferta Limitada</span>
              <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 xs:space-y-5 lg:space-y-6">
            <h2 className="text-xl xs:text-2xl lg:text-5xl font-bold leading-tight">
              <span className="block xs:inline">Garanta Já o Seu</span>
              <br />
              <span className="bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">
                Réveillon 2025
              </span>
            </h2>
            
            <p className="text-sm xs:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 xs:px-0">
              As melhores datas se esgotam rapidamente. Entre em contato agora e 
              reserve o show mais esperado do ano!
            </p>
            
            {/* Mobile Quick Stats */}
            <div className="flex items-center justify-center gap-2 xs:gap-3 lg:hidden">
              <div className="bg-fire-orange/10 px-2 py-1 rounded-full border border-fire-orange/30">
                <span className="text-xs font-bold text-fire-orange">Última Semana</span>
              </div>
              <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                <span className="text-xs font-bold text-green-500">Vagas Limitadas</span>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 lg:gap-4 justify-center pt-4 xs:pt-5 lg:pt-6 px-2 xs:px-0">
              <Button 
                size="sm"
                className="h-10 xs:h-11 lg:h-12 bg-gradient-to-r from-fire-gold to-fire-orange hover:from-fire-orange hover:to-fire-gold text-black font-semibold px-4 xs:px-6 lg:px-8 shadow-lg shadow-fire-gold/20 hover:shadow-fire-orange/30 transition-all duration-300 text-xs xs:text-sm lg:text-base"
                onClick={handleOrçamentoClick}
              >
                <Calendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-1.5 xs:mr-2" />
                <span className="xs:hidden">Orçar</span>
                <span className="hidden xs:inline">Solicitar Orçamento</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="h-10 xs:h-11 lg:h-12 border-fire-gold text-fire-gold hover:bg-fire-gold/10 hover:border-fire-orange px-4 xs:px-6 lg:px-8 backdrop-blur-sm transition-all duration-300 text-xs xs:text-sm lg:text-base"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-3.5 h-3.5 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-1.5 xs:mr-2" />
                <span className="xs:hidden">WhatsApp</span>
                <span className="hidden xs:inline">WhatsApp Direto</span>
              </Button>
            </div>

            {/* Mobile Trust Indicators */}
            <div className="pt-4 xs:pt-6 lg:pt-8 space-y-3 lg:space-y-0">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-6 text-xs xs:text-sm">
                <div className="flex items-center justify-center gap-1.5 xs:gap-2 text-muted-foreground bg-background/20 backdrop-blur-sm px-2 xs:px-3 py-2 rounded-lg border border-fire-gold/20">
                  <Clock className="w-3 h-3 xs:w-4 xs:h-4 text-fire-gold" />
                  <span className="font-medium">Resposta em 2h</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 xs:gap-2 text-muted-foreground bg-background/20 backdrop-blur-sm px-2 xs:px-3 py-2 rounded-lg border border-fire-orange/20">
                  <Phone className="w-3 h-3 xs:w-4 xs:h-4 text-fire-orange" />
                  <span className="font-medium">Atendimento VIP</span>
                </div>
              </div>
              
              {/* Mobile Urgency Footer */}
              <div className="lg:hidden bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-3 rounded-xl border border-fire-orange/15 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-fire-orange">ÚLTIMAS VAGAS DISPONÍVEIS</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mais de 80% das datas já foram reservadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReveillonCallToAction;