import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from '@/pages/home/desktop/components/Hero';
import FogosM5Complete from '@/shared/components/layout/FogosM5Complete';
import Services from '@/pages/home/desktop/components/Services';
import FAQ from '@/pages/home/desktop/components/FAQ';

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

          {/* Separador decorativo - Hero para Empresa */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>
          
          <div id="empresa">
            <FogosM5Complete />
          </div>

          {/* Separador decorativo - Empresa para Serviços */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-gold/30 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm"></div>
          </div>

          <div id="servicos">
            <Services />
          </div>

          {/* Separador decorativo - Serviços para FAQ */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/25 to-transparent"></div>

          <div id="faq">
            <FAQ />
          </div>

          <div id="contato">
           
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default Home;