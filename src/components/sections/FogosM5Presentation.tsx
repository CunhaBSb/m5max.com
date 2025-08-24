import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Shield, Award, Zap, Eye, CheckCircle2 } from "lucide-react";

const FogosM5Presentation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Placeholder video URL - will be replaced with actual company video
  const videoUrl = ""; // Future integration: "https://your-video-url.com/fogos-m5-presentation.mp4"

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const credentials = [
    {
      icon: Shield,
      title: "Segurança Certificada",
      description: "Licenças em dia e protocolos rigorosos",
      color: "text-green-400",
      bg: "from-green-500/20 to-emerald-600/20",
      border: "border-green-400/30"
    },
    {
      icon: Eye,
      title: "Simulação 3D",
      description: "Pré-visualização completa antes da execução",
      color: "text-blue-400",
      bg: "from-blue-500/20 to-cyan-600/20",
      border: "border-blue-400/30"
    },
    {
      icon: Zap,
      title: "Inovação Constante",
      description: "Tecnologia de ponta em cada espetáculo",
      color: "text-fire-gold",
      bg: "from-fire-gold/20 to-yellow-600/20",
      border: "border-fire-gold/30"
    },
    {
      icon: Award,
      title: "Excelência Comprovada",
      description: "40 anos transformando eventos em memórias",
      color: "text-fire-orange",
      bg: "from-fire-orange/20 to-fire-red/20",
      border: "border-fire-orange/30"
    }
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-background/98 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/fogosm5.svg" 
              alt="FogosM5" 
              className="h-16 md:h-20 lg:h-24 w-auto"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
            Excelência em Espetáculos Pirotécnicos
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Quatro décadas de experiência transformando eventos em momentos inesquecíveis. 
            Comprometidos com a segurança, inovação e qualidade em cada projeto.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Video Player Section */}
          <div className="mb-20">
            <Card className="relative overflow-hidden bg-card border border-border/50 shadow-xl mx-auto max-w-4xl">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      onLoadedData={() => setVideoLoaded(true)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    /* Professional Video Placeholder */
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-center p-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground mb-3">Vídeo Institucional</h3>
                        <p className="text-muted-foreground max-w-md">
                          Conheça nossa trajetória, metodologia e os diferenciais que nos tornaram referência em espetáculos pirotécnicos
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Play/Pause Overlay */}
                  {videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center group">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-16 h-16 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Credentials Section */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Diferenciais Competitivos
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Padrões de excelência que garantem segurança, inovação e resultados extraordinários
            </p>
          </div>

          {/* Enhanced Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {credentials.map((credential, index) => {
              const Icon = credential.icon;
              return (
                <Card 
                  key={index}
                  className="relative group hover:shadow-lg transition-all duration-500 border border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${credential.bg} border ${credential.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${credential.color}`} />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {credential.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {credential.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Professional CTA Section */}
          <div className="text-center">
            <Card className="inline-block bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-10">
                <div className="space-y-6">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-3">
                      Excelência Comprovada
                    </h4>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Quatro décadas de atuação no mercado, com projetos executados para os maiores eventos do país. 
                      Confiança construída através de resultados consistentes e inovação constante.
                    </p>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-10 py-3 text-base font-medium"
                  >
                    Solicitar Portfolio Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FogosM5Presentation;