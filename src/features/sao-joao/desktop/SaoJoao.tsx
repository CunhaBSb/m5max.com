import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import SaoJoaoHeroDesktop from '../components/SaoJoaoHeroDesktop';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { buildSeo, seoSaoJoao } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const seo = buildSeo(seoSaoJoao);

const SaoJoao = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - São João',
      page_location: window.location.href,
      page_category: 'sao-joao'
    });
  }, [trackPageView]);

  return (
    <>
      <SeoHead meta={seo} />

      <RootLayout>
        <main className="min-h-screen">
          <div id="hero">
            <SaoJoaoHeroDesktop />
          </div>

          <SectionSeparator variant="fire-line" spacing="lg" />
          
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

export default SaoJoao;
