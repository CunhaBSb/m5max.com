import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { 
  Calendar
} from 'lucide-react';
import { FaWhatsapp as WhatsApp, FaInstagram as Instagram, FaYoutube as YouTube } from 'react-icons/fa';
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
    <div className="relative group animate-fade-in-up h-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
      {/* Efeito de glow decorativo */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Card className="relative h-full flex flex-col bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm border border-fire-orange/30 overflow-hidden shadow-lg shadow-fire-orange/10 group-hover:shadow-fire-orange/20 transition-all duration-300">
        {/* Video Player */}
        <div className="aspect-video relative overflow-hidden">
          <YouTubeEmbed 
            youtubeId={youtubeId || ""}
            title={title}
            className="w-full h-full"
          />
          
          {/* Overlay com badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-4rem)] pointer-events-none z-10">
            {badges.map(badge => (
              <Badge key={badge} className="bg-fire-orange/90 hover:bg-fire-orange text-white text-xs font-medium shadow-lg backdrop-blur-sm px-1.5 py-0.5">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Card Content */}
        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-fire-orange transition-colors">
              {title}
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">{description}</p>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-2 text-xs mt-auto pt-2 border-t border-white/10">
            {features.map((feature, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-fire-orange/20 text-fire-orange rounded-md text-xs font-medium border border-fire-orange/30"
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

const SocialShowcase = () => {
  const { trackWhatsAppClick } = useAnalytics();

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      undefined,
      { audience: 'b2b', source: 'services_social_showcase' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'services_social_showcase',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="bg-green-600 hover:bg-green-500 text-white transition-colors duration-200 text-sm font-medium px-4 py-2"
    >
      <WhatsApp className="w-4 h-4 mr-2" />
      WhatsApp
    </Button>
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
    <section className="relative py-12 overflow-hidden">
      {/* Harmonized Professional Background System */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/10 to-background" />
      
      {/* Dynamic Ambient Gradients - Following Hero Pattern */}
      <div className="absolute inset-0">
        {/* Primary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/8 via-background to-fire-gold/6" />
        
        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-fire-orange/3 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-fire-gold/4 via-transparent to-transparent" />
        
        {/* Radial accent gradients */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-fire-orange/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-radial from-fire-gold/6 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Subtle particle effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 bg-fire-orange/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-fire-gold/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-fire-orange/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-fire-gold/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Header da seção - Mobile Optimized */}
        <div className="text-center mb-12">
          {/* Mobile Compact Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Badge superior - compact */}
            <div className="inline-flex items-center gap-1.5 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-full backdrop-blur-sm border border-fire-orange/40 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              Espetáculos
            </div>
            
            {/* Mobile Stats Badge */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-fire-gold/30">
              <div className="w-1.5 h-1.5 bg-fire-gold rounded-full animate-pulse" />
              <span className="text-xs text-white font-medium">2K+ Shows</span>
            </div>
          </div>
          
          {/* Título principal - Mobile First */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h2 className="text-2xl font-bold mb-3 leading-tight">
              <span className="text-white">Cada show conta uma</span>
              <br />
              <span className="text-fire-gradient">História única.</span>
            </h2>
            
            <p className="text-base text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Conheça alguns dos nossos espetáculos realizados e se inspire para o seu próximo evento
            </p>
          </div>
          
          {/* Mobile Quick Actions */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 bg-green-500/20 border border-green-500/50 text-white text-xs"
              onClick={handleWhatsAppClick}
            >
              <WhatsApp className="w-3 h-3 mr-1.5" />
              WhatsApp
            </Button>
            <Button
              variant="fire"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={handleOrçamentoClick}
            >
              <Calendar className="w-3 h-3 mr-1.5" />
              Orçar
            </Button>
          </div>
        </div>

        {/* Grid principal de showcases - Mobile Optimized */}
        <div className="grid grid-cols-1 gap-6 mb-12 items-stretch">
          
          {/* YouTube Videos - Mobile Enhanced */}
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

        {/* Mobile Enhanced CTA Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {/* Mobile CTA */}
          <div className="bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 backdrop-blur-sm border border-fire-orange/15 rounded-xl p-4 text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-fire-gradient flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-base font-bold text-fire-gradient">
                Seu evento merece o melhor!
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Orçamento grátis • Resposta rápida • 40 anos de experiência
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 bg-green-500/20 border border-green-500/50 text-white text-xs"
                onClick={handleWhatsAppClick}
              >
                <WhatsApp className="w-3.5 h-3.5 mr-1.5" />
                WhatsApp
              </Button>
              <Button
                variant="fire"
                size="sm"
                className="h-9 text-xs"
                onClick={handleOrçamentoClick}
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Orçar Agora
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media Section - Mobile Optimized */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 backdrop-blur-sm border border-fire-orange/10 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-fire-gradient flex items-center justify-center">
                <Instagram className="w-2.5 h-2.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-fire-orange">Siga nossos trabalhos</h3>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Veja nossos espetáculos mais recentes
            </p>
            
            <div className="flex justify-center gap-3">
              <a
                href="https://instagram.com/fogosm5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg px-3 py-2 transition-all hover:from-pink-500/30 hover:to-purple-500/30"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'social_click', {
                      social_network: 'instagram',
                      source: 'services_footer'
                    });
                  }
                }}
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-medium text-white">Instagram</span>
              </a>

              <a
                href="https://youtube.com/@M5MaxProducoes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-lg px-3 py-2 transition-all hover:bg-red-600/30"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'social_click', {
                      social_network: 'youtube',
                      source: 'services_footer'
                    });
                  }
                }}
              >
                <YouTube className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium text-white">YouTube</span>
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