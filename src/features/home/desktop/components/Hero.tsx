import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import { VideoPlayer } from "@/shared/ui/video-player";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import { MessageSquare, Calendar, Play, Shield, Award } from "lucide-react";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";
import { heroContent } from "../data/homeContent";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showSecondaryButtons, setShowSecondaryButtons] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick, trackVideoEvent } = useAnalytics();

  // Company presentation video - same as Réveillon
  const presentationVideoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/sign/M5Max/V2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZDUwMmRjNy00OTM1LTQ0OGMtOWExNC1lNjNjMjY1NjQwMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNNU1heC9WMi5tcDQiLCJpYXQiOjE3NTYyMzg1MjQsImV4cCI6MjEzNDY3MDUyNH0.P9v2SUKcQUtFf9Fn4SdSg_Bfr3Snh4oJcsaAp5dFt40";

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

  const handleVideoClick = useCallback(() => {
    setIsVideoModalOpen(true);
    trackVideoEvent('click_to_play', {
      video_title: 'Conheça a M5 Max - Segurança e Qualidade',
      video_provider: 'custom',
      source: 'home_hero',
      audience: 'general'
    });
  }, [trackVideoEvent]);

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

      {/* Professional Bottom Vignette - Transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 z-25 pointer-events-none">
        {/* Main gradient using original background colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent"></div>
        
        {/* Professional fade pattern */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/95 to-transparent"></div>
        
        {/* Side accent gradients */}
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>

      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start min-h-[85vh] lg:min-h-[80vh]">
          {/* Responsive Layout */}
          <div className="space-y-4 sm:space-y-6 text-left max-w-2xl w-full">
            <div className="space-y-3 sm:space-y-4">
              {/* Status Badge - Mobile Optimized */}
              <div className="flex items-center justify-between xs:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 text-white font-medium text-xs xs:text-sm bg-red-500/20 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-full backdrop-blur-sm border border-red-400/40">
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-red-400 rounded-full animate-pulse" />
                  Shows Pirotécnicos
                </div>
                
                {/* Mobile Quick Stats */}
                <div className="flex items-center gap-1.5 xs:hidden bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-fire-orange/30">
                  <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse" />
                  <span className="text-xs text-white font-medium">40 Anos</span>
                </div>
              </div>
              
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold leading-tight drop-shadow-lg">
                <span className="text-white">Um espetáculo não se improvisa...</span>
                <br />
                <span className="text-fire-gradient">Ele se planeja.</span>
              </h1>
              
              <p className="text-sm xs:text-base lg:text-lg text-white/90 drop-shadow-md max-w-lg leading-relaxed">
              Na M5 Max, cada show de fogos é desenhado com segurança, tecnologia e emoção para transformar o seu evento em um momento inesquecível.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              {/* Primary Button - Ver Nossa Expertise - Mobile Optimized */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="flex items-center justify-center gap-3 xs:gap-4 w-full h-12 xs:h-14 sm:h-16 bg-gradient-to-r from-yellow-500/20 via-yellow-400/30 to-yellow-500/20 border-2 border-yellow-400/50 text-white hover:from-yellow-400/30 hover:via-yellow-300/40 hover:to-yellow-400/30 hover:border-yellow-300/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-yellow-400/20 hover:shadow-yellow-300/30"
                      onClick={handleVideoClick}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/50 transition-all group-hover:scale-110">
                        <Play className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-black fill-current ml-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm xs:text-base font-bold">Ver Nossa Expertise</span>
                        <span className="text-xs text-yellow-200/80">40 anos de experiência</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 rounded-xl">
                  {/* Header Section */}
                  <div className="relative px-4 py-3 bg-gradient-to-r from-yellow-500/10 via-yellow-400/15 to-yellow-500/10 border-b border-yellow-400/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/5 to-transparent" />
                    <div className="relative text-center space-y-1.5">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Por Que Confiar na M5 Max?
                        </h3>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
                          <Award className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-tight">
                        <span className="text-yellow-400 font-medium">4 décadas de experiência</span> • <span className="text-green-400 font-medium">100% seguros</span>
                      </p>
                    </div>
                  </div>

                  {/* Video Section */}
                  <div className="relative p-4">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-700/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-green-400/10 pointer-events-none z-10" />
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
                      <div className="bg-gradient-to-br from-yellow-500/15 to-yellow-600/10 border border-yellow-400/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-yellow-400">40+</div>
                        <div className="text-xs text-yellow-200/70">Anos</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500/15 to-green-600/10 border border-green-400/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-green-400">2K+</div>
                        <div className="text-xs text-green-200/70">Eventos</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-400/30 rounded-lg px-2.5 py-1.5 text-center backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-bold text-blue-400">100%</div>
                        <div className="text-xs text-blue-200/70">Seguro</div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">Ao Vivo</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-yellow-400">
                        <Shield className="w-3 h-3" />
                        <span className="text-xs font-medium">Certificado</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Award className="w-3 h-3" />
                        <span className="text-xs font-medium">Premiado</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 pb-4">
                    <div className="text-center bg-gradient-to-r from-yellow-500/10 via-yellow-400/15 to-yellow-500/10 rounded-lg p-3 border border-yellow-400/20">
                      <p className="text-sm text-gray-300 mb-1">
                        Pronto para transformar seu evento?
                      </p>
                      <p className="text-xs text-yellow-400 font-medium">
                        Receba uma proposta personalizada
                      </p>
                    </div>
                  </div>
                </DialogContent>
                </Dialog>
              </div>

              {/* Secondary Buttons - Mobile Responsive with Compact Design */}
              <div 
                className={`flex flex-col xs:flex-row gap-2 xs:gap-3 transition-all duration-500 ${
                  showSecondaryButtons 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-2'
                }`}
              >
                {/* WhatsApp Button - Mobile First */}
                <Button
                  variant="ghost"
                  className="flex-1 h-10 xs:h-12 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 hover:via-green-400/40 hover:to-green-500/30 hover:border-green-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-green-500/20"
                  onClick={handleWhatsAppClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <MessageSquare className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2" />
                  <span className="text-xs xs:text-sm font-medium">WhatsApp</span>
                  <div className="hidden xs:flex items-center gap-1 ml-2 bg-green-400/20 px-1.5 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-200">Online</span>
                  </div>
                </Button>

                {/* Orçamento Button - Mobile Enhanced */}
                <Button
                  variant="ghost"
                  className="flex-1 h-10 xs:h-12 bg-gradient-to-r from-blue-600/20 via-blue-500/30 to-blue-600/20 border border-blue-500/50 text-white hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30 hover:border-blue-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-blue-500/20"
                  onClick={handleOrçamentoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <Calendar className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2" />
                  <span className="text-xs xs:text-sm font-medium">Orçamento</span>
                  <div className="hidden xs:flex items-center gap-1 ml-2 bg-blue-400/20 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-blue-200 font-bold">Grátis</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Professional Badges - Mobile Optimized */}
            <div className="grid grid-cols-2 xs:flex xs:items-center xs:justify-start gap-1.5 xs:gap-2 xs:flex-wrap">
              <div className="flex items-center gap-1 xs:gap-1.5 bg-white/10 backdrop-blur-sm px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full border border-green-400/40">
                <Shield className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-green-400" />
                <span className="text-white font-medium text-xs">Segurança</span>
              </div>
              
              <div className="flex items-center gap-1 xs:gap-1.5 bg-white/10 backdrop-blur-sm px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full border border-yellow-400/40">
                <Award className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-yellow-400" />
                <span className="text-white font-medium text-xs">Certificado</span>
              </div>
              
              <div className="flex items-center gap-1 xs:gap-1.5 bg-white/10 backdrop-blur-sm px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full border border-blue-400/40">
                <span className="text-blue-400 font-bold text-xs">40</span>
                <span className="text-white font-medium text-xs">Anos</span>
              </div>
              
              <div className="flex items-center gap-1 xs:gap-1.5 bg-white/10 backdrop-blur-sm px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full border border-purple-400/40">
                <span className="text-purple-400 font-bold text-xs">2K+</span>
                <span className="text-white font-medium text-xs">Eventos</span>
              </div>
              
              {/* Additional Mobile Badges */}
              <div className="flex items-center gap-1 xs:gap-1.5 bg-white/10 backdrop-blur-sm px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-full border border-fire-orange/40 xs:hidden col-span-2">
                <div className="w-2.5 h-2.5 bg-fire-orange rounded-full animate-pulse" />
                <span className="text-white font-medium text-xs">Licenciado pelo Exército</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;