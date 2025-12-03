import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import ReveillonHero from './components/ReveillonHero';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import TimelineSection from './components/TimelineSection';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { buildSeo, seoReveillon } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const reveillonSeo = buildSeo(seoReveillon);

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
      <SeoHead meta={reveillonSeo} />

      <RootLayout>
        <main className="min-h-screen">
          <ReveillonHero />

          <SectionSeparator variant="fire-line" spacing="lg" />

          {/* Expertise section must be present immediately for the CTA anchor */}
          <div id="empresa">
            <FogosM5Complete />
          </div>

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
