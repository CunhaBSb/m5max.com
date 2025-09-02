import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import Hero from '@features/home/desktop/components/Hero';
import FogosM5Complete from '@features/home/desktop/components/FogosM5Complete';
import TimelineSection from '@features/home/desktop/components/TimelineSection';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@features/home/desktop/components/FAQ';
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

          {/* Harmonized Separator - Hero to Company */}
          <div className="relative h-16 overflow-hidden">
            {/* Primary separation line */}
            <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/25 to-transparent"></div>
            
            {/* Ambient transition gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background/50"></div>
            
            {/* Subtle depth effects */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/60 to-transparent"></div>
            
            {/* Side accent gradients */}
            <div className="absolute top-4 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-fire-orange/8 to-transparent blur-lg"></div>
          </div>
          
          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          {/* Enhanced Separator - Company to Services */}
          <div className="relative h-20 overflow-hidden">
            {/* Primary separation line */}
            <div className="absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/30 to-transparent"></div>
            <div className="absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm"></div>
            
            {/* Ambient transition gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/40"></div>
            
            {/* Enhanced depth effects */}
            <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-background/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-background/70 to-transparent"></div>
            
            {/* Multiple accent gradients for richness */}
            <div className="absolute top-6 left-1/3 w-1/3 h-3 bg-gradient-to-r from-transparent via-fire-gold/10 to-transparent blur-lg"></div>
            <div className="absolute bottom-6 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-fire-orange/6 to-transparent blur-lg"></div>
            
            {/* Side depth enhancements */}
            <div className="absolute top-5 left-0 w-1/4 h-10 bg-gradient-to-br from-background/50 to-transparent"></div>
            <div className="absolute top-5 right-0 w-1/4 h-10 bg-gradient-to-bl from-background/50 to-transparent"></div>
          </div>

          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

          {/* Professional Separator - Services to FAQ */}
          <div className="relative h-18 overflow-hidden">
            {/* Primary separation line */}
            <div className="absolute top-9 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/25 to-transparent"></div>
            
            {/* Ambient transition gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/75 to-background/45"></div>
            
            {/* Depth effects */}
            <div className="absolute top-0 left-0 w-full h-9 bg-gradient-to-b from-background/65 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-9 bg-gradient-to-t from-background/65 to-transparent"></div>
            
            {/* Accent gradient */}
            <div className="absolute top-7 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-fire-orange/8 to-transparent blur-lg"></div>
            
            {/* Side gradients */}
            <div className="absolute top-4 left-0 w-1/5 h-10 bg-gradient-to-br from-background/45 to-transparent"></div>
            <div className="absolute top-4 right-0 w-1/5 h-10 bg-gradient-to-bl from-background/45 to-transparent"></div>
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