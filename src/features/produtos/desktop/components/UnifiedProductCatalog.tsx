// 🔥 M5 MAX - Catálogo Unificado de Produtos
// Componente consolidado que substitui ProductSelector, ProductCatalog e ProductTypeSelector

import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Baby, Clock, Package, FileText, Shield, Zap,
  RefreshCw, Star, ShoppingCart, Eye, CheckCircle,
  AlertTriangle, Sparkles
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useKitsFesta, useKitsChaRevelacao, useTortas } from '@/shared/hooks/useSupabaseProducts';
import { 
  CATEGORIAS_METADATA,
  formatPreco,
  type ProdutoCategoria, 
  type ProdutoUnificado, 
  isKitFesta,
  isKitChaRevelacao,
  isTorta
} from '@/shared/types/database';

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

interface UnifiedProductCatalogProps {
  className?: string;
  initialCategory?: ProdutoCategoria;
  maxProducts?: number;
  variant?: 'full' | 'compact' | 'grid';
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const UnifiedProductCatalog = ({
  className = '',
  initialCategory,
  maxProducts,
  variant = 'full'
}: UnifiedProductCatalogProps) => {

  const { openFormModal } = useAppStore();
  const { trackEvent } = useAnalytics();

  // Supabase integration com hooks especializados (sem filtros – experiência simples)
  const kitsFesta = useKitsFesta({ enableCache: true, fallbackToLocal: false });
  const kitsRevelacao = useKitsChaRevelacao({ enableCache: true, fallbackToLocal: false });
  const tortas = useTortas({ enableCache: true, fallbackToLocal: false });

  // Metadados por categoria
  const metaById = useMemo(() => ({
    kit_festa: CATEGORIAS_METADATA.find(c => c.id === 'kit_festa'),
    kit_revelacao: CATEGORIAS_METADATA.find(c => c.id === 'kit_revelacao'),
    tortas: CATEGORIAS_METADATA.find(c => c.id === 'tortas')
  }), []);

  const handleProductQuote = useCallback((produto: ProdutoUnificado) => {
    const audience = isKitFesta(produto) ? 'b2b' : 
                    isKitChaRevelacao(produto) ? 'b2c' : 
                    'b2b'; // Tortas são B2B
    
    openFormModal({
      source: 'unified_catalog',
      audience,
      page: 'produtos',
      productId: produto.id
    });

    trackEvent('add_to_cart', {
      currency: 'BRL',
      value: produto.preco ? produto.preco / 100 : 0, // Converter centavos para reais
      items: [{
        item_id: produto.id,
        item_name: produto.nome,
        item_category: produto.categoria,
        price: produto.preco ? produto.preco / 100 : 0,
        quantity: 1
      }]
    });
  }, [openFormModal, trackEvent]);

  const handleQuickQuote = useCallback((audience: 'b2b' | 'b2c' = 'b2b') => {
    openFormModal({ source: 'unified_catalog_quick', audience, page: 'produtos' });
    trackEvent('quick_quote_click', { audience });
  }, [openFormModal, trackEvent]);

  const handleQuickView = useCallback((produto: ProdutoUnificado) => {
    trackEvent('view_item', {
      currency: 'BRL',
      value: produto.preco ? produto.preco / 100 : 0,
      items: [{
        item_id: produto.id,
        item_name: produto.nome,
        item_category: produto.categoria,
        price: produto.preco ? produto.preco / 100 : 0
      }]
    });
  }, [trackEvent]);

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================
  const CategoryNav = () => (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
      <Button asChild variant="fire" size="default" className="px-5 py-2 rounded-lg">
        <a href="#kit-festa">🎉 Kit Festa</a>
      </Button>
      <Button asChild variant="tech" size="default" className="px-5 py-2 rounded-lg">
        <a href="#kit-cha-revelacao">👶 Kit Chá Revelação</a>
      </Button>
      <Button asChild variant="outline-fire" size="default" className="px-5 py-2 rounded-lg">
        <a href="#tortas">🎆 Tortas</a>
      </Button>
    </div>
  );

  const SectionHeader = ({ id, title, description }: { id: string; title?: string; description?: string }) => (
    <div id={id} className="scroll-mt-24 text-center mb-6">
      <h2 className="text-xl lg:text-2xl font-bold mb-1 text-fire-gradient">{title}</h2>
      {description && <p className="text-muted-foreground max-w-3xl mx-auto text-sm">{description}</p>}
    </div>
  );

  // removido: barra de filtros/status

  const renderProductCard = (produto: ProdutoUnificado) => {
    const isFestaKit = isKitFesta(produto);
    const isRevelacaoKit = isKitChaRevelacao(produto);
    const isTortaItem = isTorta(produto);

    return (
      <Card
        key={produto.id}
        className="group relative bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-fire-orange/50 transition-all duration-300 hover:shadow-fire hover:scale-[1.02] overflow-hidden"
      >
        {/* Popular Badge */}
        {produto.popular && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-fire-gold to-fire-orange text-black px-3 py-1 font-bold shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Mais Popular
            </Badge>
          </div>
        )}

        {/* Premium Badge */}
        {produto.premium && (
          <div className="absolute -top-2 right-4 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 font-bold shadow-lg">
              <Sparkles className="w-3 h-3 mr-1 fill-current" />
              Premium
            </Badge>
          </div>
        )}

        {/* Image */}
        <div className="w-full h-32 md:h-40">
          <img
            src={`/assets/products/${produto.id}.webp`}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/kits.show.webp'; }}
            alt={produto.nome}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <CardContent className="p-5">
          {/* Product Header */}
          <div className="text-center mb-4">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 shadow-lg transition-all duration-300 ${
              isFestaKit 
                ? 'bg-gradient-to-r from-fire-gold to-fire-orange'
                : isRevelacaoKit
                ? 'bg-gradient-to-r from-pink-500 to-blue-500'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            }`}>
              {isFestaKit ? <Package className="w-7 h-7 text-white" /> : isRevelacaoKit ? <Baby className="w-7 h-7 text-white" /> : <Sparkles className="w-7 h-7 text-white" />}
            </div>
            
            <h3 className="text-base font-bold text-foreground mb-1">
              {produto.nome}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {produto.descricao}
            </p>
          </div>

          {/* Specs */}
          <div className="space-y-2 mb-4">
            {produto.duracao && (
              <div className="flex items-center justify-between bg-accent/10 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-fire-gold" />
                  <span className="text-muted-foreground text-xs">Duração:</span>
                </div>
                <span className="text-foreground font-semibold text-xs">{produto.duracao}</span>
              </div>
            )}
            
            {!isTortaItem && (
              <div className="flex items-center justify-between bg-accent/10 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-fire-gold" />
                  <span className="text-muted-foreground text-xs">Preço:</span>
                </div>
                <span className="text-fire-gold font-bold text-xs">
                  {formatPreco(produto.preco, produto.preco_promocional)}
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {produto.inclui_instrucoes && (
              <Badge variant="outline" className="border-safety-green/50 text-safety-green text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Instruções
              </Badge>
            )}
            
            {produto.inclui_detonador && (
              <Badge variant="outline" className="border-fire-orange/50 text-fire-orange text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Detonador
              </Badge>
            )}

            {produto.inclui_controle_remoto && (
              <Badge variant="outline" className="border-tech-purple/50 text-tech-purple text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Controle Remoto
              </Badge>
            )}
            {produto.nivel_seguranca && (
              <Badge variant="outline" className="border-tech-blue/50 text-tech-blue text-xs">
                <Shield className="w-3 h-3 mr-1" />
                {produto.nivel_seguranca}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => handleProductQuote(produto)}
              variant={isFestaKit ? 'fire' : isRevelacaoKit ? 'tech' : 'outline'}
              className="w-full transition-all duration-300 font-semibold"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isTortaItem ? 'Solicitar Informações' : 'Solicitar Orçamento'}
            </Button>

            <Button
              onClick={() => handleQuickView(produto)}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="text-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
          <div className="space-y-3 mb-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================

  return (
    <section className={`section-spacing bg-background ${className}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <CategoryNav />

        {/* Kit Festa */}
        <SectionHeader id="kit-festa" title={metaById.kit_festa?.nome} description={metaById.kit_festa?.descricao} />
        {kitsFesta.loading && renderLoadingGrid()}
        {!kitsFesta.loading && kitsFesta.data && kitsFesta.data.length > 0 && (
          <div className={variant === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
            {(maxProducts ? kitsFesta.data.slice(0, maxProducts) : kitsFesta.data).map(renderProductCard)}
          </div>
        )}
        {!kitsFesta.loading && (!kitsFesta.data || kitsFesta.data.length === 0) && (
          <p className="text-center text-sm text-muted-foreground">Nenhum produto disponível no momento.</p>
        )}
        <div className="text-center mt-6">
          <Button size="sm" onClick={() => handleQuickQuote('b2b')}>Solicitar Orçamento</Button>
        </div>

        {/* Kit Chá Revelação */}
        <div className="mt-16" />
        <SectionHeader id="kit-cha-revelacao" title={metaById.kit_revelacao?.nome} description={metaById.kit_revelacao?.descricao} />
        {kitsRevelacao.loading && renderLoadingGrid()}
        {!kitsRevelacao.loading && kitsRevelacao.data && kitsRevelacao.data.length > 0 && (
          <div className={variant === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
            {(maxProducts ? kitsRevelacao.data.slice(0, maxProducts) : kitsRevelacao.data).map(renderProductCard)}
          </div>
        )}
        {!kitsRevelacao.loading && (!kitsRevelacao.data || kitsRevelacao.data.length === 0) && (
          <p className="text-center text-sm text-muted-foreground">Nenhum produto disponível no momento.</p>
        )}
        <div className="text-center mt-6">
          <Button size="sm" onClick={() => handleQuickQuote('b2c')}>Solicitar Orçamento</Button>
        </div>

        {/* Tortas */}
        <div className="mt-16" />
        <SectionHeader id="tortas" title={metaById.tortas?.nome} description={metaById.tortas?.descricao} />
        {tortas.loading && renderLoadingGrid()}
        {!tortas.loading && tortas.data && tortas.data.length > 0 && (
          <div className={variant === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
            {(maxProducts ? tortas.data.slice(0, maxProducts) : tortas.data).map(renderProductCard)}
          </div>
        )}
        {!tortas.loading && (!tortas.data || tortas.data.length === 0) && (
          <p className="text-center text-sm text-muted-foreground">Nenhum produto disponível no momento.</p>
        )}
        <div className="text-center mt-6">
          <Button size="sm" onClick={() => handleQuickQuote('b2b')}>Solicitar Orçamento</Button>
        </div>

        {/* CTA Geral */}
        <div className="text-center mt-16">
          <div className="bg-card backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-fire-orange/30 shadow-elegant">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Pronto para um orçamento?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">Conte-nos sobre seu evento e enviaremos um orçamento sob medida.</p>
            <Button onClick={() => openFormModal({ source: 'unified_catalog_footer', audience: 'b2b', page: 'produtos' })} variant="fire" size="lg" className="shadow-fire hover:scale-105 transition-bounce">
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedProductCatalog;
