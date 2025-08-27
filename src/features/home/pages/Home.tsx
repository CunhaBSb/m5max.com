import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from '@/features/home/components/Hero';
import FogosM5Complete from '@/features/home/components/FogosM5Complete';
import Services from '@/features/home/components/Services';
import FAQ from '@/features/home/components/FAQ';
import SectionSeparator from '@/shared/components/layout/SectionSeparator';

const Home = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - Shows Pirotécnicos Profissionais',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>M5 Max Produções - Shows Pirotécnicos Profissionais</title>
        <meta name="description" content="Shows pirotécnicos profissionais para eventos corporativos, casamentos, formaturas e festivais. 40 anos de experiência em espetáculos seguros e inesquecíveis." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, eventos corporativos, casamentos, formaturas, festivais, pirotecnia profissional" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <div id="hero">
            <Hero />
          </div>
          <SectionSeparator variant="curved" />
          <div id="empresa">
            <FogosM5Complete />
          </div>
          <SectionSeparator variant="vintage" />
          <div id="servicos">
            <Services />
          </div>
          <SectionSeparator variant="gradient" />
          <div id="faq">
            <FAQ />
          </div>
          <SectionSeparator variant="minimal" />
          <div id="contato">
           
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default Home;