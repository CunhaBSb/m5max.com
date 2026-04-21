import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import { Calendar, Play, Shield, Award } from "lucide-react";
import { FaWhatsapp as WhatsApp } from "react-icons/fa";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";
import { heroContent } from "@/features/home/data/homeContent";
import { SaoJoaoModal } from "./SaoJoaoModal";

const SaoJoaoHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'sao_joao_hero' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'sao_joao_hero',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  }, [attribution?.utm, trackWhatsAppClick]);

  const handleVideoClick = useCallback(() => {
    const fogosSection = document.getElementById('empresa');
    if (fogosSection) {
      fogosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoaded(false);
  }, []);

  const videoSrc = heroContent.video.desktop;

  // Animation for secondary buttons
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondaryButtons(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-16">
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
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-black transition-opacity duration-2000 ease-out"
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

      {/* Professional Bottom Vignette - Optimized Transition */}
      <div className="absolute bottom-0 left-0 w-full h-12 z-25 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background/95 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>

      <div className="relative z-30 container mx-auto px-8">
        <div className="flex items-center justify-start min-h-[80vh]">
          {/* Desktop Layout */}
          <div className="space-y-6 text-left max-w-2xl w-full">
            <div className="space-y-4">
              {/* Status Badge - Desktop */}
              <div className="flex items-center justify-start gap-2">
                <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-orange-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-orange-400/40">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  Especial São João
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Alegria, cor e segurança...</span>
                <br />
                <span className="text-fire-gradient">O seu Arraiá inesquecível.</span>
              </h1>

              <p className="text-lg text-white/90 drop-shadow-md max-w-lg leading-relaxed">
                Transforme sua Festa Junina em um espetáculo grandioso. Oferecemos shows pirotécnicos de alta qualidade, 100% seguros e coreografados para o seu evento.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              {/* Primary Button - Ver Nossa Expertise - Desktop */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center gap-4 w-full h-16 bg-gradient-to-r from-orange-500/20 via-red-500/30 to-orange-500/20 border-2 border-orange-400/50 text-white hover:from-orange-400/30 hover:via-red-400/40 hover:to-orange-400/30 hover:border-orange-300/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-orange-400/20 hover:shadow-orange-300/30"
                  onClick={handleVideoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-orange-400/50 transition-all group-hover:scale-110">
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold">Ver Nossa Expertise</span>
                    <span className="text-xs text-orange-200/80">Especialistas em Shows Juninos</span>
                  </div>
                </Button>
              </div>

              {/* Secondary Buttons - Desktop */}
              <div
                className={`flex gap-3 transition-all duration-500 ${showSecondaryButtons
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-2'
                  }`}
              >
                {/* WhatsApp Button - Desktop */}
                <Button
                  variant="ghost"
                  className="flex-1 h-12 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 hover:via-green-400/40 hover:to-green-500/30 hover:border-green-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-green-500/20"
                  onClick={handleWhatsAppClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <WhatsApp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">WhatsApp</span>
                  <div className="flex items-center gap-1 ml-2 bg-green-400/20 px-1.5 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-200">Online</span>
                  </div>
                </Button>

                {/* Orçamento Button - Desktop */}
                <Button
                  variant="ghost"
                  className="flex-1 h-12 bg-gradient-to-r from-fire-orange/22 via-fire-gold/18 to-fire-orange/22 border border-fire-orange/55 text-white hover:from-fire-orange/30 hover:via-fire-gold/24 hover:to-fire-orange/30 hover:border-fire-gold/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-[0_18px_34px_-18px_rgba(249,115,22,0.85)]"
                  onClick={handleOrçamentoClick}
                  data-testid="cta-orcamento"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Reserve sua data</span>
                  <div className="flex items-center gap-1 ml-2 bg-fire-orange/25 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-fire-gold font-bold">Vagas</span>
                  </div>
                </Button>
              </div>
              <div className="rounded-xl border border-fire-orange/35 bg-gradient-to-r from-fire-orange/10 via-fire-gold/5 to-fire-orange/10 px-3 py-2.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-fire-gold/85 font-semibold">
                  <span>Oferta São João</span>
                  <span className="text-fire-orange">Alta Procura</span>
                </div>
                <p className="mt-1 text-xs text-white/88 leading-relaxed">
                  Condições exclusivas para sua <span className="text-fire-gold font-semibold">festa junina corporativa</span> ou de cidade.
                </p>
              </div>
            </div>

            {/* Professional Badges - Desktop */}
            <div className="flex items-center justify-start gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-green-400/40">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-white font-medium text-xs">Segurança 100%</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-yellow-400/40">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-white font-medium text-xs">Qualidade Premium</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-blue-400/40">
                <span className="text-blue-400 font-bold text-xs">40</span>
                <span className="text-white font-medium text-xs">Anos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bespoke São João Modal */}
      <SaoJoaoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default SaoJoaoHero;
