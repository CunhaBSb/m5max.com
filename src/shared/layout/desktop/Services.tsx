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
      <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Card className="relative h-full flex flex-col bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm border border-fire-orange/30 overflow-hidden shadow-2xl shadow-fire-orange/10 group-hover:shadow-fire-orange/20 transition-all duration-300">
        <div className="aspect-video relative overflow-hidden">
          <YouTubeEmbed 
            youtubeId={youtubeId || ""}
            title={title}
            className="w-full h-full"
          />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[calc(100%-6rem)] pointer-events-none z-10">
            {badges.map(badge => (
              <Badge key={badge} className="bg-fire-orange/90 hover:bg-fire-orange text-white text-xs font-medium shadow-lg backdrop-blur-sm px-2 py-1">
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
          
          <div className="flex flex-wrap gap-2 text-xs mt-auto pt-3 border-t border-white/10">
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

export const ServicesDesktop = () => {
  const { openConversionModal } = useAppStore();

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'services_showcase',
      audience: 'general',
      page: 'home'
    });
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/10 to-background" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/8 via-background to-fire-gold/6" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-fire-orange/3 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-fire-gold/4 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-fire-orange/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-radial from-fire-gold/6 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-fire-orange/40 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-fire-gold/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-fire-orange/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-fire-gold/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-1.5 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-full backdrop-blur-sm border border-fire-orange/40 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              Espetáculos
            </div>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              <span className="text-white">Cada show conta uma</span>
              <br />
              <span className="text-fire-gradient">História única.</span>
            </h2>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Conheça alguns dos nossos espetáculos realizados e se inspire para o seu próximo evento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 lg:mb-20 items-stretch">
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

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Interessado? <span className="text-fire-gradient">Fale conosco</span>
            </h3>
            
            <div className="flex gap-3 justify-center items-center">
              <SocialShowcase />
              
              <Button 
                variant="outline"
                onClick={handleOrçamentoClick}
                size="sm"
                className="border-fire-orange/50 text-white hover:border-fire-orange/80 hover:bg-fire-orange/10 transition-all duration-200 text-sm font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Orçamento
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <p className="text-white/60 text-xs font-medium mb-3 tracking-wide uppercase">
            Acompanhe nossos trabalhos
          </p>
          
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://instagram.com/m5maxproducoes"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'social_click', {
                    social_network: 'instagram',
                    source: 'services_footer'
                  });
                }
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-fire-orange/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-fire-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </a>

            <div className="w-px h-4 bg-white/20" />

            <a
              href="https://youtube.com/@M5MaxProducoes"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'social_click', {
                    social_network: 'youtube',
                    source: 'services_footer'
                  });
                }
              }}
            >
              <div className="absolute -inset-1 bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
              <div className="relative w-8 h-8 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <YouTube className="w-4 h-4 text-white" />
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        <div className="absolute bottom-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/25 to-transparent"></div>
        <div className="absolute bottom-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/98 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-background/70 via-background/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-background/70 via-background/30 to-transparent"></div>
        <div className="absolute bottom-4 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-fire-orange/8 to-transparent blur-lg"></div>
      </div>
    </section>
  );
};

export default ServicesDesktop;