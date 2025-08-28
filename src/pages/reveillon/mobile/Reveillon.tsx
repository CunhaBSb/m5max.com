import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';

const ReveillonMobile = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Reveillon M5 Max - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

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
          {/* Mobile Reveillon Hero - To be implemented */}
          <div id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-blue-900 to-black">
            <div className="text-center px-4">
              <h1 className="text-3xl font-bold text-white mb-4">Reveillon M5 Max</h1>
              <p className="text-white/80 mb-8">Versão Mobile em Desenvolvimento</p>
            </div>
          </div>

          {/* Mobile Timeline - To be implemented */}
          <div id="timeline" className="py-16 bg-black">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Timeline Mobile</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>

          {/* Mobile CTA - To be implemented */}
          <div id="cta" className="py-16 bg-slate-950">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Contrate Agora</h2>
              <p className="text-white/70 text-center">Em desenvolvimento...</p>
            </div>
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonMobile;