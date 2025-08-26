import { Button } from "@/shared/components/ui/button";
import { Sparkles, Phone, MessageSquare, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/utils/whatsapp";
import { usePrefersReducedMotion } from "@/app/shared/hooks/useMedia";

const HeroDesktop = () => {
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick, trackVideoEvent } = useAnalytics();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'hero_desktop',
      audience: 'b2b',
      page: 'home'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'hero_desktop' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'hero_desktop',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStarted) {
        setHasStarted(true);
        trackVideoEvent('start', {
          video_title: 'Hero Fireworks Desktop',
          video_provider: 'custom',
          video_duration: video.duration || 0
        });
      }
    };

    const handlePause = () => setIsPlaying(false);
    
    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration * 0.5) {
        trackVideoEvent('progress_50', {
          video_title: 'Hero Fireworks Desktop',
          video_provider: 'custom',
          video_duration: video.duration
        });
      }
    };

    const handleEnded = () => {
      trackVideoEvent('complete', {
        video_title: 'Hero Fireworks Desktop',
        video_provider: 'custom',
        video_duration: video.duration
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasStarted, trackVideoEvent]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/desktop/hero_fallback.webp" 
          alt="Professional fireworks display"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fire-orange/20 border border-fire-orange/30 rounded-full text-fire-orange font-semibold text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              40 ANOS DE EXPERIÊNCIA NO MERCADO
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-white">Mais do que</span>
                <span className="block text-transparent bg-gradient-to-r from-fire-orange via-fire-gold to-fire-red bg-clip-text">
                  Pirotecnia
                </span>
                <span className="block text-white text-4xl xl:text-5xl 2xl:text-6xl mt-2">
                  Somos pura emoção!
                </span>
              </h1>
            </div>

            {/* Professional Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-fire-orange rounded-full" />
                <span className="text-base font-medium">Fogos de artifícios de baixo ruído</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-fire-gold rounded-full" />
                <span className="text-base font-medium">Show pirotécnico sincronizado</span>
              </div>
            </div>

            {/* Call to Action */}
            <p className="text-xl text-gray-200 font-light">
              Eternize momentos especiais conosco com a experiência de quem é referência em espetáculos pirotécnicos
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="hero" 
                size="lg"
                className="flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                onClick={handleOrçamentoClick}
              >
                <Phone className="w-5 h-5" />
                Solicitar Orçamento
              </Button>
              
              <Button 
                variant="whatsapp" 
                size="lg"
                className="flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp Direto
              </Button>
            </div>
          </div>

          {/* Logo and Trust Indicators */}
          <div className="flex flex-col items-center space-y-12">
            {/* Logo */}
            <div className="relative">
              <img
                src="/m5logo.svg"
                alt="M5 Max Produções"
                className="w-80 h-auto opacity-90"
              />
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  40+
                </div>
                <div className="text-sm font-medium text-gray-300">Anos de Experiência</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  500+
                </div>
                <div className="text-sm font-medium text-gray-300">Eventos Realizados</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text">
                  100%
                </div>
                <div className="text-sm font-medium text-gray-300">Segurança Certificada</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDesktop;