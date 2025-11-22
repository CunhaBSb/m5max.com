import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@shared/hooks/useAnalytics';
import { createEcommerceAnalytics } from '@shared/lib/analytics';
import { useAppStore } from '@shared/store/appStore';
import RootLayout from '@app/layouts/RootLayout';
import LazySection from '@shared/layout/LazySection';
import SectionSeparator from '@shared/layout/SectionSeparator';

import ProductHero from './components/ProductHero';
import UnifiedProductCatalog from './components/UnifiedProductCatalog';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';

const Produtos = () => {
  const { trackPageView } = useAnalytics();
  const { attribution } = useAppStore();
  const [ecommerceAnalytics] = useState(() => createEcommerceAnalytics('desktop', attribution));

  useEffect(() => {
    trackPageView({
      page_title: 'Produtos - M5 Max Produções',
      page_location: window.location.href,
      page_category: 'produtos'
    });

    // Track ecommerce page view
    ecommerceAnalytics.trackPageView({
      page_title: 'Produtos E-commerce - M5 Max',
      page_location: window.location.href,
      page_category: 'ecommerce'
    });
  }, [trackPageView, ecommerceAnalytics]);

  return (
    <>
      <Helmet>
        <title>Produtos - Shows Pirotécnicos | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais: Kit Festa para casamentos e celebrações, Kit Chá Revelação para momentos especiais e Tortas Pirotécnicas para shows personalizados. 40+ anos de experiência." />
        <meta name="keywords" content="shows pirotécnicos, kit festa, chá revelação, tortas pirotécnicas, fogos de artifício, casamentos, eventos, pirotecnia profissional, M5 Max" />
        <meta property="og:title" content="Produtos - Shows Pirotécnicos | M5 Max Produções" />
        <meta property="og:description" content="Kit Festa, Kit Chá Revelação e Tortas Pirotécnicas - Shows pirotécnicos profissionais para seus momentos especiais" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://m5max.com.br/produtos" />
        
        {/* Schema.org para produtos */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Shows Pirotécnicos M5 Max",
            "description": "Kit Festa, Kit Chá Revelação e Tortas Pirotécnicas - Shows pirotécnicos profissionais",
            "itemListElement": [
              {
                "@type": "Product",
                "name": "Kit Festa",
                "description": "Shows pirotécnicos para casamentos, aniversários e celebrações",
                "brand": { "@type": "Brand", "name": "M5 Max Produções" },
                "category": "Entertainment Services"
              },
              {
                "@type": "Product", 
                "name": "Kit Chá Revelação",
                "description": "Espetáculos especiais para revelação do sexo do bebê",
                "brand": { "@type": "Brand", "name": "M5 Max Produções" },
                "category": "Entertainment Services"
              },
              {
                "@type": "Product", 
                "name": "Tortas Pirotécnicas",
                "description": "Componentes profissionais para shows personalizados",
                "brand": { "@type": "Brand", "name": "M5 Max Produções" },
                "category": "Entertainment Services"
              }
            ]
          })}
        </script>
      </Helmet>

      <RootLayout>
        <main className="min-h-screen gradient-hero">
          {/* Hero Section */}
          <div id="hero-produtos">
            <ProductHero />
          </div>

          <SectionSeparator variant="fire-line" spacing="lg" />
          
          {/* Unified Product Catalog */}
          <LazySection>
            <div id="catalogo-produtos">
              <UnifiedProductCatalog 
                showCategorySelector={true}
                showFilters={true}
                showSearch={true}
                variant="full"
              />
            </div>
          </LazySection>

          <SectionSeparator variant="fire-line" spacing="lg" />
          
          {/* Empresa Section */}
          <LazySection>
            <div id="empresa">
              <FogosM5Complete />
            </div>
          </LazySection>

          <SectionSeparator variant="ember-glow" spacing="md" />

          {/* Services Section */}
          <LazySection>
            <div id="servicos">
              <Services />
            </div>
          </LazySection>

          <SectionSeparator variant="sparkle" spacing="lg" />

          {/* FAQ Section */}
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

export default Produtos;