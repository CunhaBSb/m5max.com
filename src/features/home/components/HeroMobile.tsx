import { Button } from "@/shared/components/ui/button";
import { Sparkles, Phone, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/utils/whatsapp";

const HeroMobile = () => {
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'hero_mobile',
      audience: 'general',
      page: 'home'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'hero_mobile' }
    );

    trackWhatsAppClick({
      audience: 'general',
      source: 'hero_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/mobile/hero_mobile.webp"
          alt="Professional fireworks display"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center space-y-8 text-white min-h-screen flex flex-col justify-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fire-orange/20 border border-fire-orange/30 rounded-full text-fire-orange font-semibold text-sm backdrop-blur-sm mx-auto">
            <Sparkles className="w-4 h-4" />
            40 ANOS DE EXPERIÊNCIA
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
              <span className="block text-white">Mais do que</span>
              <span className="block text-transparent bg-gradient-to-r from-fire-orange via-fire-gold to-fire-red bg-clip-text text-4xl sm:text-5xl">
                Pirotecnia
              </span>
              <span className="block text-white text-2xl sm:text-3xl mt-2">
                Somos pura emoção!
              </span>
            </h1>
          </div>

          {/* Logo */}
          <div className="py-4">
            <img
              src="/m5logo.svg"
              alt="M5 Max Produções"
              className="w-48 sm:w-56 h-auto mx-auto opacity-90"
              loading="eager"
            />
          </div>

          {/* Professional Features */}
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-2 h-2 bg-fire-orange rounded-full flex-shrink-0" />
              <span className="text-sm font-medium text-left">Fogos de artifícios de baixo ruído</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-2 h-2 bg-fire-gold rounded-full flex-shrink-0" />
              <span className="text-sm font-medium text-left">Show pirotécnico sincronizado</span>
            </div>
          </div>

          {/* Call to Action */}
          <p className="text-base text-gray-200 font-light max-w-xs mx-auto">
            Eternize momentos especiais conosco!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button 
              variant="hero" 
              size="lg"
              className="w-full flex items-center justify-center gap-2 py-4 text-base font-semibold"
              onClick={handleOrçamentoClick}
            >
              <Phone className="w-5 h-5" />
              Solicitar Orçamento
            </Button>
            
            <Button 
              variant="whatsapp" 
              size="lg"
              className="w-full flex items-center justify-center gap-2 py-4 text-base font-semibold"
              onClick={handleWhatsAppClick}
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp Direto
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-white/20 max-w-sm mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  40+
                </div>
                <div className="text-xs font-medium text-gray-300">Anos de Experiência</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  500+
                </div>
                <div className="text-xs font-medium text-gray-300">Eventos Realizados</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  100%
                </div>
                <div className="text-xs font-medium text-gray-300">Segurança Certificada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;