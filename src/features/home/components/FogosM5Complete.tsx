import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { VideoPlayer } from "@/shared/components/ui/video-player";
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
  const videoSrc = "https://psvmzrzezgkklfjshhua.supabase.co/storage/v1/object/sign/M5Max/V2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81ZDUwMmRjNy00OTM1LTQ0OGMtOWExNC1lNjNjMjY1NjQwMzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNNU1heC9WMi5tcDQiLCJpYXQiOjE3NTYyMzg1MjQsImV4cCI6MjEzNDY3MDUyNH0.P9v2SUKcQUtFf9Fn4SdSg_Bfr3Snh4oJcsaAp5dFt40"; // Adicione a URL do vídeo aqui ou YouTube ID
  const thumbnailUrl = ""; // Adicione a URL do thumbnail aqui

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
      description: "INMETRO e Exército aprovado"
    },
    {
      icon: Users,
      value: "500+",
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
    <section className="relative py-12 lg:py-16 overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background to-background/95" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Section Header - Compact and Professional */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Conheça a <span className="text-fire-gradient">M5 Max Produções</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            40 anos transformando eventos em espetáculos memoráveis
          </p>
        </div>

        {/* Video Section - Artistic Focus */}
        <div className="relative mb-10 max-w-2xl mx-auto">
          {/* Decorative Background Elements */}
          <div className="absolute -inset-6 opacity-40">
            {/* Main gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 via-yellow-400/30 to-fire-orange/20 blur-3xl rounded-3xl"></div>
            
            {/* Secondary gradient layers */}
            <div className="absolute top-4 left-4 right-4 bottom-4 bg-gradient-to-br from-fire-orange/10 via-transparent to-yellow-400/10 blur-2xl rounded-2xl"></div>
            
            {/* Accent corners */}
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-fire-orange/30 blur-xl rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-yellow-400/30 blur-xl rounded-full"></div>
            
            {/* Sparkle effects */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-fire-orange/60 blur-sm rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-yellow-400/80 blur-sm rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-fire-orange/40 blur-sm rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Video Container with enhanced styling */}
          <div className="relative z-10">
            <Card className="overflow-hidden bg-black/10 backdrop-blur-xl border border-fire-orange/20 shadow-2xl shadow-fire-orange/10">
              {/* Inner glow border */}
              <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/20 via-transparent to-yellow-400/20 p-[1px] rounded-lg">
                <div className="w-full h-full bg-black/50 backdrop-blur-sm rounded-lg"></div>
              </div>
              
              <div className="relative z-10">
                {videoSrc ? (
                  <VideoPlayer 
                    src={videoSrc}
                    title="Conheça Nossa História - M5 Max Produções"
                    thumbnail={thumbnailUrl}
                    className="aspect-video"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-black/60 via-fire-orange/10 to-black/60 flex items-center justify-center relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.3),transparent_50%)]"></div>
                      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
                    </div>
                    
                    <div className="text-center space-y-4 p-8 relative z-10">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fire-orange/30 to-yellow-400/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-fire-orange/20">
                        <Award className="w-8 h-8 text-fire-orange" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Conheça Nossa História</h3>
                      <p className="text-white/80">
                        40 anos transformando eventos em espetáculos memoráveis com segurança e tecnologia
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Cards - Compact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="group bg-card/20 backdrop-blur-sm border-border/30 hover:border-fire-orange/30 transition-all duration-300 hover:shadow-md hover:bg-card/30"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-fire-orange/10 flex items-center justify-center group-hover:bg-fire-orange/20 transition-colors">
                      <Icon className="w-5 h-5 text-fire-orange" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-xs sm:text-sm font-medium text-foreground">
                      {stat.label}
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {stat.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section - Compact and Focused */}
        <Card className="bg-gradient-to-r from-fire-orange/5 via-fire-orange/10 to-fire-orange/5 border-fire-orange/20">
          <CardContent className="p-6 lg:p-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold">
                Pronto para Criar um Evento Inesquecível?
              </h3>
              <p className="text-base text-muted-foreground">
                Simulação 3D gratuita do seu show pirotécnico
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button 
                  size="default"
                  className="bg-fire-orange hover:bg-fire-orange/90 text-white px-6"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Simulação Grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  size="default"
                  variant="outline"
                  className="border-fire-orange/30 text-fire-orange hover:bg-fire-orange/10 px-6"
                >
                  Ver Portfólio
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Resposta 24h</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>100% gratuito</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FogosM5Complete;