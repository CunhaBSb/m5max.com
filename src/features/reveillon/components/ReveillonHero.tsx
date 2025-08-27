import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { VideoPlayer } from "@/shared/components/ui/video-player";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/ui/dialog";
import { Sparkles, Phone, MessageSquare, Calendar, Play, Shield, Award } from "lucide-react";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";

const ReveillonHero = () => {
  const isDesktop = useIsDesktop();
  const isMobile = isDesktop === false;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick, trackVideoEvent } = useAnalytics();

  // Company presentation video - same as homepage
  const presentationVideoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/sign/M5Max/V2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZDUwMmRjNy00OTM1LTQ0OGMtOWExNC1lNjNjMjY1NjQwMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNNU1heC9WMi5tcDQiLCJpYXQiOjE3NTYyMzg1MjQsImV4cCI6MjEzNDY3MDUyNH0.P9v2SUKcQUtFf9Fn4SdSg_Bfr3Snh4oJcsaAp5dFt40";

  // Reset video state when device changes
  useEffect(() => {
    setVideoLoaded(false);
  }, [isMobile]);

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

  // Same video sources as home hero
  const videoSrc = isMobile 
    ? "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/P2.Mobile.webm"
    : "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/public/papel%20de%20parede/Herowallpaper.webm";

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

        {/* Fallback Background - Same as home hero */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-2000 ease-out"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        />
        
        {/* Animated Loading Pattern - Same as home hero */}
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
              <div className="flex items-center gap-2 text-white font-semibold justify-center text-xs sm:text-sm drop-shadow-lg bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 px-4 py-2 rounded-full backdrop-blur-sm border border-yellow-400/40">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                RÉVEILLON 2025 - SHOWS ESPETACULARES
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Réveillon</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Inesquecível</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-white/90 max-w-sm mx-auto leading-relaxed font-medium drop-shadow-lg">
                Shows pirotécnicos profissionais com 40 anos de experiência. Segurança certificada e qualidade garantida para seu evento corporativo.
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
                <Calendar className="w-4 h-4" />
                Contratar Show
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

              {/* Video Presentation Button */}
              <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="default"
                    className="flex items-center gap-2 w-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/50 text-white hover:from-yellow-400/30 hover:to-yellow-600/30 hover:border-yellow-400/70 backdrop-blur-sm shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 group"
                    onClick={handleVideoClick}
                  >
                    <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-2.5 h-2.5 text-black fill-current ml-0.5" />
                    </div>
                    Veja Por Que Somos #1
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[95vw] p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        Por Que Confiar na M5 Max?
                        <Award className="w-5 h-5 text-yellow-500" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Descubra como 4 décadas de experiência garantem shows espetaculares e 100% seguros.
                      </p>
                    </div>
                    <VideoPlayer 
                      src={presentationVideoSrc}
                      title="Conheça a M5 Max - Segurança e Qualidade"
                      className="aspect-video"
                      trackingEvents={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Réveillon Highlights */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-b from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-yellow-400 mb-1">Duração</div>
                  <div className="text-xs text-white/90">10-20 min</div>
                </div>
                <div className="bg-gradient-to-b from-purple-500/20 to-purple-700/20 backdrop-blur-sm border border-purple-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-purple-400 mb-1">Público</div>
                  <div className="text-xs text-white/90">Até 10k+</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-b from-indigo-500/20 to-indigo-700/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-indigo-400 mb-1">Sincronização</div>
                  <div className="text-xs text-white/90">Musical</div>
                </div>
                <div className="bg-gradient-to-b from-emerald-500/20 to-emerald-700/20 backdrop-blur-sm border border-emerald-400/30 rounded-lg p-2 text-center transition-all duration-300">
                  <div className="text-xs font-bold text-emerald-400 mb-1">Segurança</div>
                  <div className="text-xs text-white/90">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-6 text-left max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold justify-start text-sm drop-shadow-lg bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 px-4 py-2 rounded-full backdrop-blur-sm w-fit border border-yellow-400/40">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                RÉVEILLON 2025 - SHOWS ESPETACULARES
              </div>
              
              <h1 className="text-3xl xl:text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Réveillon</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Inesquecível</span>
              </h1>
              
              <p className="text-base text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg">
                Shows pirotécnicos profissionais com 40 anos de experiência e certificações de segurança. Desperte 2025 com um espetáculo único e totalmente licenciado que seus convidados jamais esquecerão.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="hero" 
                size="sm"
                className="flex items-center gap-2"
                onClick={handleOrçamentoClick}
              >
                <Calendar className="w-4 h-4" />
                Contratar Show
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

              {/* Video Presentation Button - Desktop */}
              <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/50 text-white hover:from-yellow-400/30 hover:to-yellow-600/30 hover:border-yellow-400/70 backdrop-blur-sm shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 group"
                    onClick={handleVideoClick}
                  >
                    <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-2.5 h-2.5 text-black fill-current ml-0.5" />
                    </div>
                    Veja Por Que Somos #1
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[95vw] p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        Por Que Confiar na M5 Max?
                        <Award className="w-5 h-5 text-yellow-500" />
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Descubra como 4 décadas de experiência garantem shows espetaculares e 100% seguros.
                      </p>
                    </div>
                    <VideoPlayer 
                      src={presentationVideoSrc}
                      title="Conheça a M5 Max - Segurança e Qualidade"
                      className="aspect-video"
                      trackingEvents={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Professional Badges */}
            <div className="pt-4 flex items-center justify-start gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium text-white">Segurança</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-medium text-white">Reconhecimento</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                <span className="text-xs font-medium text-white">40 Anos</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                <span className="text-xs font-medium text-white">2000+ Eventos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReveillonHero;