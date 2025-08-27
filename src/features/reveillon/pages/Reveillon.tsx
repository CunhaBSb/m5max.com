import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import ReveillonHero from '../components/ReveillonHero';
import TimelineSection from '../components/TimelineSection';
import ReveillonCallToAction from '../components/ReveillonCallToAction';

const Reveillon = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows de Réveillon 2025 | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Shows de Réveillon 2025 | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos espetaculares para Réveillon 2025. Sincronização musical, múltiplos pontos de queima e segurança certificada. Faça seu evento ser inesquecível." />
        <meta name="keywords" content="réveillon 2025, shows pirotécnicos, fogos de artifício, virada do ano, festa de ano novo, pirotecnia" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <ReveillonHero />


          <TimelineSection />

          <ReveillonCallToAction />
        </main>
      </RootLayout>
    </>
  );
};

export default Reveillon;