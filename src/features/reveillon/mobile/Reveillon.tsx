import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import RootLayout from '@/app/layouts/RootLayout';
import TimelineSection from '@features/reveillon/mobile/components/TimelineSection';
import ReveillonCallToAction from '@features/reveillon/mobile/components/ReveillonCallToAction';
import { Button } from '@/shared/ui/button';
import { MessageSquare, Calendar, Sparkles, Star, Clock, Shield, Award } from 'lucide-react';

const ReveillonMobile = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { openConversionModal, attribution } = useAppStore();

  useEffect(() => {
    trackPageView({
      page_title: 'Reveillon M5 Max - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'hero_mobile',
      audience: 'b2b',
      page: 'reveillon',
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2b', source: 'hero_mobile' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'hero_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Reveillon M5 Max - Shows Pirotécnicos</title>
        <meta name="description" content="Celebre a virada do ano com shows pirotécnicos espetaculares. Produção completa para eventos de Reveillon com segurança e qualidade M5 Max." />
        <meta name="keywords" content="reveillon, ano novo, fogos de artifício, shows pirotécnicos, virada do ano, eventos, festa" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          {/* Mobile Reveillon Hero - Enhanced Professional */}
          <div id="hero" className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-blue-900/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,69,19,0.15),transparent_70%)]" />
            
            <div className="relative z-10 text-center px-4 space-y-5 w-full max-w-sm mx-auto">
              {/* Mobile Premium Badge */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="bg-gradient-to-r from-fire-gold/30 to-fire-orange/30 border border-fire-gold/60 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-fire-gold animate-pulse" />
                  <span className="text-xs font-bold text-fire-gold">Evento Premium</span>
                  <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Mobile Stats Header */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-fire-orange/20 px-2 py-1 rounded-full border border-fire-orange/40">
                  <span className="text-xs font-bold text-fire-orange">Últimas Vagas</span>
                </div>
                <div className="bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/40">
                  <span className="text-xs font-bold text-purple-400">Réveillon 2025</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-2xl font-bold leading-tight drop-shadow-lg">
                  <span className="text-white block">A virada que</span>
                  <span className="text-fire-gradient block">entra para a história</span>
                  <span className="text-white/90 text-lg block mt-1">Começa no céu</span>
                </h1>
                
                <p className="text-sm text-white/90 drop-shadow-md leading-relaxed px-2">
                  Transforme o Réveillon em um espetáculo inesquecível com segurança M5 Max
                </p>
              </div>
              
              {/* Mobile Action Buttons - Réveillon Themed */}
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full h-12 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white font-semibold shadow-lg shadow-green-500/30 border border-green-400/30"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span className="text-sm">WhatsApp Direto</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3 text-green-300" />
                    <span className="text-xs text-green-300">5min</span>
                  </div>
                </Button>
                
                <Button 
                  onClick={handleOrçamentoClick}
                  className="w-full h-12 bg-gradient-to-r from-fire-gold to-fire-orange hover:from-fire-orange hover:to-fire-gold text-black font-semibold shadow-lg shadow-fire-gold/30"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Orçamento Réveillon 2025</span>
                </Button>
                
                {/* Mobile Urgency Banner */}
                <div className="bg-gradient-to-r from-fire-orange/10 to-purple-600/10 p-3 rounded-xl border border-fire-orange/30 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-fire-orange">ÚLTIMAS DATAS DISPONÍVEIS</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Reserve agora e garante o melhor Réveillon da região
                  </p>
                </div>
                
                {/* Mobile Trust Indicators */}
                <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Licenciado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">40 Anos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-fire-gold" />
                    <span className="text-xs text-fire-gold font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="timeline">
            <TimelineSection />
          </div>

          <div id="cta">
            <ReveillonCallToAction />
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonMobile;