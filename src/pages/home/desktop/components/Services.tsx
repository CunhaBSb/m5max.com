import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { YouTubeEmbed } from '@/shared/components/ui/youtube-embed';
import { Badge } from '@/shared/components/ui/badge';
import { 
  ArrowRight, 
  ExternalLink, 
  Play, 
  Clock, 
  Users, 
  Sparkles,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { FaInstagram as Instagram } from 'react-icons/fa';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
  stats: {
    duration: string;
    audience: string;
    effects: string;
  };
}

const ShowcaseVideoCard = ({ youtubeId, title, description, badges, stats }: ShowcaseVideoCardProps) => {

  return (
    <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
      {/* Efeito de glow decorativo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Card className="relative bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm border border-fire-orange/30 overflow-hidden shadow-2xl shadow-fire-orange/10 group-hover:shadow-fire-orange/20 transition-all duration-300">
        {/* Video Player */}
        <div className="aspect-video relative overflow-hidden">
          <YouTubeEmbed 
            youtubeId={youtubeId || ""}
            title={title}
            className="w-full h-full"
          />
          
          {/* Overlay com badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[calc(100%-6rem)]">
            {badges.map(badge => (
              <Badge key={badge} className="bg-fire-orange/90 hover:bg-fire-orange text-white text-xs font-medium shadow-lg backdrop-blur-sm">
                {badge}
              </Badge>
            ))}
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div className="w-16 h-16 rounded-full bg-fire-orange/90 flex items-center justify-center shadow-2xl">
              <Play className="w-6 h-6 text-white fill-current ml-1" />
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-fire-orange transition-colors">
              {title}
            </h3>
            <p className="text-white/80 leading-relaxed">{description}</p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-fire-orange" />
                <span className="text-white/90">{stats.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-white/90">{stats.audience}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90">{stats.effects}</span>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="text-fire-orange hover:text-fire-gold hover:bg-fire-orange/10 transition-all">
              Assistir <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InstagramShowcase = () => {
  const { trackWhatsAppClick } = useAnalytics();

  const handleInstagramClick = () => {
    trackWhatsAppClick({
      audience: 'b2b',
      source: 'instagram_showcase',
      message_template: 'Interesse em acompanhar trabalhos',
      phone_number: '5561982735575'
    });
    window.open('https://instagram.com/fogosm5', '_blank');
  };

  return (
    <Card className="relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
      {/* Background gradient animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-orange-500/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
      
      <CardContent className="relative p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            @FogosM5
          </h3>
        </div>
        
        <p className="text-white/80 mb-6 max-w-md mx-auto leading-relaxed">
          Acompanhe nossos trabalhos diários, bastidores e momentos únicos dos espetáculos que criamos
        </p>
        
        {/* Grid de preview do Instagram - Placeholder */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-lg animate-pulse border border-purple-400/20 flex items-center justify-center" style={{ animationDelay: `${i * 100}ms` }}>
              <Play className="w-4 h-4 text-white/50" />
            </div>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={handleInstagramClick}
          className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border-2 border-purple-400/40 text-white hover:from-purple-400/30 hover:via-pink-400/30 hover:to-orange-400/30 hover:border-purple-300/60 backdrop-blur-md transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-400/30 group"
        >
          <Instagram className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Seguir no Instagram
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const Services = () => {
  const { openConversionModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'services_showcase' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'services_showcase',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'services_showcase',
      audience: 'general',
      page: 'home'
    });
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/10 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/5 via-transparent to-fire-gold/5" />
      
      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Header da seção */}
        <div className="text-center mb-16">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 text-white font-semibold text-sm bg-fire-orange/20 px-4 py-2 rounded-full backdrop-blur-sm border border-fire-orange/40 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Nossos Espetáculos
          </div>
          
          {/* Título principal */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              <span className="text-white">Cada show conta uma</span>
              <br />
              <span className="text-fire-gradient">História única.</span>
            </h2>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Conheça alguns dos nossos espetáculos realizados e se inspire para o seu próximo evento
            </p>
          </div>
        </div>

        {/* Grid principal de showcases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* YouTube Videos - 2 cards principais */}
          <ShowcaseVideoCard 
            youtubeId="xUPt4tZIM-s"
            title="Réveillon 2025 no Iate Clube de Brasília"
            description="Show pirotécnico espetacular para celebrar a virada do ano com sincronização perfeita e efeitos únicos"
            badges={["Réveillon", "Corporativo", "Sincronizado"]}
            stats={{ duration: "3min", audience: "2000+", effects: "150+" }}
          />
          
          <ShowcaseVideoCard 
            youtubeId="AY1CF0LRKUw"
            title="Show Pirotécnico Espetacular | Festa do Mimosa 2025"
            description="Espetáculo completo com queima coordenada e efeitos especiais que marcaram a celebração"
            badges={["Festa", "Premium", "Espetacular"]}
            stats={{ duration: "4min", audience: "1500+", effects: "120+" }}
          />
        </div>

        {/* Instagram Integration */}
        <div className="mb-16">
          <InstagramShowcase />
        </div>
        
        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/10 via-fire-gold/15 to-fire-orange/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fire-orange/5 to-transparent" />
            
            <CardContent className="relative p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Pronto para criar seu espetáculo?
              </h3>
              <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                Cada evento é único. Vamos planejar algo especial que ficará na memória de todos para sempre.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/30 border border-green-500/50 hover:border-green-400/60 transition-all duration-300 px-8 py-3 text-base font-semibold group"
                >
                  <Instagram className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Conversar no WhatsApp
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={handleOrçamentoClick}
                  className="bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 border-2 border-fire-orange/50 text-white hover:from-fire-orange/30 hover:to-fire-gold/30 hover:border-fire-orange/70 transition-all duration-300 px-8 py-3 text-base font-semibold group"
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Solicitar Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;