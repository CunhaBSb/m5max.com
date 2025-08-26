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
    <section className="relative py-20 lg:py-24 overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Section Header - Clean and Professional */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Conheça a <span className="text-fire-gradient">M5 Max Produções</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Há mais de 40 anos transformando eventos em espetáculos memoráveis
          </p>
        </div>

        {/* Video Section - Main Focus */}
        <div className="mb-16">
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            {videoSrc ? (
              <VideoPlayer 
                src={videoSrc}
                title="Conheça Nossa História - M5 Max Produções"
                thumbnail={thumbnailUrl}
                className="aspect-video"
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-card/80 to-card/40 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Conheça Nossa História</h3>
                  <p className="text-muted-foreground">
                    40 anos transformando eventos em espetáculos memoráveis com segurança e tecnologia
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Stats Cards - Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="group bg-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm font-medium text-foreground">
                      {stat.label}
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section - Clean and Focused */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold">
                Pronto para Criar um Evento Inesquecível?
              </h3>
              <p className="text-lg text-muted-foreground">
                Solicite uma simulação 3D gratuita e veja como será seu show pirotécnico antes mesmo de acontecer
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-lg px-8"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Solicitar Simulação Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                >
                  Ver Portfólio Completo
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Resposta em 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
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