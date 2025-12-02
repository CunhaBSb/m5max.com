import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import { Calendar, Play, Shield, Award } from "lucide-react";
import { FaWhatsapp as WhatsApp } from "react-icons/fa";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";
import { heroContent } from "../../data/homeContent";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openFormModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = useCallback(() => {
    openFormModal({
      source: 'hero',
      page: 'home'
    });
  }, [openFormModal]);

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

  const handleVideoClick = useCallback(() => {
    const fogosSection = document.getElementById('fogos-m5-complete');
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
      {/* Vignette Effect */}
      
      
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Professional Bottom Vignette - Optimized Transition */}
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

      <div className="relative z-30 container mx-auto px-8">
        <div className="flex items-center justify-start min-h-[80vh]">
          {/* Desktop Layout */}
          <div className="space-y-6 text-left max-w-2xl w-full">
            <div className="space-y-4">
              {/* Status Badge - Desktop */}
              <div className="flex items-center justify-start gap-2">
                <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-red-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-red-400/40">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Shows Pirotécnicos
                </div>
              </div>
              
              <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Um espetáculo não se improvisa...</span>
                <br />
                <span className="text-fire-gradient">Ele se planeja.</span>
              </h1>
              
              <p className="text-lg text-white/90 drop-shadow-md max-w-lg leading-relaxed">
              Na M5 Max, cada show de fogos é desenhado com segurança, tecnologia e emoção para transformar o seu evento em um momento inesquecível.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              {/* Primary Button - Ver Nossa Expertise - Desktop */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Button 
                  variant="ghost"
                  className="flex items-center justify-center gap-4 w-full h-16 bg-gradient-to-r from-yellow-500/20 via-yellow-400/30 to-yellow-500/20 border-2 border-yellow-400/50 text-white hover:from-yellow-400/30 hover:via-yellow-300/40 hover:to-yellow-400/30 hover:border-yellow-300/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-yellow-400/20 hover:shadow-yellow-300/30"
                  onClick={handleVideoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/50 transition-all group-hover:scale-110">
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold">Ver Nossa Expertise</span>
                    <span className="text-xs text-yellow-200/80">40 anos de experiência</span>
                  </div>
                </Button>
              </div>

              {/* Secondary Buttons - Desktop */}
              <div 
                className={`flex gap-3 transition-all duration-500 ${
                  showSecondaryButtons 
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
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600/20 via-blue-500/30 to-blue-600/20 border border-blue-500/50 text-white hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30 hover:border-blue-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-blue-500/20"
                  onClick={handleOrçamentoClick}
                  data-testid="cta-orcamento"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Orçamento</span>
                  <div className="flex items-center gap-1 ml-2 bg-blue-400/20 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-blue-200 font-bold">Grátis</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Professional Badges - Desktop */}
            <div className="flex items-center justify-start gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-green-400/40">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-white font-medium text-xs">Segurança</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-yellow-400/40">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-white font-medium text-xs">Certificado</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-blue-400/40">
                <span className="text-blue-400 font-bold text-xs">40</span>
                <span className="text-white font-medium text-xs">Anos</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-purple-400/40">
                <span className="text-purple-400 font-bold text-xs">2K+</span>
                <span className="text-white font-medium text-xs">Eventos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
