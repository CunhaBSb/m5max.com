import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import FogosM5Complete from '@/shared/components/layout/FogosM5Complete';

const HomeMobile = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais para eventos corporativos, casamentos, formaturas e festivais. 40 anos de experiência em espetáculos seguros e inesquecíveis." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, eventos corporativos, casamentos, formaturas, festivais, pirotecnia profissional" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          {/* Mobile Hero */}
          <div id="hero" className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14">
            <div className="text-center px-4 space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-white font-semibold text-xs bg-red-500/20 px-3 py-1 rounded-full backdrop-blur-sm border border-red-400/40">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Shows Pirotécnicos
                </div>
                
                <h1 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-lg">
                  <span className="text-white">Shows Pirotécnicos</span>
                  <br />
                  <span className="text-fire-gradient">Profissionais</span>
                </h1>
                
                <p className="text-sm sm:text-base text-white/90 drop-shadow-md">
                  4 décadas de experiência garantindo shows espetaculares e 100% seguros
                </p>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 max-w-sm mx-auto">
                <button className="flex items-center justify-center gap-2 w-full text-base font-semibold bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors">
                  <span className="text-lg">💬</span>
                  WhatsApp - Resposta Imediata
                </button>
                
                <button className="flex items-center justify-center gap-2 w-full text-base font-semibold bg-fire-orange hover:bg-fire-orange/90 text-white py-3 px-4 rounded-lg transition-colors">
                  <span className="text-lg">📅</span>
                  Solicitar Orçamento Completo
                </button>

                {/* Mobile Video Button */}
                <button className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-600/30 text-white backdrop-blur-md py-3 px-4 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                    <span className="text-black text-lg">▶</span>
                  </div>
                  <span className="text-sm font-semibold">Ver Nossa Expertise</span>
                </button>
              </div>
            </div>
          </div>

          <div id="empresa">
            <FogosM5Complete />
          </div>

          {/* Mobile Services - To be implemented */}
          <div id="servicos" className="py-16 bg-black">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Serviços Mobile</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>

          {/* Mobile FAQ - To be implemented */}
          <div id="faq" className="py-16 bg-slate-950">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ Mobile</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>

          <div id="contato">
            {/* Contact section will be shared */}
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default HomeMobile;