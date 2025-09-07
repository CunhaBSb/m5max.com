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
import SectionSeparator from '@/shared/layout/SectionSeparator';

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

          <SectionSeparator variant="fire-line" spacing="lg" />

          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          <SectionSeparator variant="ember-glow" spacing="md" />

          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

          <SectionSeparator variant="sparkle" spacing="lg" />

          <LazySection>
            <div id="como-funciona">
              <TimelineSection />
            </div>
          </LazySection>

          <SectionSeparator variant="gradient-wave" spacing="md" />

          <LazySection>
            <div id="faq">
              <FAQ />
            </div>
          </LazySection>

          <SectionSeparator variant="geometric-pattern" spacing="lg" />

        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonDesktop;
