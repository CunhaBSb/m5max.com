import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { KitsMainContent } from '../components/KitsMainContent';

const KitsDIYPage = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Kits DIY de Fogos de Artifício | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'kits'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Kits DIY de Fogos de Artifício | M5 Max Produções</title>
        <meta name="description" content="Kits DIY certificados para suas festas caseiras. Réveillon, aniversários e confraternizações. Produtos seguros com instruções completas." />
        <meta name="keywords" content="kits fogos artifício, fogos caseiros, réveillon casa, aniversário fogos, DIY pirotecnia" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="section-spacing">
          <KitsMainContent />
        </div>
      </main>
    </>
  );
};

export default KitsDIYPage;