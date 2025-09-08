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
      icon: Award,
      value: "Cert.",
      label: "Certificado Exército",
      description: "Autorização oficial completa"
    }
  ];

  return (
    <section className="relative py-8 overflow-hidden">
      {/* M5 Max Pyrotechnic Background System - Mobile Optimized */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/15 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/12 via-fire-gold/8 to-fire-orange/6" />
      
      {/* Enhanced Mobile Pyrotechnic Particle System - Expertise Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Golden spark particles - mobile density */}
        <div className="absolute top-1/4 left-1/6 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-35" style={{ animationDelay: '1.2s', animationDuration: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-fire-gold/80 rounded-full animate-ping opacity-40" style={{ animationDelay: '2.1s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-30" style={{ animationDelay: '3s', animationDuration: '2.5s' }} />
        
        {/* Mobile firework trails - experience lines */}
        <div className="absolute top-1/5 right-1/5 w-px h-10 bg-gradient-to-b from-fire-gold/25 to-transparent rotate-12 opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-px h-8 bg-gradient-to-t from-fire-orange/20 to-transparent -rotate-12 opacity-25" />
        <div className="absolute top-1/2 right-1/3 w-px h-6 bg-gradient-to-b from-fire-gold/15 to-transparent rotate-45 opacity-20" />
      </div>
      
      {/* Mobile Expertise Burst Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 
             bg-gradient-radial from-fire-gold/10 via-fire-orange/5 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDuration: '5s' }} />
        
        <div className="absolute top-1/4 right-1/3 w-20 h-20 
             bg-gradient-radial from-fire-orange/8 via-fire-gold/4 to-transparent 
             rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '6s' }} />
      </div>
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Professional Ambient Design - Mobile Enhanced */}
      <div className="absolute inset-0 opacity-12 pointer-events-none">
        {/* Mobile lateral ambience - reduced size */}
        <div className="absolute left-0 top-1/3 w-32 h-40 bg-gradient-to-r from-fire-orange/6 to-transparent blur-xl"></div>
        <div className="absolute right-0 top-1/3 w-32 h-40 bg-gradient-to-l from-fire-orange/6 to-transparent blur-xl"></div>
        
        {/* Mobile center focus enhancement */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-full bg-gradient-radial from-white/[0.006] to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Standardized Header - Mobile */}
        <div className="text-center mb-12">
          {/* Standardized Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Sobre a Empresa
          </div>
          
          {/* Standardized Title - H2 */}
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white">Conheça a </span>
            <span className="text-fire-gradient">M5 Max</span>
          </h2>
          
          {/* Standardized Description */}
          <p className="text-base text-white/85 mb-6 max-w-xl mx-auto">
            40 anos transformando eventos em espetáculos memoráveis
          </p>
          
          {/* Compact Mobile Stats Bar */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <div className="bg-fire-orange/15 px-2 py-0.5 rounded-full border border-fire-orange/30 backdrop-blur-sm">
              <span className="text-xs font-bold text-fire-orange">40 Anos</span>
            </div>
            <div className="bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/30 backdrop-blur-sm">
              <span className="text-xs font-bold text-green-500">100% Seguro</span>
            </div>
            <div className="bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/30 backdrop-blur-sm">
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
              {/* Enhanced glow effect for mobile */}
              <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/15 via-fire-gold/25 to-fire-orange/15 rounded-xl blur-sm opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 backdrop-blur-sm border-2 border-fire-gold/30 hover:border-fire-orange/50 shadow-2xl shadow-fire-gold/20 transition-all duration-500 hover:shadow-fire-orange/30">
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

          {/* Harmonious 4-Column Mobile Stats Grid */}
          <div className="grid grid-cols-4 gap-1 max-w-sm mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative aspect-square">
                  {/* Minimal glow effect */}
                  <div className="absolute -inset-0.5 bg-fire-orange/6 rounded blur opacity-25" />
                  
                  <Card className="relative z-10 h-full bg-gradient-to-br from-fire-orange/10 to-fire-gold/6 backdrop-blur-sm border border-fire-orange/20 hover:border-fire-gold/35 shadow-sm shadow-fire-orange/6 hover:shadow-fire-gold/12 transition-all duration-300 group">
                    <CardContent className="p-1.5 h-full">
                      <div className="flex flex-col items-center justify-center text-center space-y-0.5 h-full">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-fire-gold/15 to-fire-orange/12 flex items-center justify-center shadow-sm shadow-fire-gold/10 group-hover:shadow-fire-orange/15 transition-all duration-300 group-hover:scale-105">
                          <Icon className="w-2 h-2 text-fire-gold group-hover:text-fire-orange transition-colors duration-300" />
                        </div>
                        <div className="text-xs font-bold text-white group-hover:text-fire-gold transition-colors duration-300 leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[10px] font-medium text-white/90 group-hover:text-white leading-tight transition-colors duration-300 text-center">
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

        {/* Compact Mobile CTA Section - Professional */}
        <div className="text-center space-y-3">
          <div className="relative">
            {/* Simplified ambient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/6 via-fire-gold/8 to-fire-orange/6 rounded-xl blur opacity-30" />
            
            <div className="relative bg-gradient-to-r from-fire-orange/6 to-fire-gold/6 p-4 rounded-xl border border-fire-orange/15 backdrop-blur-sm shadow-md shadow-fire-orange/8">
              <h3 className="text-lg font-bold text-fire-gradient mb-2">
                Pronto para um espetáculo inesquecível?
              </h3>
              <p className="text-sm text-white/80 mb-3 leading-relaxed">
                Solicite um orçamento personalizado para o seu evento
              </p>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full h-8 bg-gradient-to-r from-green-600/20 via-green-500/25 to-green-600/20 border border-green-500/40 text-white hover:from-green-500/25 hover:via-green-400/35 hover:to-green-500/25 hover:border-green-400/60 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-sm shadow-green-500/15"
                  onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/8 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <MessageCircle className="w-3 h-3 mr-2" />
                  <span className="text-xs font-medium">WhatsApp Direto</span>
                  <div className="flex items-center gap-1 ml-auto bg-green-400/15 px-1.5 py-0.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-200">Online</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline-fire"
                  className="w-full h-8 font-medium text-sm"
                  onClick={() => {/* Add conversion modal logic */}}
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  <span className="text-xs">Orçamento Gratuito</span>
                  <div className="flex items-center gap-1 ml-auto bg-fire-orange/15 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-fire-orange font-bold">Grátis</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FogosM5Complete;