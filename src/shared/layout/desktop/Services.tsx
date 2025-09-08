import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { Sparkles, TrendingUp } from 'lucide-react';
import { FaWhatsapp as WhatsApp, FaInstagram as Instagram, FaYoutube as YouTube } from 'react-icons/fa';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
}

const ShowcaseVideoCard = ({ youtubeId, title, description, badges }: ShowcaseVideoCardProps) => {
  // Limit badges to 3 maximum for cleaner design
  const displayBadges = badges.slice(0, 3);
  
  return (
    <Card className="h-full flex flex-col bg-black/30 hover:bg-black/40 backdrop-blur-sm border border-white/10 hover:border-fire-orange/30 overflow-hidden shadow-lg group hover:shadow-fire-orange/10 transition-all duration-300">
      {/* Video Thumbnail with YouTube Watermark */}
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <YouTubeEmbed 
          youtubeId={youtubeId}
          title={title}
          className="w-full h-full"
        />
        {/* Discrete YouTube Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1.5">
          <YouTube className="w-3 h-3 text-red-500" />
          <span className="text-xs text-white/80 font-medium">YouTube</span>
        </div>
      </div>
      
      {/* Card Content - Reduced padding */}
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Badges moved to top */}
        <div className="flex flex-wrap gap-1.5">
          {displayBadges.map(badge => (
            <Badge 
              key={badge} 
              className="bg-white/10 hover:bg-fire-orange/20 text-white hover:text-fire-orange text-xs px-2 py-0.5 font-medium border border-white/20 transition-colors duration-200"
            >
              {badge}
            </Badge>
          ))}
        </div>
        
        {/* Content with better hierarchy */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-white leading-tight group-hover:text-fire-orange transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const Services = () => {
  const { openConversionModal } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'services_showcase',
      audience: 'general',
      page: 'home'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      undefined,
      { audience: 'b2b', source: 'services_main' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'services_main',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <section className="relative py-10 overflow-hidden">
      {/* Pattern Alternative Background - Harmonious complement to FogosM5Complete */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/12 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-transparent to-fire-orange/4" />
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Standardized Container */}
      <div className="relative container mx-auto px-6 max-w-6xl">
        {/* Two-Column Header - Content & Social Media */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Standardized Badge */}
            <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-6">
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              Espetáculos Profissionais
            </div>
            
            {/* Standardized Title - H2 */}
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-white">Cada show conta uma </span>
              <span className="text-fire-gradient">história única</span>
            </h2>
            
            {/* Standardized Description */}
            <p className="text-lg text-white/85">
              Conheça alguns dos nossos espetáculos realizados e se inspire para o seu próximo evento.
            </p>
          </div>

        </div>

        {/* Content Grid - Optimized spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ShowcaseVideoCard 
            youtubeId="xUPt4tZIM-s"
            title="Réveillon 2025 no Iate Clube de Brasília"
            description="Show pirotécnico espetacular para celebrar a virada do ano com sincronização perfeita e efeitos únicos"
            badges={["Réveillon", "Corporativo", "Sincronizado"]}
          />
          
          <ShowcaseVideoCard 
            youtubeId="AY1CF0LRKUw"
            title="Show Pirotécnico Espetacular | Festa do Mimosa 2025"
            description="Espetáculo completo com queima coordenada e efeitos especiais que marcaram a celebração"
            badges={["Festa", "Premium", "Espetacular"]}
          />
        </div>

        {/* Desktop Social Media Section - Moved to End */}
        <div className="space-y-6 mb-12">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Siga a <span className="text-fire-gradient">M5 Max</span>
            </h3>
            <p className="text-white/70 leading-relaxed">
              Acompanhe nossos espetáculos nas redes sociais
            </p>
          </div>
          
          {/* Social Cards - Minimalist Horizontal Layout */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Instagram */}
            <a 
              href="https://instagram.com/fogosm5" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-black/20 hover:bg-black/30 border border-white/10 hover:border-fire-orange/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] min-w-[180px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg group-hover:text-fire-orange transition-colors">Instagram</div>
                <div className="text-white/60 text-sm">@Fogosm5</div>
              </div>
            </a>
            
            {/* YouTube */}
            <a 
              href="https://youtube.com/@FogosM5Max" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-black/20 hover:bg-black/30 border border-white/10 hover:border-fire-orange/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] min-w-[180px]"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <YouTube className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-white text-lg group-hover:text-fire-orange transition-colors">YouTube</div>
                <div className="text-white/60 text-sm">@FogosM5Max</div>
              </div>
            </a>
          </div>
          
          {/* Social Stats - Integrated Clean Design */}
          <div className="flex justify-center">
            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-fire-orange">+2K</div>
                <div className="text-white/60 text-sm font-medium">Shows realizados</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div>
                <div className="text-2xl font-bold text-fire-orange">+40</div>
                <div className="text-white/60 text-sm font-medium">Anos de experiência</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern CTA Section - Framer/Notion Style */}
        <div className="text-center py-8 max-w-2xl mx-auto">
          {/* Emocional Header with Icon */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-fire-orange animate-pulse" />
            <h3 className="text-2xl font-bold text-white">
              Pronto para criar um <span className="text-fire-gradient">espetáculo</span>?
            </h3>
          </div>
          
          {/* Modern Button Layout */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleWhatsAppClick}
              className="h-12 px-6 bg-green-600 hover:bg-green-500 hover:scale-105 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 min-w-[160px]"
            >
              <WhatsApp className="w-4 h-4 mr-3" />
              WhatsApp
            </Button>
            
            <Button 
              variant="outline-fire"
              onClick={handleOrçamentoClick}
              className="h-12 px-6 hover:scale-105 font-medium min-w-[160px]"
            >
              <TrendingUp className="w-4 h-4 mr-3" />
              Orçamento
            </Button>    
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;