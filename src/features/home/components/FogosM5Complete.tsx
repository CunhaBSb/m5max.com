import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Shield, 
  Users, 
  Eye, 
  Zap,
  Award,
  CheckCircle2,
  MessageCircle,
  Play,
  Pause
} from "lucide-react";

const FogosM5Complete = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Placeholder for video URL - can be replaced when available
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

  const credentials = [
    {
      icon: Shield,
      title: "Certificação INMETRO",
      description: "Protocolos rigorosos de segurança",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Equipe Blaster Elite",
      description: "Profissionais certificados pelo Exército",
      color: "text-blue-500"
    },
    {
      icon: Eye,
      title: "Simulação 3D",
      description: "Visualize antes de acontecer",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Tecnologia Avançada",
      description: "Ignição remota digital",
      color: "text-fire-orange"
    }
  ];

  const stats = [
    { value: "40+", label: "Anos de Experiência" },
    { value: "500+", label: "Eventos Realizados" },
    { value: "100%", label: "Segurança Garantida" },
    { value: "#1", label: "No Brasil" }
  ];

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-background">
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Compact Professional Header */}
        <div className="text-center mb-12">
          {/* Logo Mark - Smaller and more elegant */}
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/fogosm5.svg" 
              alt="FogosM5" 
              className="h-12 w-auto opacity-90" 
            />
          </div>
          
          {/* Main Heading - More concise */}
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="text-fire-gradient">FogosM5</span>
          </h2>
          
          {/* Tagline */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformando momentos em espetáculos inesquecíveis há mais de 40 anos
          </p>

          {/* Trust Badges - Compact inline */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
              Certificado INMETRO
            </Badge>
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <Award className="w-3 h-3 mr-1 text-fire-orange" />
              Líder Nacional
            </Badge>
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <Shield className="w-3 h-3 mr-1 text-blue-500" />
              100% Seguro
            </Badge>
          </div>
        </div>

        {/* Two Column Layout - Content + Visual */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left Column - Key Information */}
          <div className="space-y-6">
            {/* Company Introduction */}
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                A <strong className="text-foreground">M5 Max Produções</strong> é referência nacional 
                em espetáculos pirotécnicos profissionais. Com equipamentos de última geração e uma 
                equipe altamente certificada, transformamos eventos em experiências memoráveis.
              </p>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-fire-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Features - Simplified List */}
            <div className="space-y-3">
              {credentials.slice(0, 3).map((credential, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${credential.color} bg-background/80`}>
                    <credential.icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {credential.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            {videoUrl ? (
              /* Video Player - If content exists */
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <div className="relative aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 hover:bg-white"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                </div>
              </Card>
            ) : (
              /* Professional Company Card - When no video */
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Company Stats Visual */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fire-orange to-fire-red rounded-2xl mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Líder em Pirotecnia Profissional
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-6">
                        Desde 1983 criando momentos inesquecíveis
                      </p>

                      {/* Achievement Badges */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/50 rounded-lg p-3">
                          <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center bg-fire-orange/20 rounded-full">
                            <Award className="w-3 h-3 text-fire-orange" />
                          </div>
                          <div className="text-xs text-muted-foreground">Top 1 Nacional</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3">
                          <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center bg-fire-orange/20 rounded-full">
                            <Zap className="w-3 h-3 text-fire-orange" />
                          </div>
                          <div className="text-xs text-muted-foreground">500+ Shows</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3">
                          <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center bg-fire-orange/20 rounded-full">
                            <Shield className="w-3 h-3 text-fire-orange" />
                          </div>
                          <div className="text-xs text-muted-foreground">Zero Acidentes</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3">
                          <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center bg-fire-orange/20 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-fire-orange" />
                          </div>
                          <div className="text-xs text-muted-foreground">5.0 Avaliação</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Differentials Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {credentials.map((credential, index) => {
            const Icon = credential.icon;
            return (
              <Card 
                key={index} 
                className="group bg-card border-border hover:bg-card/80 transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center mx-auto mb-3 ${credential.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {credential.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {credential.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Professional CTA - Clean */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">
                Solicite sua Simulação 3D Gratuita
              </h3>
              <p className="text-muted-foreground text-sm">
                Visualize como será seu show pirotécnico antes mesmo de acontecer. 
                Totalmente gratuito e sem compromisso.
              </p>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Solicitar Simulação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FogosM5Complete;