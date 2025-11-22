import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Calendar, Play } from "lucide-react";
import { FaWhatsapp as WhatsApp } from "react-icons/fa";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";

const ProductHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openFormModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = useCallback(() => {
    openFormModal({
      source: 'hero_mobile',
      audience: 'b2c',
      page: 'produtos',
    });
  }, [openFormModal]);

  const handleWhatsAppClick = useCallback(() => {
    const message = getWhatsAppMessage('b2c');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2c', source: 'hero_mobile' }
    );

    trackWhatsAppClick({
      audience: 'b2c',
      source: 'hero_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  }, [attribution?.utm, trackWhatsAppClick]);

  const handleVideoClick = useCallback(() => {
    const seletorSection = document.getElementById('seletor-produtos');
    if (seletorSection) {
      seletorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoaded(false);
  }, []);

  // Mobile video source - using produtos-specific mobile video
  const videoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/produtos-mobile.webm";

  // Animation for secondary buttons
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondaryButtons(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14">
      {/* Video Background - Mobile Optimized */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: videoLoaded ? 0.7 : 0 }}
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
        
        {/* Mobile Loading Pattern */}
        {!videoLoaded && (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/8 to-transparent animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.08),transparent_50%)] animate-ping" style={{ animationDuration: '4s' }} />
          </div>
        )}

        {/* Mobile Overlay - More Subtle Video */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/85" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/85 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Mobile Pyrotechnic Particle System - Performance Optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Reduced density golden sparks */}
        <div className="absolute top-1/5 left-1/6 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-35" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-fire-gold/70 rounded-full animate-ping opacity-40" style={{ animationDelay: '2.2s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-30" style={{ animationDelay: '3.1s', animationDuration: '2s' }} />
        
        {/* Mobile firework trails - simplified */}
        <div className="absolute top-1/4 right-1/5 w-px h-8 bg-gradient-to-b from-fire-gold/25 to-transparent rotate-12 opacity-30" />
        <div className="absolute bottom-1/3 left-1/4 w-px h-6 bg-gradient-to-t from-fire-orange/20 to-transparent -rotate-12 opacity-25" />
      </div>
      
      {/* Mobile Expertise Burst - Reduced size */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 
             bg-gradient-radial from-fire-gold/10 via-fire-orange/5 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>
      
      {/* Professional Bottom Vignette - Mobile Optimized */}
      <div className="absolute bottom-0 left-0 w-full h-10 z-25 pointer-events-none">
        {/* Main gradient using background colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent"></div>
        
        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent"></div>
        
        {/* Professional fade pattern */}
        <div className="absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t from-background/95 to-transparent"></div>
        
        {/* Mobile side accent gradients */}
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>
      
      <div className="relative z-30 container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[80vh]">
          {/* Mobile Layout */}
          <div className="space-y-6 text-center max-w-sm w-full">
            <div className="space-y-4">
              {/* Status Badge - Mobile */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-fire-orange/40">
                  <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
                  Produtos Premium
                </div>
              </div>
              
              <h1 className="text-3xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white block">Cada produto tem sua história...</span>
                <span className="text-fire-gradient block text-2xl mt-1">Cada história, seu espetáculo.</span>
              </h1>
              
              <p className="text-base text-white/90 drop-shadow-md leading-relaxed px-2">
                Descubra nossos kits pirotécnicos premium: do intimismo do Chá Revelação à grandiosidade do Kit Festa. Cada produto é uma experiência única criada com 40 anos de experiência.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {/* Primary Button - Ver Nossos Produtos - Mobile */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Button 
                  variant="ghost"
                  className="flex items-center justify-center gap-3 w-full h-10 bg-gradient-to-r from-fire-gold/20 via-fire-orange/30 to-fire-gold/20 border-2 border-fire-gold/50 text-white hover:from-fire-gold/30 hover:via-fire-orange/40 hover:to-fire-gold/30 hover:border-fire-orange/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-fire-gold/20"
                  onClick={handleVideoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fire-gold to-fire-orange flex items-center justify-center shadow-lg group-hover:shadow-fire-orange/50 transition-all group-hover:scale-110">
                    <Play className="w-3 h-3 text-black fill-current ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Ver Nossos Produtos</span>
                    <span className="text-xs text-fire-gold/80">Kits personalizados</span>
                  </div>
                </Button>
              </div>

              {/* Secondary Buttons - Mobile */}
              <div 
                className={`flex flex-col gap-3 transition-all duration-500 ${
                  showSecondaryButtons 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-2'
                }`}
              >
                {/* WhatsApp Button - Mobile */}
                <Button
                  variant="ghost"
                  className="w-full h-10 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 hover:via-green-400/40 hover:to-green-500/30 hover:border-green-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-green-500/20"
                  onClick={handleWhatsAppClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <WhatsApp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">WhatsApp Direto</span>
                  <div className="flex items-center gap-1 ml-auto bg-green-400/20 px-1.5 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-200">Online</span>
                  </div>
                </Button>

                {/* Orçamento Button - Mobile */}
                <Button
                  variant="outline-fire"
                  className="w-full h-10 font-medium text-sm"
                  onClick={handleOrçamentoClick}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Orçamento Gratuito</span>
                  <div className="flex items-center gap-1 ml-auto bg-fire-orange/20 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-fire-orange font-bold">Grátis</span>
                  </div>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;