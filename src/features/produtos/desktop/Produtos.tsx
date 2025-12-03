import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '@shared/hooks/useAnalytics';
import { useAppStore } from '@shared/store/appStore';
import RootLayout from '@app/layouts/RootLayout';
import LazySection from '@shared/layout/LazySection';
import SectionSeparator from '@shared/layout/SectionSeparator';

import ProductHero from './components/ProductHero';
import UnifiedProductCatalog from './components/UnifiedProductCatalog';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import Services from '@/shared/layout/desktop/Services';
import FAQ from '@/shared/layout/desktop/FAQ';
import { buildSeo, seoProdutos } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const produtosSeo = buildSeo(seoProdutos);

const Produtos = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Produtos - M5 Max Produções',
      page_location: window.location.href,
      page_category: 'produtos'
    });
  }, [trackPageView]);

  return (
    <>
      <SeoHead meta={produtosSeo} />

      <Helmet>
        {/* Schema.org para produtos */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Shows Pirotécnicos M5 Max',
            description:
              'Kits para celebrações e shows sob medida para empresas, prefeituras e resorts.',
            itemListElement: [
              {
                '@type': 'Product',
                name: 'Kit Festa',
                description: 'Shows pirotécnicos para casamentos, aniversários e celebrações',
                brand: { '@type': 'Brand', name: 'M5 Max Produções' },
                category: 'Entertainment Services',
              },
              {
                '@type': 'Product',
                name: 'Kit Chá Revelação',
                description: 'Espetáculos especiais para revelação do sexo do bebê',
                brand: { '@type': 'Brand', name: 'M5 Max Produções' },
                category: 'Entertainment Services',
              },
              {
                '@type': 'Product',
                name: 'Tortas Pirotécnicas',
                description: 'Componentes profissionais para shows personalizados',
                brand: { '@type': 'Brand', name: 'M5 Max Produções' },
                category: 'Entertainment Services',
              },
            ],
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
          
          {/* Expertise section must render immediately for the CTA anchor */}
          <div id="empresa">
            <FogosM5Complete />
          </div>

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
