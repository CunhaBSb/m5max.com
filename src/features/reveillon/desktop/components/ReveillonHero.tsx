import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { VideoPlayer } from "@/shared/ui/video-player";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import { MessageSquare, Calendar, Play, Shield, Award } from "lucide-react";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";

const ReveillonHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick, trackVideoEvent } = useAnalytics();

  // Company presentation video - same as homepage
  const presentationVideoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/sign/M5Max/V2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZDUwMmRjNy00OTM1LTQ0OGMtOWExNC1lNjNjMjY1NjQwMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNNU1heC9WMi5tcDQiLCJpYXQiOjE3NTYyMzg1MjQsImV4cCI6MjEzNDY3MDUyNH0.P9v2SUKcQUtFf9Fn4SdSg_Bfr3Snh4oJcsaAp5dFt40";

  const handleOrçamentoClick = useCallback(() => {
    openConversionModal({
      source: 'hero',
      audience: 'b2b',
      page: 'reveillon',
    });
  }, [openConversionModal]);

  const handleWhatsAppClick = useCallback(() => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2b', source: 'hero' }
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
    setIsVideoModalOpen(true);
    trackVideoEvent('click_to_play', {
      video_title: 'Conheça a M5 Max - Segurança e Qualidade',
      video_provider: 'custom',
      source: 'reveillon_hero',
      audience: 'b2b'
    });
  }, [trackVideoEvent]);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoLoaded(false);
  }, []);

  // Desktop video source - fixed for desktop version
  const videoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/Herowallpaper.webm";

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

        {/* Static fallback image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
            opacity: videoLoaded ? 0 : 1 
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
      </div>

      <div className="relative z-30 container mx-auto px-8">
        <div className="flex items-center justify-start min-h-[80vh]">
          {/* Desktop Layout */}
          <div className="space-y-6 text-left max-w-2xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-fire-orange/20 px-3 py-1 rounded-full backdrop-blur-sm border border-fire-orange/40">
                <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
                Últimos disponíveis
              </div>
              
              <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">A virada que entra para a história...</span>
                <br />
                <span className="bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">Começa no céu.</span>
              </h1>
              
              <p className="text-lg text-white/90 drop-shadow-md max-w-lg">
                Transforme o Réveillon do seu público em um espetáculo inesquecível com a M5 Max
              </p>
            </div>

            <div className="flex flex-col gap-4 max-w-md">
              {/* Primary Button - Ver Nossa Expertise */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="flex items-center justify-center gap-4 w-full h-16 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 border-2 border-fire-gold/50 text-white hover:from-fire-gold/30 hover:via-fire-orange/40 hover:to-fire-gold/30 hover:border-fire-orange/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-fire-gold/20 hover:shadow-fire-orange/30"
                      onClick={handleVideoClick}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fire-gold to-fire-orange flex items-center justify-center shadow-lg group-hover:shadow-fire-orange/50 transition-all group-hover:scale-110">
                        <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold">Ver Nossa Expertise</span>
                        <span className="text-xs text-fire-gold/80">40 anos de experiência</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-2 border-fire-gold/30 shadow-2xl shadow-fire-gold/20 rounded-xl">
                  {/* Header Section */}
                  <div className="relative px-4 py-3 bg-gradient-to-r from-fire-orange/10 via-fire-gold/15 to-fire-orange/10 border-b border-fire-gold/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/5 to-transparent" />
                    <div className="relative text-center space-y-1.5">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fire-gold to-fire-orange flex items-center justify-center shadow-md">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Por Que Confiar na M5 Max?
                        </h3>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fire-gold to-fire-orange flex items-center justify-center shadow-md">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-tight">
                        <span className="text-fire-gold font-medium">4 décadas de experiência</span> • <span className="text-fire-orange font-medium">100% seguros</span>
                      </p>
                    </div>
                  </div>

                  {/* Video Section */}
                  <div className="relative p-4">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-700/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/10 via-transparent to-fire-orange/10 pointer-events-none z-10" />
                      <VideoPlayer 
                        src={presentationVideoSrc}
                        title="Conheça a M5 Max - Segurança e Qualidade"
                        className="aspect-video w-full"
                        trackingEvents={true}
                        thumbnail="/assets/thumbapresentação.webp"
                      />
                    </div>
                    
                    {/* Professional Statistics Cards */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="bg-gradient-to-br from-fire-gold/15 to-fire-orange/10 border border-fire-gold/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-fire-gold">40+</div>
                        <div className="text-xs text-fire-gold/70">Anos</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-fire-orange/15 to-fire-gold/10 border border-fire-orange/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-fire-orange">2K+</div>
                        <div className="text-xs text-fire-orange/70">Eventos</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-fire-gold/15 to-fire-orange/10 border border-fire-gold/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-fire-gold">100%</div>
                        <div className="text-xs text-fire-gold/70">Seguro</div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-fire-orange">
                        <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
                        <span className="text-xs font-medium">Ao Vivo</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-fire-gold">
                        <Shield className="w-3 h-3" />
                        <span className="text-xs font-medium">Certificado</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-fire-gold">
                        <Award className="w-3 h-3" />
                        <span className="text-xs font-medium">Premiado</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 pb-4">
                    <div className="text-center bg-gradient-to-r from-fire-orange/10 via-fire-gold/15 to-fire-orange/10 rounded-lg p-3 border border-fire-gold/20">
                      <p className="text-sm text-gray-300 mb-1">
                        Pronto para transformar seu evento?
                      </p>
                      <p className="text-xs text-fire-gold font-medium">
                        Receba uma proposta personalizada
                      </p>
                    </div>
                  </div>
                </DialogContent>
                </Dialog>
              </div>

              {/* Secondary Buttons - Side by side with animation delay */}
              <div 
                className={`flex gap-3 transition-all duration-500 ${
                  showSecondaryButtons 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-2'
                }`}
              >
                {/* WhatsApp Button */}
                <Button
                  variant="ghost"
                  className="flex-1 h-12 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 border border-fire-gold/50 text-white hover:from-fire-gold/30 hover:via-fire-orange/40 hover:to-fire-gold/30 hover:border-fire-orange/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-fire-gold/20"
                  onClick={handleWhatsAppClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </Button>

                {/* Orçamento Button */}
                <Button
                  variant="ghost"
                  className="flex-1 h-12 bg-gradient-to-r from-fire-gold/20 via-fire-orange/30 to-fire-gold/20 border border-fire-orange/50 text-white hover:from-fire-orange/30 hover:via-fire-gold/40 hover:to-fire-orange/30 hover:border-fire-gold/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-fire-orange/20"
                  onClick={handleOrçamentoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Orçamento</span>
                </Button>
              </div>
            </div>

            {/* Professional Badges */}
            <div className="flex items-center justify-start gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-fire-orange/40 text-xs">
                <Shield className="w-3 h-3 text-fire-orange" />
                <span className="text-white font-medium">Segurança</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-fire-gold/40 text-xs">
                <Award className="w-3 h-3 text-fire-gold" />
                <span className="text-white font-medium">Reconhecimento</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-fire-gold/40 text-xs">
                <span className="text-fire-gold font-bold">40</span>
                <span className="text-white font-medium">Anos</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-fire-orange/40 text-xs">
                <span className="text-fire-orange font-bold">2K+</span>
                <span className="text-white font-medium">Eventos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReveillonHero;