import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import RootLayout from '@/app/layouts/RootLayout';
import SectionSeparator from '@/shared/layout/SectionSeparator';

import ProductHero from './components/ProductHero';
import ProductSelector from './components/ProductSelector';
import TrustIndicators from './components/TrustIndicators';
import PricingSection from './components/PricingSection';

const ProdutosMobile = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { openFormModal, attribution } = useAppStore();

  useEffect(() => {
    trackPageView({
      page_title: 'Produtos - M5 Max Produções - Mobile',
      page_location: window.location.href,
      page_category: 'produtos'
    });
  }, [trackPageView]);

  const handleOrçamentoClick = () => {
    openFormModal({
      source: 'produtos_mobile',
      audience: 'b2c',
      page: 'produtos',
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2c');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2c', source: 'produtos_mobile' }
    );

    trackWhatsAppClick({
      audience: 'b2c',
      source: 'produtos_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Produtos - Shows Pirotécnicos | M5 Max Produções</title>
        <meta name="description" content="Escolha o show pirotécnico perfeito: Kit Festa para casamentos e eventos ou Kit Chá Revelação para momentos especiais. 40+ anos de experiência." />
        <meta name="keywords" content="shows pirotécnicos, kit festa, chá revelação, fogos de artifício, casamentos, eventos, pirotecnia profissional" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Produtos - Shows Pirotécnicos | M5 Max Produções" />
        <meta property="og:description" content="Kit Festa e Kit Chá Revelação - Shows pirotécnicos profissionais para seus momentos especiais" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <ProductHero />

          <SectionSeparator variant="sparkle-trail" spacing="md" />

          <div id="seletor-produtos">
            <ProductSelector />
          </div>

          <SectionSeparator variant="gradient-wave" spacing="sm" />

          <div id="confianca">
            <TrustIndicators />
          </div>

          <SectionSeparator variant="sparkle-trail" spacing="md" />

          <div id="precos">
            <PricingSection />
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ProdutosMobile;