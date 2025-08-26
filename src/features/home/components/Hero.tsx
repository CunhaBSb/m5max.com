import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, Phone, MessageSquare } from "lucide-react";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { heroContent } from "../data/homeContent";

const Hero = () => {
  const isDesktop = useIsDesktop();
  const isMobile = isDesktop === false;
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  // Reset video state when device changes
  useEffect(() => {
    setVideoLoaded(false);
  }, [isMobile]);

  const handleOrçamentoClick = useCallback(() => {
    openConversionModal({
      source: 'hero',
      audience: 'general',
      page: 'home'
    });
  }, [openConversionModal]);

  const handleWhatsAppClick = useCallback(() => {
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
  }, [attribution?.utm, trackWhatsAppClick]);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoaded(false);
  }, []);

  const videoSrc = isMobile 
    ? heroContent.video.mobile
    : heroContent.video.desktop;

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14 md:pt-16">
      {/* Vignette Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: videoLoaded ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlayThrough={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/webm" />
        </video>

        {/* Fallback Background - Always visible until video loads */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-2000 ease-out"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        />
        
        {/* Animated Loading Pattern */}
        {!videoLoaded && (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/10 to-transparent animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)] animate-ping" style={{ animationDuration: '3s' }} />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
      </div>

      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center lg:justify-start min-h-[80vh]">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6 text-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold justify-center text-xs sm:text-sm drop-shadow-lg bg-gradient-to-r from-fire-orange/30 to-fire-red/30 px-4 py-2 rounded-full backdrop-blur-sm border border-fire-orange/40">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                TEMPORADA RÉVEILLON 2025 - FECHAMENTO EM TODO BRASIL
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Shows Pirotécnicos</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-white/90 max-w-sm mx-auto leading-relaxed font-medium drop-shadow-lg">
                Especialistas em espetáculos pirotécnicos para eventos corporativos, formaturas, casamentos e festivais
              </p>
            </div>

            {/* Action Buttons */}
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

            {/* Professional Highlights */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-b from-fire-orange/20 to-fire-red/20 backdrop-blur-sm border border-fire-orange/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-fire-orange mb-1">Equipe</div>
                  <div className="text-xs text-white/90">Profissional</div>
                </div>
                <div className="bg-gradient-to-b from-fire-gold/20 to-yellow-600/20 backdrop-blur-sm border border-fire-gold/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-fire-gold mb-1">Líder</div>
                  <div className="text-xs text-white/90">40 Anos</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-b from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-green-400 mb-1">Segurança</div>
                  <div className="text-xs text-white/90">Primeiro Lugar</div>
                </div>
                <div className="bg-gradient-to-b from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-blue-400 mb-1">Equipamentos</div>
                  <div className="text-xs text-white/90">Última Geração</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-6 text-left max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold justify-start text-sm drop-shadow-lg bg-gradient-to-r from-fire-orange/30 to-fire-red/30 px-4 py-2 rounded-full backdrop-blur-sm w-fit border border-fire-orange/40">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                TEMPORADA RÉVEILLON 2025 - FECHAMENTO EM TODO BRASIL
              </div>
              
              <h1 className="text-3xl xl:text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Shows Pirotécnicos</span>
                <br />
                <span className="text-fire-gradient">Profissionais</span>
              </h1>
              
              <p className="text-base text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg">
                Especialistas em espetáculos pirotécnicos para eventos corporativos, formaturas, casamentos e festivais
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="sm"
                className="flex items-center gap-2"
                onClick={handleOrçamentoClick}
              >
                <Phone className="w-4 h-4" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="sm"
                className="flex items-center gap-2"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Direto
              </Button>
            </div>

            {/* Professional Highlights */}
            <div className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-b from-fire-orange/20 to-fire-red/20 backdrop-blur-sm border border-fire-orange/30 rounded-xl p-3 text-center transition-all duration-300 group">
                  <div className="text-sm font-bold text-fire-orange mb-2 group-hover:text-fire-red transition-colors">Equipe Profissional</div>
                  <div className="text-sm text-white/90">Especialistas certificados</div>
                </div>
                <div className="bg-gradient-to-b from-fire-gold/20 to-yellow-600/20 backdrop-blur-sm border border-fire-gold/30 rounded-xl p-3 text-center transition-all duration-300 group">
                  <div className="text-sm font-bold text-fire-gold mb-2 group-hover:text-yellow-400 transition-colors">Líder Pirotécnico</div>
                  <div className="text-sm text-white/90">40 anos de experiência</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-b from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-3 text-center transition-all duration-300 group">
                  <div className="text-sm font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">Segurança em 1º Lugar</div>
                  <div className="text-sm text-white/90">Protocolos rigorosos</div>
                </div>
                <div className="bg-gradient-to-b from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3 text-center transition-all duration-300 group">
                  <div className="text-sm font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">Equipamentos</div>
                  <div className="text-sm text-white/90">Última geração</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;