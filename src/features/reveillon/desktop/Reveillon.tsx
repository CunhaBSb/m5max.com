import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import ReveillonHero from '@features/reveillon/desktop/components/ReveillonHero';
import FogosM5Complete from '@features/reveillon/desktop/components/FogosM5Complete';
import TimelineSection from '@features/reveillon/desktop/components/TimelineSection';
import Services from '@features/reveillon/desktop/components/Services';
import FAQ from '@features/reveillon/desktop/components/FAQ';
import LazySection from '@/shared/layout/LazySection';

const ReveillonDesktop = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows de Réveillon 2025 | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Shows de Réveillon 2025 | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos espetaculares para Réveillon 2025. Múltiplos pontos de queima e segurança certificada. Faça seu evento ser inesquecível." />
        <meta name="keywords" content="réveillon 2025, shows pirotécnicos, fogos de artifício, virada do ano, festa de ano novo, pirotecnia" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <ReveillonHero />

          {/* Separador decorativo - Hero para Empresa */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent"></div>

          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          {/* Separador decorativo - Empresa para Timeline */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-gold/30 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm"></div>
          </div>

          {/* Separador decorativo - Timeline para Serviços */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/25 to-transparent"></div>

          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

          {/* Separador decorativo - Serviços para FAQ */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent"></div>

          {/* Separador decorativo - FAQ para Lead Magnet */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/15 to-transparent"></div>

          <LazySection>
            <div id="como-funciona">
              <TimelineSection />
            </div>
          </LazySection>

          {/* Separador decorativo - Como Funciona para FAQ */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-gold/25 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent blur-sm"></div>
          </div>

          <LazySection>
            <div id="faq">
              <FAQ />
            </div>
          </LazySection>

          {/* Separador decorativo - FAQ para Rodapé */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent blur-sm"></div>
          </div>

        </main>
      </RootLayout>
    </>
  );
};

export default ReveillonDesktop;