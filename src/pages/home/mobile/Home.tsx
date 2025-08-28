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
          {/* Mobile Hero - To be implemented */}
          <div id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
            <div className="text-center px-4">
              <h1 className="text-3xl font-bold text-white mb-4">M5 Max Produções</h1>
              <p className="text-white/80 mb-8">Versão Mobile em Desenvolvimento</p>
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