import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';

const ShowsPageMobile = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows Pirotécnicos M5 Max - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Shows Pirotécnicos M5 Max - Espetáculos Profissionais</title>
        <meta name="description" content="Shows pirotécnicos profissionais para todos os tipos de eventos. Tecnologia de ponta, segurança certificada e espetáculos inesquecíveis." />
        <meta name="keywords" content="shows pirotécnicos, espetáculos, fogos de artifício, eventos, pirotecnia profissional, tecnologia" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          {/* Mobile Pyro Hero - To be implemented */}
          <div id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-900 via-red-900 to-black">
            <div className="text-center px-4">
              <h1 className="text-3xl font-bold text-white mb-4">Shows Pirotécnicos</h1>
              <p className="text-white/80 mb-8">Versão Mobile em Desenvolvimento</p>
            </div>
          </div>

          {/* Mobile Event Types - To be implemented */}
          <div id="event-types" className="py-16 bg-black">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Tipos de Eventos</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>

          {/* Mobile Stats - To be implemented */}
          <div id="stats" className="py-16 bg-slate-950">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Estatísticas</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>

          {/* Mobile CTA - To be implemented */}
          <div id="cta" className="py-16 bg-black">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Solicite um Orçamento</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ShowsPageMobile;