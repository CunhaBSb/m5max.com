import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from './components/Hero';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { buildSeo, seoHome } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const homeSeo = buildSeo(seoHome);

const Home = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <SeoHead meta={homeSeo} />

      <RootLayout>
        <main className="min-h-screen">
          <div id="hero">
            <Hero />
          </div>

          <SectionSeparator variant="fire-line" spacing="lg" />
          
          {/* Expertise section needs to exist on first paint for the Hero CTA anchor */}
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
            <div id="faq">
              <FAQ />
            </div>
          </LazySection>
        </main>
      </RootLayout>
    </>
  );
};

export default Home;
