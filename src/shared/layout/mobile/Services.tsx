import { Card, CardContent } from '@/shared/ui/card';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { FaInstagram as Instagram, FaYoutube as YouTube } from 'react-icons/fa';

interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
  features: string[];
}

const ShowcaseVideoCard = ({ youtubeId, title, description, badges, features }: ShowcaseVideoCardProps) => {

  return (
    <div className="relative group animate-fade-in-up h-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
      {/* Mobile showcase decorative particles */}
      <div className="absolute -inset-1 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-fire-gold/60 rounded-full animate-ping opacity-40" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-fire-orange/50 rounded-full animate-pulse opacity-30" style={{ animationDelay: '2.8s', animationDuration: '2s' }} />
      </div>

      {/* Enhanced mobile glow effect with fire theme */}
      <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/12 via-fire-gold/20 to-fire-orange/12 rounded-xl blur-md opacity-50 group-hover:opacity-80 animate-pulse transition-opacity duration-500" style={{ animationDuration: '4s' }} />
      
      <Card className="relative h-full flex flex-col bg-gradient-to-br from-black/70 via-gray-900/50 to-black/70 backdrop-blur-sm border-2 border-fire-orange/25 hover:border-fire-gold/40 overflow-hidden shadow-xl shadow-fire-orange/15 group-hover:shadow-fire-gold/25 transition-all duration-500 hover:transform hover:scale-[1.02]">
        {/* Enhanced Mobile Video Player Section */}
        <div className="aspect-video relative overflow-hidden">
          {/* Video background glow */}
          <div className="absolute -inset-1 bg-gradient-to-br from-fire-gold/8 via-fire-orange/10 to-fire-gold/8 rounded-t-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <YouTubeEmbed 
              youtubeId={youtubeId || ""}
              title={title}
              className="w-full h-full rounded-t-lg"
            />
          </div>
          
          {/* Enhanced overlay with mobile badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-4rem)] pointer-events-none z-20">
            {badges.map((badge, index) => (
              <Badge 
                key={badge} 
                className="bg-gradient-to-r from-fire-orange/90 to-fire-orange text-white text-xs font-bold shadow-lg backdrop-blur-md px-2 py-1 border border-fire-orange/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Mobile video enhancement overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none z-15" />
        </div>
        
        {/* Compact Mobile Card Content */}
        <CardContent className="p-3 space-y-2 flex-1 flex flex-col bg-gradient-to-br from-gray-900/40 via-black/50 to-gray-900/40 backdrop-blur-sm border-t border-fire-orange/20">
          <div className="flex-1">
            {/* Compact mobile title with fire gradient on hover */}
            <h3 className="text-sm font-bold text-white mb-2 group-hover:text-fire-gradient transition-all duration-300 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-white/85 leading-relaxed group-hover:text-white/95 transition-colors duration-300">{description}</p>
          </div>
          
          {/* Compact Mobile Features Section */}
          <div className="flex flex-wrap gap-1 text-xs mt-auto pt-2 border-t border-fire-orange/25 group-hover:border-fire-gold/30 transition-colors duration-300">
            {features.map((feature, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-fire-orange/20 to-fire-gold/15 text-fire-orange hover:text-fire-gold rounded-full text-xs font-medium border border-fire-orange/40 hover:border-fire-gold/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-sm group-hover:shadow-fire-orange/20 animate-fade-in-up"
                style={{ animationDelay: `${0.3 + (index * 0.1)}s`, animationFillMode: 'both' }}
              >
                {feature}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const Services = () => {

  return (
    <section className="relative py-10 overflow-hidden">
      {/* Shows Background System - Mobile Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/12 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-transparent to-fire-orange/4" />
      
      {/* Dynamic Firework Trails System - Mobile Adapted */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mobile crossing patterns - reduced complexity */}
        <div className="absolute top-1/6 left-1/4 w-px h-8 bg-gradient-to-b from-fire-gold/20 to-transparent rotate-45 opacity-25" />
        <div className="absolute top-1/3 right-1/6 w-px h-6 bg-gradient-to-b from-fire-orange/18 to-transparent -rotate-45 opacity-20" />
        <div className="absolute bottom-1/3 left-1/6 w-px h-10 bg-gradient-to-t from-fire-gold/15 to-transparent rotate-30 opacity-15" />
        <div className="absolute bottom-1/4 right-1/3 w-px h-7 bg-gradient-to-t from-fire-orange/12 to-transparent -rotate-30 opacity-18" />
        
        {/* Shows spark particles */}
        <div className="absolute top-1/5 right-1/5 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-30" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-25" style={{ animationDelay: '2.2s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-1/5 right-1/3 w-0.5 h-0.5 bg-fire-gold/80 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.8s', animationDuration: '4s' }} />
      </div>
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Compact Header - Mobile */}
        <div className="text-center mb-8">
          {/* Compact Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-xs bg-fire-orange/20 px-2.5 py-1 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Espetáculos Profissionais
          </div>
          
          {/* Compact Title - H2 */}
          <h2 className="text-lg font-bold mb-4">
            <span className="text-fire-gradient">Shows</span>
            <span className="text-white"> Pirotécnicos Premium</span>
          </h2>
          
          {/* Compact Description */}
          <p className="text-sm text-white/85 max-w-xl mx-auto">
            Conheça nossos espetáculos realizados e se inspire para o seu próximo evento.
          </p>
        </div>

        {/* Enhanced Shows Grid - Mobile First Design */}
        <div className="relative">
          {/* Shows ambient particles for mobile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/5 right-1/6 w-0.5 h-0.5 bg-fire-gold/40 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s', animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-fire-orange/35 rounded-full animate-pulse opacity-25" style={{ animationDelay: '3.5s', animationDuration: '3s' }} />
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 items-stretch relative z-10">
            
            {/* Enhanced Réveillon Video Card */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <ShowcaseVideoCard 
                youtubeId="xUPt4tZIM-s"
                title="Réveillon 2025 no Iate Clube de Brasília"
                description="Show pirotécnico espetacular para celebrar a virada do ano com sincronização perfeita e efeitos únicos que iluminaram Brasília"
                badges={["Réveillon", "Corporativo", "Sincronizado"]}
                features={["Sincronização Multi-Ponto", "Efeitos Premium", "Segurança Total"]}
              />
            </div>
            
            {/* Enhanced Festa do Mimosa Video Card */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <ShowcaseVideoCard 
                youtubeId="AY1CF0LRKUw"
                title="Show Pirotécnico Espetacular | Festa do Mimosa 2025"
                description="Espetáculo completo com queima coordenada e efeitos especiais que marcaram a celebração e encantaram todos os presentes"
                badges={["Festa", "Premium", "Espetacular"]}
                features={["Queima Coordenada", "Efeitos Especiais", "Equipe Certificada"]}
              />
            </div>

          </div>
        </div>

        {/* Mobile Social Media Section */}
        <div className="mb-12">
          {/* Compact Social Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              Siga a <span className="text-fire-gradient">M5 Max</span>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Acompanhe nossos espetáculos nas redes sociais
            </p>
          </div>
          
          {/* Compact Social Cards - Mobile Layout */}
          <div className="flex flex-col gap-2">
            {/* Compact Instagram Card */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              {/* Simplified glow effect */}
              <div className="absolute -inset-0.5 bg-pink-500/12 rounded-xl blur opacity-30" />
              
              <a 
                href="https://instagram.com/fogosm5" 
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex items-center gap-3 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 hover:from-black/50 hover:via-gray-900/40 hover:to-black/50 border-2 border-pink-500/20 hover:border-pink-400/40 rounded-xl p-3 backdrop-blur-md transition-all duration-300 hover:transform hover:scale-[1.02] shadow-md shadow-pink-500/8 hover:shadow-pink-500/15"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'social_click', {
                      social_network: 'instagram',
                      source: 'services_social_mobile'
                    });
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm group-hover:text-pink-400 transition-colors duration-300">@fogosm5</h4>
                  <p className="text-white/70 text-xs group-hover:text-white/85 transition-colors duration-300">Vídeos e fotos dos shows</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-2 py-1 rounded-full border border-pink-400/25 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
                  <span className="text-xs text-pink-300 font-medium">Ativo</span>
                </div>
              </a>
            </div>

            {/* Compact YouTube Card */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              {/* Simplified glow effect */}
              <div className="absolute -inset-0.5 bg-red-500/12 rounded-xl blur opacity-30" />
              
              <a 
                href="https://youtube.com/@m5maxproducoes" 
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex items-center gap-3 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 hover:from-black/50 hover:via-gray-900/40 hover:to-black/50 border-2 border-red-600/20 hover:border-red-500/40 rounded-xl p-3 backdrop-blur-md transition-all duration-300 hover:transform hover:scale-[1.02] shadow-md shadow-red-600/8 hover:shadow-red-500/15"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'social_click', {
                      social_network: 'youtube',
                      source: 'services_social_mobile'
                    });
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-red-500/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <YouTube className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors duration-300">M5 Max Produções</h4>
                  <p className="text-white/70 text-xs group-hover:text-white/85 transition-colors duration-300">Canal oficial no YouTube</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600/20 to-red-500/20 px-2 py-1 rounded-full border border-red-500/25 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-xs text-red-300 font-medium">Vídeos</span>
                </div>
              </a>
            </div>

          </div>
        </div>

      </div>
      
      {/* Professional Bottom Transition - Matching Hero Style */}
      <div className="absolute bottom-0 left-0 w-full h-32 z-20 pointer-events-none">
        {/* Main gradient transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        
        {/* Accent lines for visual continuity */}
        <div className="absolute bottom-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/25 to-transparent"></div>
        <div className="absolute bottom-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
        
        {/* Professional fade pattern with depth */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/98 to-transparent"></div>
        
        {/* Side accent gradients for depth */}
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-background/70 via-background/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-background/70 via-background/30 to-transparent"></div>
        
        {/* Subtle ambient light at edges */}
        <div className="absolute bottom-4 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-fire-orange/8 to-transparent blur-lg"></div>
      </div>
    </section>
  );
};

export default Services;