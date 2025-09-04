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
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-background via-metal-platinum to-background">
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
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold">
              Conheça a <span className="text-fire-gradient">M5 Max</span>
            </h2>
            <div className="w-8 h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            40 anos transformando eventos em espetáculos memoráveis
          </p>
          
          {/* Mobile Quick Stats Bar */}
          <div className="flex items-center justify-center gap-4 mt-3">
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
        <div className="grid grid-cols-1 gap-6 mb-12 items-center">
          {/* Center Video Section - Mobile Optimized */}
          <div className="relative order-first">
            {/* Mobile decorative elements - smaller and optimized */}
            <div className="absolute -inset-2 opacity-20">
              <div className="absolute inset-0 bg-fire-orange/10 blur-2xl rounded-xl"></div>
              <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-fire-orange/50 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-fire-orange/50 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <Card className="overflow-hidden bg-black/10 backdrop-blur-sm border border-fire-orange/15 shadow-xl shadow-fire-orange/10">
                {/* Mobile Video Header */}
                <div className="bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-3 border-b border-fire-orange/10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-fire-gradient flex items-center justify-center">
                      <Award className="w-2.5 h-2.5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-fire-orange">A M5 Max</h3>
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
                      title="Conheça a História da M5 Max Produções"
                      thumbnail={thumbnailUrl}
                      className="aspect-video"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-black/80 via-fire-orange/10 to-black/80 flex items-center justify-center">
                      <div className="text-center space-y-3 p-4">
                        <div className="w-12 h-12 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-fire-orange" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Conheça a M5 Max</h3>
                        <p className="text-sm text-white/80">
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
          <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Mobile CTA Section - Professional and Compact */}
        <div className="text-center space-y-3">
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