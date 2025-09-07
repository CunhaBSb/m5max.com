import { Card, CardContent } from "@/shared/ui/card";
import { VideoPlayerSimple } from "@/shared/ui/video-player-simple";
import { 
  Shield, 
  Award,
  Users,
  Zap
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
    <section id="fogos-m5-complete" className="relative py-12 overflow-hidden">
      {/* M5 Max Pyrotechnic Background System */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/15 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/12 via-fire-gold/8 to-fire-orange/6" />
      
      {/* Pyrotechnic Particle System - Expertise Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Golden spark particles */}
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-fire-gold rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.2s', animationDuration: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-fire-gold/80 rounded-full animate-ping opacity-50" style={{ animationDelay: '2.1s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-45" style={{ animationDelay: '3s', animationDuration: '2.5s' }} />
        
        {/* Firework trails - Experience lines */}
        <div className="absolute top-1/5 right-1/5 w-px h-16 bg-gradient-to-b from-fire-gold/30 to-transparent rotate-12 opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-px h-12 bg-gradient-to-t from-fire-orange/25 to-transparent -rotate-12 opacity-35" />
        <div className="absolute top-1/2 right-1/3 w-px h-10 bg-gradient-to-b from-fire-gold/20 to-transparent rotate-45 opacity-30" />
      </div>
      
      {/* Expertise Burst Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 
             bg-gradient-radial from-fire-gold/12 via-fire-orange/6 to-transparent 
             rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '5s' }} />
        
        <div className="absolute top-1/4 right-1/3 w-28 h-28 
             bg-gradient-radial from-fire-orange/10 via-fire-gold/5 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '6s' }} />
      </div>
      
      {/* Optimized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Standardized Container */}
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Standardized Header */}
        <div className="text-center mb-16">
          {/* Standardized Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Sobre a Empresa
          </div>
          
          {/* Standardized Title - H2 */}
          <h2 className="text-3xl font-bold mb-6">
            <span className="text-white">Conheça a </span>
            <span className="text-fire-gradient">M5 Max</span>
          </h2>
          
          {/* Standardized Description */}
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            40 anos transformando eventos em espetáculos memoráveis
          </p>
        </div>

        {/* Main Content Section - Desktop Grid */}
        <div className="grid grid-cols-5 gap-6 mb-12 items-center">
          {/* Left Stats Cards - Desktop */}
          <div className="col-span-1 space-y-4">
            {stats.slice(0, 2).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="relative">
                  {/* Enhanced decorative elements */}
                  <div className="absolute -inset-1 opacity-20">
                    <div className="absolute inset-0 bg-fire-gold/15 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-gradient-to-br from-fire-orange/15 to-fire-gold/10 backdrop-blur-sm border border-fire-orange/30 hover:border-fire-gold/50 shadow-lg shadow-fire-orange/20 hover:shadow-fire-gold/25 transition-all duration-300 hover:bg-gradient-to-br hover:from-fire-orange/20 hover:to-fire-gold/15">
                    <CardContent className="relative z-10 p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-fire-gold/25 backdrop-blur-sm flex items-center justify-center group-hover:bg-fire-orange/35 transition-all duration-300 shadow-md shadow-fire-gold/30">
                          <Icon className="w-5 h-5 text-fire-gold group-hover:text-fire-orange transition-colors duration-300" />
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

          {/* Center Video Section - Desktop */}
          <div className="col-span-3 relative">
            {/* Desktop decorative elements */}
            <div className="absolute -inset-4 opacity-30">
              <div className="absolute inset-0 bg-fire-orange/15 blur-3xl rounded-2xl"></div>
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-fire-orange/60 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-fire-orange/60 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <Card className="overflow-hidden bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-fire-gold/25 hover:border-fire-orange/40 shadow-2xl shadow-fire-gold/20 hover:shadow-fire-orange/25 transition-all duration-300">
                
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
                      <div className="text-center space-y-4 p-8">
                        <div className="w-16 h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
                          <Award className="w-8 h-8 text-fire-orange" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Conheça a M5 Max</h3>
                        <p className="text-base text-white/80">
                          40 anos transformando eventos em espetáculos memoráveis
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Right Stats Cards - Desktop */}
          <div className="col-span-1 space-y-4">
            {stats.slice(2, 4).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index + 2} className="relative">
                  {/* Enhanced decorative elements */}
                  <div className="absolute -inset-1 opacity-20">
                    <div className="absolute inset-0 bg-fire-orange/15 blur-lg rounded-lg"></div>
                  </div>

                  <Card className="relative z-10 group bg-gradient-to-br from-fire-gold/12 to-fire-orange/8 backdrop-blur-sm border border-fire-gold/30 hover:border-fire-orange/50 shadow-lg shadow-fire-gold/20 hover:shadow-fire-orange/25 transition-all duration-300 hover:bg-gradient-to-br hover:from-fire-gold/18 hover:to-fire-orange/12">
                    <CardContent className="relative z-10 p-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-fire-orange/25 backdrop-blur-sm flex items-center justify-center group-hover:bg-fire-gold/35 transition-all duration-300 shadow-md shadow-fire-orange/30">
                          <Icon className="w-5 h-5 text-fire-orange group-hover:text-fire-gold transition-colors duration-300" />
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
    </section>
  );
};

export default FogosM5Complete;