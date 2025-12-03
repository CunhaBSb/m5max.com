import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from './components/Hero';
import TimelineSection from './components/TimelineSection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import FogosM5Complete from '@/shared/layout/mobile/FogosM5Complete';
import Services from '@/shared/layout/mobile/Services';
import FAQ from '@/shared/layout/mobile/FAQ';
import { buildSeo, seoReveillon } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const reveillonSeo = buildSeo(seoReveillon);

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
      <SeoHead meta={reveillonSeo} />

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
