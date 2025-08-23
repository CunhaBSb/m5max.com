import { Button } from "@/components/ui/button";
import { Sparkles, Phone, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/utils/whatsapp";
import heroFireworks from "@/assets/header/wallpaperleque.webp";

const Hero = () => {
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'hero',
      audience: 'general',
      page: 'home'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'hero' }
    );

    trackWhatsAppClick({
      audience: 'general',
      source: 'hero',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14 md:pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFireworks}
          alt="Professional fireworks display"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
      </div>
      
      {/* Floating Elements - Hidden on Mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-fire-gold rounded-full sparkle-animation opacity-60`}
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:gap-12 lg:items-center">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6 text-center">
            {/* Header Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-fire-orange font-semibold justify-center text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" />
                40 ANOS DE EXPERIÊNCIA
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                <span className="text-foreground">Fogos de Artifício</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Equipamentos profissionais de última geração • Segurança certificada • Equipe Blaster habilitada para eventos inesquecíveis
              </p>
            </div>

            {/* Centered Logo */}
            <div className="flex justify-center py-4">
              <div className="relative w-full max-w-48 sm:max-w-56">
                <img
                  src="/m5logo.svg"
                  alt="M5 Max Produções"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <Button 
                variant="hero" 
                size="default"
                className="flex items-center gap-2 w-full"
                onClick={handleOrçamentoClick}
              >
                <Phone className="w-4 h-4" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="default"
                className="flex items-center gap-2 w-full"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Direto
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-fire-orange">40+</div>
                <div className="text-xs text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-fire-orange">500+</div>
                <div className="text-xs text-muted-foreground">Eventos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-fire-orange">100%</div>
                <div className="text-xs text-muted-foreground">Segurança Certificada</div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-fire-orange font-semibold justify-start text-sm">
                <Sparkles className="w-4 h-4" />
                40 ANOS DE EXPERIÊNCIA
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                <span className="text-foreground">Fogos de Artifício</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Equipamentos profissionais de última geração • Segurança certificada • Equipe Blaster habilitada para eventos inesquecíveis
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="default"
                className="flex items-center gap-2"
                onClick={handleOrçamentoClick}
              >
                <Phone className="w-4 h-4" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="default"
                className="flex items-center gap-2"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Direto
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-xl font-bold text-fire-orange">40+</div>
                <div className="text-xs text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-fire-orange">500+</div>
                <div className="text-xs text-muted-foreground">Eventos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-fire-orange">100%</div>
                <div className="text-xs text-muted-foreground">Segurança Certificada</div>
              </div>
            </div>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block relative">
            <div className="relative w-full max-w-md mx-auto float-animation">
              <img
                src="/m5logo.svg"
                alt="M5 Max Produções"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 gradient-sparkle opacity-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;