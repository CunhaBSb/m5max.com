import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import ReveillonHero from '@features/reveillon/desktop/components/ReveillonHero';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import TimelineSection from '@features/reveillon/desktop/components/TimelineSection';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';

const ReveillonDesktop = () => {
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
        <meta name="description" content="Shows pirotécnicos espetaculares para Réveillon 2025. Múltiplos pontos de queima e segurança certificada. Faça seu evento ser inesquecível." />
        <meta name="keywords" content="réveillon 2025, shows pirotécnicos, fogos de artifício, virada do ano, festa de ano novo, pirotecnia" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <ReveillonHero />

          {/* Section Separator */}
          <div className="relative h-8 overflow-hidden">
            <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60"></div>
          </div>

          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          {/* Section Separator */}
          <div className="relative h-8 overflow-hidden">
            <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60"></div>
          </div>

          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

          {/* Section Separator */}
          <div className="relative h-8 overflow-hidden">
            <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60"></div>
          </div>

          <LazySection>
            <div id="como-funciona">
              <TimelineSection />
            </div>
          </LazySection>

          {/* Section Separator */}
          <div className="relative h-8 overflow-hidden">
            <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60"></div>
          </div>

          <LazySection>
            <div id="faq">
              <FAQ />
            </div>
          </LazySection>

          {/* Section Separator */}
          <div className="relative h-8 overflow-hidden">
            <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60"></div>
          </div>

          <LazySection>

          </LazySection>

        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonDesktop;
