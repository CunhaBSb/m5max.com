import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, Phone, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/utils/whatsapp";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize loading state based on device
  useEffect(() => {
    // Reset video state when device type changes
    setVideoLoaded(false);
    setIsLoading(true);
  }, [isMobile]);

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
      audience: 'b2b',
      source: 'hero',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14 md:pt-16">
      {/* Vignette Effect - Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Video */}
        {!isMobile && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: videoLoaded ? 1 : 0 }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={() => {
              console.log('Hero desktop2 video loaded');
              setVideoLoaded(true);
              setIsLoading(false);
            }}
            onError={() => {
              console.warn('Hero desktop2 video failed, using fallback');
              setVideoLoaded(false);
              setIsLoading(false);
            }}
          >
            <source src="https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/Herowallpaper.webm" type="video/webm" />
          </video>
        )}

        {/* Mobile Video */}
        {isMobile && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: videoLoaded ? 1 : 0 }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={() => {
              console.log('Hero P2.Mobile video loaded');
              setVideoLoaded(true);
              setIsLoading(false);
            }}
            onError={() => {
              console.warn('Hero P2.Mobile video failed, using fallback');
              setVideoLoaded(false);
              setIsLoading(false);
            }}
          >
            <source src="https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/P2.Mobile.webm" type="video/webm" />
          </video>
        )}

        {/* Fallback Background */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: videoLoaded ? 0 : 0.5
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
        
        {/* Subtle Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500" />
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center lg:justify-start min-h-[80vh]">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6 text-center">
            {/* Header Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold justify-center text-xs sm:text-sm drop-shadow-lg bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                40 ANOS DE EXPERIÊNCIA
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Fogos de Artifício</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-sm sm:text-base text-white/90 max-w-sm mx-auto leading-relaxed font-medium drop-shadow-lg">
                Tecnologia pirotécnica avançada com certificação internacional e equipe técnica especializada
              </p>
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
          <div className="hidden lg:block space-y-6 text-left max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold justify-start text-sm drop-shadow-lg bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm w-fit">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                40 ANOS DE EXPERIÊNCIA
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Fogos de Artifício</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-lg text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg">
                Tecnologia pirotécnica avançada com certificação internacional e equipe técnica especializada
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

        </div>
      </div>
    </section>
  );
};

export default Hero;