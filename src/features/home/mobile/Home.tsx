import { useEffect } from 'react';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import RootLayout from '@/app/layouts/RootLayout';
import FogosM5Complete from '@/shared/layout/mobile/FogosM5Complete';
import Services from '@/shared/layout/mobile/Services';
import FAQ from '@/shared/layout/mobile/FAQ';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import Hero from './components/Hero';
import { buildSeo, seoHome } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const homeSeo = buildSeo(seoHome);

const HomeMobile = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { openFormModal, attribution } = useAppStore();

  useEffect(() => {
    trackPageView({
      page_title: 'M5 Max Produções - Mobile',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  const handleOrçamentoClick = () => {
    openFormModal({
      source: 'hero_mobile',
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
      <SeoHead meta={homeSeo} />

      <RootLayout>
        <main className="min-h-screen">
          <Hero />

          <SectionSeparator variant="sparkle-trail" spacing="md" />

          <div id="empresa">
            <FogosM5Complete />
          </div>

          <SectionSeparator variant="gradient-wave" spacing="sm" />

          <div id="servicos">
            <Services />
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
