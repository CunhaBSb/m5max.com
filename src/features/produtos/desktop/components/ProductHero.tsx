import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Sparkles, Package, MapPin, FileText, Zap, Shield } from "lucide-react";
import { FaWhatsapp as WhatsApp } from "react-icons/fa";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { safetyBadges } from "../../data/produtos";
import { heroContent } from "../../data/heroContent";

const ProductHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackEvent } = useAnalytics();

  const handleScrollToKits = useCallback(() => {
    const kitsSection = document.getElementById('tipos-produtos');
    if (kitsSection) {
      kitsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    trackEvent('cta_clicked', { 
      location: 'hero', 
      cta_type: 'primary',
      target: 'types_selection'
    });
  }, [trackEvent]);

  const handleScrollToPromocoes = useCallback(() => {
    const promocoesSection = document.getElementById('promocoes');
    if (promocoesSection) {
      promocoesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    trackEvent('cta_clicked', { 
      location: 'hero', 
      cta_type: 'secondary',
      target: 'promocoes_section'
    });
  }, [trackEvent]);

  const handleScrollToGeral = useCallback(() => {
    const geralSection = document.getElementById('geral');
    if (geralSection) {
      geralSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    trackEvent('cta_clicked', { 
      location: 'hero', 
      cta_type: 'tertiary',
      target: 'geral_section'
    });
  }, [trackEvent]);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoaded(false);
  }, []);

  // Professional video system - desktop source
  const videoSrc = heroContent.video.desktop;

  // Animation for secondary CTAs
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondaryButtons(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center gradient-hero overflow-hidden pt-20">
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
          <source src={heroContent.video.mobile} type="video/webm" />
          <source src="/assets/produtos-hero.mp4" type="video/mp4" />
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      </div>

      <div className="relative z-30 container mx-auto px-6 max-w-6xl">
        <div className="flex items-center min-h-[80vh]">
          <div className="w-full pb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Content */}
              <div className="space-y-7">
                {/* Trust Indicators Row */}
                <div className="flex items-center justify-start gap-1.5 flex-wrap">
                  {safetyBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-fire-orange/40">
                      <span className="text-fire-gold text-xs">{badge.icon}</span>
                      <span className="text-white font-medium text-xs">{badge.nome}</span>
                    </div>
                  ))}
                </div>
                
                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                    <span className="text-white">Kits e Artigos Pirotécnicos</span>
                    <br />
                    <span className="text-fire-gradient">Profissionais</span>
                  </h1>
                  
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg">
                    Shows prontos para o seu evento especial. Segurança certificada e 40+ anos de experiência.
                  </p>
                </div>

                {/* Value Proposition Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 text-center">
                    <div className="text-lg font-bold text-fire-gold mb-0.5">40+</div>
                    <div className="text-white/80 text-xs">Anos de Experiência</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 text-center">
                    <div className="text-lg font-bold text-fire-gold mb-0.5">2K+</div>
                    <div className="text-white/80 text-xs">Eventos Realizados</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/20 text-center">
                    <div className="text-lg font-bold text-fire-gold mb-0.5">100%</div>
                    <div className="text-white/80 text-xs">Segurança Certificada</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="fire"
                    size="default"
                    onClick={handleScrollToKits}
                    className="sm:px-5 shadow-fire hover:scale-[1.02] transition-bounce font-medium text-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Ver Catálogo Completo
                  </Button>
                  
                  <Button
                    variant="outline-fire"
                    size="default"
                    onClick={handleScrollToPromocoes}
                    className="sm:px-5 font-medium text-sm"
                  >
                    <Package className="w-4 h-4 mr-1.5" />
                    Ofertas Especiais
                  </Button>
                </div>
              </div>

              {/* Right Column - Feature Highlights */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-fire-orange/20 to-fire-red/20 backdrop-blur-md rounded-xl p-4 border border-fire-orange/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-fire-orange flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">Segurança Garantida</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Todos os produtos seguem rigorosos padrões de segurança e incluem instruções detalhadas para uso responsável.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-tech-blue/20 to-tech-purple/20 backdrop-blur-md rounded-xl p-4 border border-tech-blue/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-tech-blue flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">Entrega Rápida</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Logística otimizada para garantir que seu evento aconteça no prazo. Entregamos em todo o Brasil.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">Suporte Completo</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Atendimento via WhatsApp para esclarecimento de dúvidas e suporte técnico durante seu evento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Bottom Vignette - Sistema Completo da Home */}
      <div className="absolute bottom-0 left-0 w-full h-12 z-25 pointer-events-none">
        {/* Main gradient using original background colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent"></div>
        
        {/* Professional fade pattern */}
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background/95 to-transparent"></div>
        
        {/* Side accent gradients */}
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default ProductHero;