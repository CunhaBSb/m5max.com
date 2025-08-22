import { Button } from "@/components/ui/button";
import { Sparkles, Phone, MessageSquare } from "lucide-react";
import heroFireworks from "@/assets/hero-fireworks.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-16 md:pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroFireworks}
          alt="Professional fireworks display"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-fire-orange font-semibold justify-center lg:justify-start text-sm sm:text-base">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                40 ANOS DE EXPERIÊNCIA
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-foreground">Fogos de Artifício</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Sincronização com música • Segurança certificada • Equipe Blaster habilitada para eventos inesquecíveis
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="lg"
                className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="lg"
                className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                WhatsApp Direto
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-fire-orange">40+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-fire-orange">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Eventos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-fire-orange">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Segurança Certificada</div>
              </div>
            </div>
          </div>

          {/* Logo/Visual Element */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto float-animation">
              <img
                src="/logo.png"
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