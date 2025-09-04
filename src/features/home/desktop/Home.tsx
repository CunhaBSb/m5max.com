import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from '@features/home/desktop/components/Hero';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import LazySection from '@/shared/layout/LazySection';

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
      <Helmet>
        <title>M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais para eventos corporativos, casamentos, formaturas e festivais. 40 anos de experiência em espetáculos seguros e inesquecíveis." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, eventos corporativos, casamentos, formaturas, festivais, pirotecnia profissional" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <div id="hero">
            <Hero />
          </div>

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
