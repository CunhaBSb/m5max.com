import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { YouTubeEmbed } from '@/shared/components/ui/youtube-embed';
import { Badge } from '@/shared/components/ui/badge';
import { 
  ExternalLink, 
  Calendar
} from 'lucide-react';
import { FaInstagram as Instagram, FaYoutube as YouTube } from 'react-icons/fa';
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
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[calc(100%-6rem)] pointer-events-none z-10">
            {badges.map(badge => (
              <Badge key={badge} className="bg-fire-orange/90 hover:bg-fire-orange text-white text-xs font-medium shadow-lg backdrop-blur-sm">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Card Content */}
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-fire-orange transition-colors">
              {title}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">{description}</p>
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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-orange-500/10" />
      
      <CardContent className="relative p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              @FogosM5
            </h3>
            <p className="text-white/60 text-sm mt-1">Siga nosso Instagram</p>
          </div>
        </div>
        
        <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
          Acompanhe nossos trabalhos diários, bastidores e momentos únicos dos espetáculos que criamos
        </p>
        
        <Button 
          onClick={handleInstagramClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-400/30 border border-purple-500/50 hover:border-purple-400/60 transition-all duration-300 px-8 py-3 text-base font-semibold group"
        >
          <Instagram className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Seguir no Instagram
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const YouTubeShowcase = () => {
  const { trackWhatsAppClick } = useAnalytics();

  const handleYouTubeClick = () => {
    trackWhatsAppClick({
      audience: 'b2b',
      source: 'youtube_showcase',
      message_template: 'Interesse em ver mais vídeos',
      phone_number: '5561982735575'
    });
    window.open('https://youtube.com/@fogosm5', '_blank');
  };

  return (
    <Card className="relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/15 to-red-500/10" />
      
      <CardContent className="relative p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-red-400 flex items-center justify-center shadow-lg">
            <YouTube className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Fogos M5
            </h3>
            <p className="text-white/60 text-sm mt-1">Canal no YouTube</p>
          </div>
        </div>
        
        <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
          Assista nossos espetáculos completos, tutoriais e conteúdo exclusivo sobre pirotecnia
        </p>
        
        <Button 
          onClick={handleYouTubeClick}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/25 hover:shadow-red-400/30 border border-red-500/50 hover:border-red-400/60 transition-all duration-300 px-8 py-3 text-base font-semibold group"
        >
          <YouTube className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Ver no YouTube
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
    <section className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/10 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/5 via-transparent to-fire-gold/5" />
      
      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Header da seção */}
        <div className="text-center mb-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
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
        
        {/* Call to Action */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/10 via-fire-gold/15 to-fire-orange/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fire-orange/5 to-transparent" />
            
            <CardContent className="relative p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                Pronto para criar seu espetáculo?
              </h3>
              <p className="text-white/80 mb-6 max-w-lg mx-auto leading-relaxed">
                Cada evento é único. Vamos planejar algo especial que ficará na memória de todos para sempre.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/25 hover:shadow-green-400/30 border border-green-500/50 hover:border-green-400/60 transition-all duration-300 px-6 py-2.5 text-sm font-semibold group"
                >
                  💬 Conversar no WhatsApp
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={handleOrçamentoClick}
                  className="bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 border-2 border-fire-orange/50 text-white hover:from-fire-orange/30 hover:to-fire-gold/30 hover:border-fire-orange/70 transition-all duration-300 px-6 py-2.5 text-sm font-semibold group"
                >
                  <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Solicitar Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstagramShowcase />
          <YouTubeShowcase />
        </div>
      </div>
    </section>
  );
};

export default Services;