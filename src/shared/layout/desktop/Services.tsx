import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { Calendar } from 'lucide-react';
import { FaWhatsapp as WhatsApp } from 'react-icons/fa';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
  features: string[];
}

const ShowcaseVideoCard = ({ youtubeId, title, description, badges, features }: ShowcaseVideoCardProps) => {
  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm border border-fire-orange/30 overflow-hidden shadow-xl group hover:shadow-fire-orange/20 transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <YouTubeEmbed 
          youtubeId={youtubeId}
          title={title}
          className="w-full h-full"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {badges.map(badge => (
            <Badge key={badge} className="bg-fire-orange/90 text-white text-xs font-medium shadow-lg backdrop-blur-sm">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-fire-orange transition-colors">
            {title}
          </h3>
          <p className="text-base text-white/80 leading-relaxed">{description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
          {features.map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-fire-orange/20 text-fire-orange rounded text-xs font-medium border border-fire-orange/30"
            >
              {feature}
            </span>
          ))}
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
    <section className="relative py-20 overflow-hidden">
      {/* Standardized Background System - Pattern Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/8 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/6 via-transparent to-fire-gold/4" />
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Standardized Container */}
      <div className="relative container mx-auto px-6 max-w-6xl">
        {/* Standardized Header */}
        <div className="text-center mb-16">
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
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            Conheça alguns dos nossos espetáculos realizados e se inspire para o seu próximo evento.
          </p>
          
          {/* Standardized Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">2000+</div>
              <div className="text-sm text-white/70">Eventos</div>
            </div>
            <div className="text-center bg-gradient-to-br from-fire-orange/15 to-fire-orange/5 border border-fire-orange/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-fire-orange">100%</div>
              <div className="text-sm text-white/70">Segurança</div>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">40</div>
              <div className="text-sm text-white/70">Anos</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <ShowcaseVideoCard 
            youtubeId="xUPt4tZIM-s"
            title="Réveillon 2025 no Iate Clube de Brasília"
            description="Show pirotécnico espetacular para celebrar a virada do ano com sincronização perfeita e efeitos únicos"
            badges={["Réveillon", "Corporativo", "Sincronizado"]}
            features={["Sincronização de Pontos", "Múltiplos Pontos", "Segurança Total"]}
          />
          
          <ShowcaseVideoCard 
            youtubeId="AY1CF0LRKUw"
            title="Show Pirotécnico Espetacular | Festa do Mimosa 2025"
            description="Espetáculo completo com queima coordenada e efeitos especiais que marcaram a celebração"
            badges={["Festa", "Premium", "Espetacular"]}
            features={["Queima Coordenada", "Efeitos Especiais", "Equipe Certificada"]}
          />
        </div>

        {/* Standardized CTA Section */}
        <div className="text-center bg-gradient-to-r from-black/30 via-black/40 to-black/30 backdrop-blur-xl border border-fire-orange/25 rounded-2xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6">
            Interessado? <span className="text-fire-gradient">Fale conosco</span>
          </h3>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-500 text-white transition-all duration-200"
            >
              <WhatsApp className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleOrçamentoClick}
              className="border-fire-orange/50 text-white hover:border-fire-orange/80 hover:bg-fire-orange/10 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Orçamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;