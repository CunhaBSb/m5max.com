import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from './components/Hero';
import TimelineSection from './components/TimelineSection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { LazySection } from '@/shared/layout/LazySection';
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
        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonMobile;
