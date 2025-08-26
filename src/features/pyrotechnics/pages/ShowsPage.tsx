import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import SectionSeparator from '@/shared/components/layout/SectionSeparator';
import { PyroBanner } from '../components/PyroBanner';
import { EventTypesGrid } from '../components/EventTypesGrid';
import { Differentials } from '../components/Differentials';
import { StatsSection } from '../components/StatsSection';
import { PyroCallToAction } from '../components/PyroCallToAction';

const ShowsPage = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows Pirotécnicos Profissionais - M5 Max',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Shows Pirotécnicos Profissionais | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais com equipamentos profissionais. Réveillon, casamentos, festivais e eventos corporativos. Equipe Blaster certificada e 40+ anos de experiência." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, réveillon, casamentos, festivais, eventos corporativos, pirotecnia profissional" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen bg-background">
        <div className="section-spacing">
          <PyroBanner />
        </div>
        <SectionSeparator variant="emphasis" />
        <div className="section-spacing">
          <EventTypesGrid />
        </div>
        <SectionSeparator variant="standard" />
        <div className="section-spacing">
          <Differentials />
        </div>
        <SectionSeparator variant="subtle" />
        <div className="section-spacing">
          <StatsSection />
        </div>
        <SectionSeparator variant="minimal" />
        <div className="component-spacing">
          <PyroCallToAction />
        </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ShowsPage;