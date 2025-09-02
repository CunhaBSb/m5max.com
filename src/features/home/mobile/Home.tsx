import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import RootLayout from '@/app/layouts/RootLayout';
import FogosM5Complete from './components/FogosM5Complete';
import { ServicesMobile } from '@/shared/layout';
import FAQ from './components/FAQ';
import Hero from './components/Hero';

const HomeMobile = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { openConversionModal, attribution } = useAppStore();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  const handleOrçamentoClick = () => {
    openConversionModal({
      source: 'hero_mobile',
      audience: 'b2b',
      page: 'home',
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2b', source: 'hero_mobile' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'hero_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais para eventos corporativos, casamentos, formaturas e festivais. 40 anos de experiência em espetáculos seguros e inesquecíveis." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, eventos corporativos, casamentos, formaturas, festivais, pirotecnia profissional" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen">
          <Hero handleWhatsAppClick={handleWhatsAppClick} handleOrçamentoClick={handleOrçamentoClick} />

          <div id="empresa">
            <FogosM5Complete />
          </div>

          <div id="servicos">
            <ServicesMobile />
          </div>

          <div id="faq">
            <FAQ />
          </div>

          <div id="contato">
            {/* Contact section will be shared */}
          </div>
        </main>
      </RootLayout>
    </>
  );
};

export default HomeMobile;
