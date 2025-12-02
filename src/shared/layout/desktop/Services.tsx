import { Button } from '@/shared/ui/button';
import { ShowcaseVideoCard } from '@/shared/ui/showcase-video-card';
import { Sparkles, TrendingUp } from 'lucide-react';
import { FaWhatsapp as WhatsApp, FaInstagram as Instagram, FaYoutube as YouTube } from 'react-icons/fa';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

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
        {/* Two-Column Header - Content & Social Media Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
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

          {/* Right Column - Social Media & Stats */}
          <div className="hidden lg:block space-y-3">
            {/* Header */}
            <div className="text-center lg:text-left">
              <h3 className="text-base font-semibold text-white mb-2">
                Siga a <span className="text-fire-gradient">M5 Max</span>
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Acompanhe nossos espetáculos nas redes sociais
              </p>
            </div>
            
            {/* Social Cards - Vertical Stack */}
            <div className="space-y-1.5">
              {/* Instagram */}
              <a 
                href="https://instagram.com/fogosm5" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-black/10 hover:bg-black/20 border border-white/5 hover:border-fire-orange/20 rounded-lg p-2.5 backdrop-blur-sm transition-colors duration-300"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center transition-colors duration-300">
                  <Instagram className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white group-hover:text-fire-orange transition-colors">Instagram</div>
                  <div className="text-white/60 text-sm">@Fogosm5</div>
                </div>
              </a>
              
              {/* YouTube */}
              <a 
                href="https://youtube.com/@FogosM5Max" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-black/10 hover:bg-black/20 border border-white/5 hover:border-fire-orange/20 rounded-lg p-2.5 backdrop-blur-sm transition-colors duration-300"
              >
                <div className="w-6 h-6 rounded-lg bg-red-700 flex items-center justify-center transition-colors duration-300">
                  <YouTube className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white group-hover:text-fire-orange transition-colors">YouTube</div>
                  <div className="text-white/60 text-sm">@FogosM5Max</div>
                </div>
              </a>
            </div>
            
            
          </div>
        </div>

        {/* Content Grid - Optimized spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ShowcaseVideoCard
            variant="desktop"
            youtubeId="xUPt4tZIM-s"
            title="Réveillon 2025 no Iate Clube de Brasília"
            description="Show pirotécnico espetacular para celebrar a virada do ano com sincronização perfeita e efeitos únicos"
            badges={["Réveillon", "Corporativo", "Sincronizado"]}
          />

          <ShowcaseVideoCard
            variant="desktop"
            youtubeId="AY1CF0LRKUw"
            title="Show Pirotécnico Espetacular | Festa do Mimosa 2025"
            description="Espetáculo completo com queima coordenada e efeitos especiais que marcaram a celebração"
            badges={["Festa", "Premium", "Espetacular"]}
          />
        </div>


        {/* Modern CTA Section - Framer/Notion Style */}
        <div className="text-center py-6 max-w-2xl mx-auto">
          {/* Emocional Header with Icon */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-fire-orange animate-pulse" />
            <h3 className="text-xl font-bold text-white">
              Pronto para criar um <span className="text-fire-gradient">espetáculo</span>?
            </h3>
          </div>
          
          {/* Modern Button Layout */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleWhatsAppClick}
              className="h-10 px-5 bg-green-600 hover:bg-green-500 hover:scale-105 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 min-w-[140px]"
            >
              <WhatsApp className="w-4 h-4 mr-3" />
              WhatsApp
            </Button>
            
            <Button 
              variant="outline-fire"
              onClick={handleOrçamentoClick}
              className="h-10 px-5 hover:scale-105 font-medium min-w-[140px]"
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