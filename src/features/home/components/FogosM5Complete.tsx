import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { 
  Play, 
  Pause, 
  Shield, 
  MessageCircle,
  Calendar,
  Star,
  Award,
  CheckCircle2
} from "lucide-react";
import CardsM5 from "./CardsM5";

const FogosM5Complete = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = "";

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Harmonious Background System */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background to-background/98" />
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-fire-orange/3 via-fire-gold/2 to-transparent rounded-full blur-3xl subtle-pulse opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-fire-orange/2 to-transparent rounded-full blur-3xl opacity-15" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-fire-gold/2 to-transparent rounded-full blur-3xl opacity-10" />
      </div>
      
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='8' cy='8' r='0.5'/%3E%3Ccircle cx='40' cy='40' r='0.5'/%3E%3Ccircle cx='72' cy='72' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(249,115,22,0.02),transparent_50%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Compact Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/fogosm5.svg" 
              alt="FogosM5" 
              className="h-16 w-auto filter drop-shadow-md" 
            />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-fire-orange via-fire-gold to-fire-red bg-clip-text text-transparent">
              FogosM5
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Transformando momentos em espetáculos inesquecíveis há mais de 40 anos
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span>Certificado INMETRO</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full text-sm">
              <Award className="w-3.5 h-3.5 text-fire-orange" />
              <span>40 Anos</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full text-sm">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>100% Seguro</span>
            </div>
          </div>
        </div>

        {/* Compact Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { icon: Calendar, value: "40+", label: "Anos" },
            { icon: Star, value: "500+", label: "Eventos" },
            { icon: Shield, value: "100%", label: "Segurança" },
            { icon: Award, value: "Nº1", label: "Nacional" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Professional Video Showcase */}
        <div className="mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-xl">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center p-8">
                      <div className="relative">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-fire-orange to-fire-red rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-8 h-8 text-white ml-0.5" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-fire-orange/20 rounded-full animate-ping" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Vídeo Institucional
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        40 anos de expertise em espetáculos pirotécnicos únicos
                      </p>
                    </div>
                  </div>
                )}
                
                {videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-all duration-300">
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black shadow-xl transition-all duration-300 hover:scale-110"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <CardsM5 />

        {/* Compact Professional CTA */}
        <div className="mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 border-0 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_60%)]" />
            <CardContent className="relative p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  Peça sua simulação 3D gratuita
                </h3>
                <p className="text-green-100 mb-6 max-w-lg mx-auto">
                  Visualize seu evento antes de acontecer. Zero compromisso, máxima qualidade.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-green-100 mb-6">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                    <span>Gratuita</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                    <span>Sem compromisso</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
                    <span>40 anos experiência</span>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="bg-white hover:bg-green-50 text-green-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chamar no WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FogosM5Complete;
