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
      description: "INMETRO e Exército aprovado"
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
    <section className="relative py-12 lg:py-16 overflow-hidden bg-gradient-to-b from-background to-black">
      {/* Simplified Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-black/95" />
      
      {/* Optimized Lateral Design System */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Left subtle glow */}
        <div className="absolute left-0 top-1/4 w-64 h-96 bg-gradient-to-r from-fire-orange/12 to-transparent blur-3xl"></div>
        {/* Right subtle glow */}
        <div className="absolute right-0 top-1/4 w-64 h-96 bg-gradient-to-l from-fire-orange/12 to-transparent blur-3xl"></div>
        
        {/* Center spotlight effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full bg-gradient-radial from-white/[0.01] to-transparent"></div>
        
        {/* Minimal accent particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-fire-orange/40 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-fire-orange/40 rounded-full animate-pulse delay-1000"></div>
      </div>
      
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

        {/* Main Content Section - Organized Parallel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 items-center">
          {/* Left Stats Cards - 2 Cards */}
          <div className="lg:col-span-1 space-y-4">
            {stats.slice(0, 2).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative">
                  {/* Simplified decorative elements */}
                  <div className="absolute -inset-1 opacity-15">
                    <div className="absolute inset-0 bg-fire-orange/8 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-black/10 backdrop-blur-sm border border-fire-orange/15 shadow-lg shadow-fire-orange/10 hover:shadow-fire-orange/20 transition-all duration-300 hover:bg-black/15">
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

          {/* Center Video Section */}
          <div className="lg:col-span-3 relative">
            {/* Optimized decorative elements */}
            <div className="absolute -inset-4 opacity-30">
              <div className="absolute inset-0 bg-fire-orange/15 blur-3xl rounded-2xl"></div>
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-fire-orange/60 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-fire-orange/60 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <Card className="overflow-hidden bg-black/15 backdrop-blur-sm border border-fire-orange/20 shadow-2xl shadow-fire-orange/15">
                <div className="relative z-10">
                  {videoSrc ? (
                    <VideoPlayer 
                      src={videoSrc}
                      title="Conheça Nossa História - M5 Max Produções"
                      thumbnail={thumbnailUrl}
                      className="aspect-video"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-black/80 via-fire-orange/10 to-black/80 flex items-center justify-center">
                      <div className="text-center space-y-4 p-8">
                        <div className="w-16 h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
                          <Award className="w-8 h-8 text-fire-orange" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Conheça Nossa História</h3>
                        <p className="text-white/80">
                          40 anos transformando eventos em espetáculos memoráveis
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Right Stats Cards - 2 Cards */}
          <div className="lg:col-span-1 space-y-4">
            {stats.slice(2, 4).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index + 2} className="relative">
                  {/* Simplified decorative elements */}
                  <div className="absolute -inset-1 opacity-15">
                    <div className="absolute inset-0 bg-fire-orange/8 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-black/10 backdrop-blur-sm border border-fire-orange/15 shadow-lg shadow-fire-orange/10 hover:shadow-fire-orange/20 transition-all duration-300 hover:bg-black/15">
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

      </div>
      
      {/* Optimized Full-Width CTA Banner */}
      <div className="relative w-full mt-8">
        {/* Simplified background with smooth transition */}
        <div className="absolute inset-0 -mx-4 lg:-mx-8">
          <div className="w-full h-full bg-gradient-to-r from-slate-950/95 via-black/90 to-slate-950/95"></div>
          
          {/* Minimal decorative elements */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-fire-orange/10 to-transparent blur-2xl"></div>
            <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-fire-orange/10 to-transparent blur-2xl"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/15 to-transparent transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* CTA Content Container */}
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="relative py-8">
            <Card className="overflow-hidden bg-black/20 backdrop-blur-sm border border-fire-orange/20 shadow-xl shadow-fire-orange/10">
              <CardContent className="relative z-10 px-8 py-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Left Content */}
                  <div className="text-center lg:text-left space-y-2 lg:flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold text-white">
                      Pronto para Criar um Evento Inesquecível?
                    </h3>
                    <p className="text-sm lg:text-base text-white/80">
                      Simulação 3D gratuita do seu show pirotécnico • Orçamento em 24h
                    </p>
                  </div>
                  
                  {/* Center Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <Button 
                      size="default"
                      className="bg-fire-orange hover:bg-fire-orange/90 text-white px-6 py-3 shadow-lg shadow-fire-orange/20 transition-all duration-300 hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Simulação Grátis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <Button 
                      size="default"
                      variant="outline"
                      className="border-fire-orange/30 bg-white/10 text-white hover:bg-fire-orange/15 hover:border-fire-orange/50 px-6 py-3 transition-all duration-300"
                    >
                      Ver Portfólio
                    </Button>
                  </div>

                  {/* Right Trust Indicators */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 text-sm text-white/70 lg:flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>24h de resposta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>100% Grátis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span>Sem compromisso</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FogosM5Complete;