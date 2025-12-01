import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import ReveillonHero from './components/ReveillonHero';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import TimelineSection from './components/TimelineSection';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';
import SectionSeparator from '@/shared/layout/SectionSeparator';

const ReveillonDesktop = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Réveillon 2025 | Espetáculo de Luz (Desktop)',
      page_location: window.location.href,
      page_category: 'reveillon'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Réveillon 2025 | Espetáculo de Luz Autorizado</title>
        <meta name="description" content="Espetáculo de luz e efeitos sincronizados para Réveillon 2025 em Brasília. Projeto técnico, licenças e seguro inclusos para clubes e eventos." />
        <meta name="keywords" content="réveillon 2025, espetáculo de luz, efeitos sincronizados, show visual, virada do ano, evento corporativo" />
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
