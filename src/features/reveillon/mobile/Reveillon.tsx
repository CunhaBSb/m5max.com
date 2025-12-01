import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from '@features/reveillon/mobile/components/Hero';
import TimelineSection from '@features/reveillon/mobile/components/TimelineSection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import FogosM5Complete from '@/shared/layout/mobile/FogosM5Complete';
import Services from '@/shared/layout/mobile/Services';
import FAQ from '@/shared/layout/mobile/FAQ';

const ReveillonMobile = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Réveillon 2025 | Espetáculo de Luz (Mobile)',
      page_location: window.location.href,
      page_category: 'reveillon'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Réveillon 2025 | Espetáculo de Luz Autorizado</title>
        <meta name="description" content="Show visual sincronizado para Réveillon em Brasília. Projeto técnico, licenças e seguro incluídos para clubes e eventos." />
        <meta name="keywords" content="réveillon 2025, espetáculo de luz, efeitos sincronizados, show visual, virada do ano, eventos brasília" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <Hero />

          <SectionSeparator variant="fire-line" spacing="lg" />

          <div id="empresa">
            <FogosM5Complete />
          </div>

          <SectionSeparator variant="ember-glow" spacing="md" />

          <div id="servicos">
            <Services />
          </div>

          <SectionSeparator variant="sparkle" spacing="lg" />

          <div id="como-funciona">
            <TimelineSection />
          </div>

          <SectionSeparator variant="gradient-wave" spacing="md" />

          <div id="faq">
            <FAQ />
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonMobile;
