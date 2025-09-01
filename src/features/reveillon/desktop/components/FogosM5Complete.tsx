import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { VideoPlayerSimple } from "@/shared/ui/video-player-simple";
import { 
  Shield, 
  Award,
  Users,
  Zap,
  MessageCircle,
  ArrowRight
} from "lucide-react";

const FogosM5Complete = () => {
  // URL do vídeo da empresa - substituir quando disponível
  const videoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/sign/M5Max/V2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZDUwMmRjNy00OTM1LTQ0OGMtOWExNC1lNjNjMjY1NjQwMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNNU1heC9WMi5tcDQiLCJpYXQiOjE3NTYyMzg1MjQsImV4cCI6MjEzNDY3MDUyNH0.P9v2SUKcQUtFf9Fn4SdSg_Bfr3Snh4oJcsaAp5dFt40";
  const thumbnailUrl = "/assets/thumbapresentação.webp";

  const stats = [
    {
      icon: Award,
      value: "40+",
      label: "Anos de Experiência",
      description: "Líder nacional em pirotecnia"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Segurança Certificada",
      description: "Licenciado pelo Exército Brasileiro"
    },
    {
      icon: Users,
      value: "2000+",
      label: "Eventos Realizados",
      description: "Em todo território nacional"
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Suporte Técnico",
      description: "Equipe sempre disponível"
    }
  ];

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-background via-metal-platinum to-background">
      {/* Smooth top transition from previous section */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none"></div>
      
      {/* Refined Background Layer - M5 Max brand colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-metal-platinum/95 to-background" />
      
      {/* Smooth bottom transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"></div>
      
      {/* Professional Ambient Design */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {/* Subtle lateral ambience */}
        <div className="absolute left-0 top-1/3 w-48 h-64 bg-gradient-to-r from-fire-orange/8 to-transparent blur-2xl"></div>
        <div className="absolute right-0 top-1/3 w-48 h-64 bg-gradient-to-l from-fire-orange/8 to-transparent blur-2xl"></div>
        
        {/* Center focus enhancement */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-radial from-white/[0.008] to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 xs:mb-3">
            <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Award className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
            </div>
            <h2 className="text-xl xs:text-2xl lg:text-3xl font-bold">
              Conheça a <span className="text-fire-gradient">M5 Max</span>
            </h2>
            <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Shield className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
            </div>
          </div>
          <p className="text-sm xs:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            40 anos transformando eventos em espetáculos memoráveis
          </p>
          
          {/* Mobile Quick Stats Bar */}
          <div className="flex items-center justify-center gap-3 xs:gap-4 mt-3 lg:hidden">
            <div className="bg-fire-orange/10 px-2 py-1 rounded-full border border-fire-orange/30">
              <span className="text-xs font-bold text-fire-orange">40 Anos</span>
            </div>
            <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
              <span className="text-xs font-bold text-green-500">100% Seguro</span>
            </div>
            <div className="bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30">
              <span className="text-xs font-bold text-blue-500">2K+ Eventos</span>
            </div>
          </div>
        </div>

        {/* Main Content Section - Mobile First Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12 items-center">
          {/* Left Stats Cards - Mobile Responsive */}
          <div className="lg:col-span-1 hidden lg:block space-y-4">
            {stats.slice(0, 2).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative">
                  {/* Refined decorative elements */}
                  <div className="absolute -inset-1 opacity-12">
                    <div className="absolute inset-0 bg-fire-orange/6 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-background/5 backdrop-blur-sm border border-fire-orange/12 shadow-lg shadow-fire-orange/8 hover:shadow-fire-orange/15 transition-all duration-300 hover:bg-background/10">
                    <CardContent className="relative z-10 p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-fire-orange/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-fire-orange/25 transition-all duration-300">
                          <Icon className="w-5 h-5 text-fire-orange" />
                        </div>
                        
                        <div className="text-xl font-bold text-white">
                          {stat.value}
                        </div>
                        
                        <div className="text-sm font-medium text-white/90 leading-tight">
                          {stat.label}
                        </div>
                        
                        <div className="text-xs text-white/70 leading-tight text-center">
                          {stat.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Center Video Section - Mobile Optimized */}
          <div className="lg:col-span-3 relative order-first lg:order-none">
            {/* Mobile decorative elements - smaller and optimized */}
            <div className="absolute -inset-2 lg:-inset-4 opacity-20 lg:opacity-30">
              <div className="absolute inset-0 bg-fire-orange/10 lg:bg-fire-orange/15 blur-2xl lg:blur-3xl rounded-xl lg:rounded-2xl"></div>
              <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-fire-orange/50 lg:bg-fire-orange/60 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-fire-orange/50 lg:bg-fire-orange/60 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <Card className="overflow-hidden bg-black/10 lg:bg-black/15 backdrop-blur-sm border border-fire-orange/15 lg:border-fire-orange/20 shadow-xl lg:shadow-2xl shadow-fire-orange/10 lg:shadow-fire-orange/15">
                {/* Mobile Video Header */}
                <div className="lg:hidden bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-3 border-b border-fire-orange/10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-fire-gradient flex items-center justify-center">
                      <Award className="w-2.5 h-2.5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-fire-orange">Nossa História</h3>
                    <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-500">Ao vivo</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  {videoSrc ? (
                    <VideoPlayerSimple 
                      src={videoSrc}
                      title="Conheça Nossa História - M5 Max Produções"
                      thumbnail={thumbnailUrl}
                      className="aspect-video"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-black/80 via-fire-orange/10 to-black/80 flex items-center justify-center">
                      <div className="text-center space-y-3 lg:space-y-4 p-4 lg:p-8">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 lg:w-8 lg:h-8 text-fire-orange" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold text-white">Conheça Nossa História</h3>
                        <p className="text-sm lg:text-base text-white/80">
                          40 anos transformando eventos em espetáculos memoráveis
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile Stats Grid - Appears after video */}
          <div className="lg:hidden grid grid-cols-2 gap-3 xs:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative">
                  <div className="absolute -inset-1 opacity-8">
                    <div className="absolute inset-0 bg-fire-orange/4 blur-md rounded-lg"></div>
                  </div>
                  
                  <Card className="relative z-10 bg-background/5 backdrop-blur-sm border border-fire-orange/10 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex flex-col items-center text-center space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-fire-orange/15 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-fire-orange" />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs font-medium text-white/90 leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Right Stats Cards - Desktop Only */}
          <div className="lg:col-span-1 hidden lg:block space-y-4">
            {stats.slice(2, 4).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index + 2} className="relative">
                  {/* Refined decorative elements */}
                  <div className="absolute -inset-1 opacity-12">
                    <div className="absolute inset-0 bg-fire-orange/6 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-background/5 backdrop-blur-sm border border-fire-orange/12 shadow-lg shadow-fire-orange/8 hover:shadow-fire-orange/15 transition-all duration-300 hover:bg-background/10">
                    <CardContent className="relative z-10 p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-fire-orange/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-fire-orange/25 transition-all duration-300">
                          <Icon className="w-5 h-5 text-fire-orange" />
                        </div>
                        
                        <div className="text-xl font-bold text-white">
                          {stat.value}
                        </div>
                        
                        <div className="text-sm font-medium text-white/90 leading-tight">
                          {stat.label}
                        </div>
                        
                        <div className="text-xs text-white/70 leading-tight text-center">
                          {stat.description}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile CTA Section - Professional and Compact */}
        <div className="lg:hidden text-center space-y-3">
          <div className="bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-4 rounded-xl border border-fire-orange/15">
            <h3 className="text-lg font-bold text-fire-gradient mb-2">
              Pronto para um espetáculo inesquecível?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Solicite um orçamento personalizado para o seu evento
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 h-10 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 backdrop-blur-sm"
                onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">WhatsApp</span>
              </Button>
              
              <Button
                variant="fire"
                className="flex-1 h-10 text-xs"
                onClick={() => {/* Add conversion modal logic */}}
              >
                <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                Orçamento Grátis
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FogosM5Complete;