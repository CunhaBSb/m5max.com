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

const FogosM5CompleteMobile = () => {
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
    <section className="relative py-8 px-4 overflow-hidden bg-gradient-to-b from-background via-metal-platinum to-background">
      {/* Mobile-optimized Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950/5 to-background"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/5 via-transparent to-fire-gold/5"></div>
      
      <div className="relative container mx-auto max-w-sm">
        {/* Header Section - Mobile optimized */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-fire-orange mb-4">
            <div className="w-8 h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold uppercase tracking-wide text-sm">A Empresa</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-foreground">40 Anos Criando</span>
            <br />
            <span className="text-fire-gradient">Momentos Únicos</span>
          </h2>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos especialistas em shows pirotécnicos profissionais, 
            oferecendo segurança, tecnologia e emoção para seu evento.
          </p>
        </div>

        {/* Video Section - Mobile sized */}
        <div className="mb-8">
          <VideoPlayerSimple
            src={videoSrc}
            thumbnail={thumbnailUrl}
            title="M5 Max - Experiência e Qualidade"
            className="w-full aspect-video rounded-lg overflow-hidden"
          />
        </div>

        {/* Stats Grid - 2x2 mobile layout */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/30 hover:border-fire-orange/30 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-fire-orange/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <IconComponent className="w-4 h-4 text-fire-orange" />
                  </div>
                  <div className="text-lg font-bold text-fire-gradient mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="text-center">
          <Button 
            size="default"
            className="bg-fire-gradient hover:opacity-90 text-white font-semibold w-full"
            onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar Conosco
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3">
            Consulte nosso portfólio completo e solicite seu orçamento
          </p>
        </div>
      </div>
    </section>
  );
};

export default FogosM5CompleteMobile;