import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import FogosM5Complete from '@/shared/layout/mobile/FogosM5Complete';
import Services from '@/shared/layout/mobile/Services';
import FAQ from '@/shared/layout/mobile/FAQ';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { LazySection } from '@/shared/layout/LazySection';
import SaoJoaoHeroMobile from '../components/SaoJoaoHeroMobile';
import { buildSeo, seoSaoJoao } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const seo = buildSeo(seoSaoJoao);

const SaoJoaoMobile = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - São João - Mobile',
      page_location: window.location.href,
      page_category: 'sao-joao'
    });
  }, [trackPageView]);

  return (
    <>
      <SeoHead meta={seo} />

      <RootLayout>
        <main className="min-h-screen">
          <SaoJoaoHeroMobile />

          <SectionSeparator variant="sparkle-trail" spacing="md" />

          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          <SectionSeparator variant="gradient-wave" spacing="sm" />

          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

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

export default SaoJoaoMobile;
