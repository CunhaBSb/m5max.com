import { useState } from 'react';
import { Heart, Baby, Star, Clock, Users, DollarSign } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { 
  CATEGORIAS_METADATA,
  formatPreco,
  type ProdutoUnificado,
  type CategoriasProduto
} from '@/shared/types/database';
import { useKitsFesta, useKitsChaRevelacao } from '@/shared/hooks/useSupabaseProducts';

const ProductSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoriasProduto>('kit_festa');
  const { openFormModal } = useAppStore();
  const { trackEvent } = useAnalytics();

  // Hooks do Supabase
  const { data: kitsFesta, loading: loadingKitsFesta, error: errorKitsFesta, refetch: refetchFesta } = useKitsFesta({ fallbackToLocal: false });
  const { data: kitsChaRevelacao, loading: loadingKitsCha, error: errorKitsCha, refetch: refetchCha } = useKitsChaRevelacao({ fallbackToLocal: false });

  const handleCategoryChange = (category: CategoriasProduto) => {
    setSelectedCategory(category);
    trackEvent('category_select', {
      category,
      source: 'product_selector_mobile'
    });
  };

  const handleProductQuote = (produto: ProdutoUnificado) => {
    const audience = selectedCategory === 'kit_festa' ? 'b2b' : 'b2c';
    
    openFormModal({
      source: 'product_selector_mobile',
      audience,
      page: 'produtos',
      productId: produto.id
    });

    trackEvent('product_quote_request', {
      product_id: produto.id,
      product_name: produto.nome,
      category: selectedCategory,
      source: 'selector_card_mobile'
    });
  };

  // Lógica de produtos baseada na categoria selecionada
  const selectedProducts = selectedCategory === 'kit_festa' ? kitsFesta : kitsChaRevelacao;
  const isLoading = selectedCategory === 'kit_festa' ? loadingKitsFesta : loadingKitsCha;
  const error = selectedCategory === 'kit_festa' ? errorKitsFesta : errorKitsCha;
  const categoryInfo = CATEGORIAS_METADATA[selectedCategory];

  return (
    <section className="py-12 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-sm mx-auto px-4">
        {/* Section Header - Mobile */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">
            Nossos Produtos Premium
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Cada kit é uma obra de arte pirotécnica, desenvolvida com 40 anos de experiência para criar momentos únicos
          </p>
        </div>

        {/* Category Tabs - Mobile Vertical */}
        <div className="flex flex-col gap-2.5 mb-6">
          {Object.entries(CATEGORIAS_METADATA).map(([categoriaId, categoria]) => (
            <button
              key={categoriaId}
              onClick={() => handleCategoryChange(categoriaId as CategoriasProduto)}
              className={`flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                selectedCategory === categoriaId
                  ? `bg-gradient-to-r ${categoria.cor} text-white shadow-lg`
                  : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-2xl">{categoria.icone}</span>
              <span className="font-semibold text-base">{categoria.nome}</span>
            </button>
          ))}
        </div>

        {/* Category Description - Mobile */}
        {categoryInfo && (
          <div className="text-center mb-10">
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-fire-orange/20">
              <p className="text-white/70 leading-relaxed">
                {categoryInfo.descricao}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-fire-gold"></div>
            <p className="text-white/60 mt-3 text-sm">Carregando produtos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-2">Erro ao carregar produtos</p>
            <p className="text-white/60 text-xs mb-3">Verifique sua conexão e tente novamente</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (selectedCategory === 'kit_festa' ? refetchFesta() : refetchCha())}
            >
              Recarregar
            </Button>
          </div>
        )}

        {/* Products Grid - Mobile Single Column */}
        {!isLoading && !error && selectedProducts && (
          <div className="space-y-4">
            {selectedProducts.map((produto) => (
            <div
              key={produto.id}
              className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-5 border border-fire-orange/20 hover:border-fire-gold/50 transition-all duration-300 shadow"
            >
              {/* Destaque Badge - Mobile */}
              {produto.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-fire-gold to-fire-orange text-black px-3 py-1 font-bold">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {/* Product Header - Mobile */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  selectedCategory === 'kit_festa' 
                    ? 'bg-gradient-to-r from-fire-gold to-fire-orange'
                    : 'bg-gradient-to-r from-pink-500 to-blue-500'
                }`}>
                  {selectedCategory === 'kit_festa' ? (
                    <Heart className="w-8 h-8 text-white" />
                  ) : (
                    <Baby className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1.5">{produto.nome}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{produto.descricao}</p>
              </div>

              {/* Product Details - Mobile Enhanced */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-fire-gold" />
                    <span className="text-white/80 text-xs font-medium">Duração:</span>
                  </div>
                  <span className="text-white font-bold text-xs">{produto.duracao || '≈ 60 segundos'}</span>
                </div>
                
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-fire-gold" />
                    <span className="text-white/80 text-xs font-medium">Preço:</span>
                  </div>
                  <span className="text-fire-gold font-bold text-base">
                    {formatPreco(produto.preco, produto.preco_promocional)}
                  </span>
                </div>
              </div>

              {/* Características - Mobile */}
              {produto.incluso && produto.incluso.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-bold mb-3">Incluso:</h4>
                  <ul className="space-y-2">
                    {produto.incluso.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-white/80">
                        <div className="w-1.5 h-1.5 bg-fire-gold rounded-full flex-shrink-0 mt-2" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                    {produto.incluso.length > 3 && (
                      <li className="text-sm text-white/50 font-medium pl-3">
                        +{produto.incluso.length - 3} outros itens premium
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* CTA Button - Mobile Enhanced */}
              <Button
                onClick={() => handleProductQuote(produto)}
                className={`w-full py-2.5 font-semibold transition-all duration-300 group relative overflow-hidden ${
                  produto.popular
                    ? 'bg-gradient-to-r from-fire-gold to-fire-orange hover:from-fire-orange hover:to-fire-gold text-black shadow-lg'
                    : selectedCategory === 'kit_festa'
                    ? 'bg-gradient-to-r from-fire-gold/80 to-fire-orange/80 hover:from-fire-gold hover:to-fire-orange text-white border border-fire-gold/50'
                    : 'bg-gradient-to-r from-pink-500/80 to-blue-500/80 hover:from-pink-500 hover:to-blue-500 text-white'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                Solicitar Orçamento Premium
              </Button>

              {!produto.ativo && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-white font-bold">Em Breve</p>
                    <p className="text-white/60 text-sm">Produto em desenvolvimento</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}

        {/* Bottom CTA Section - Mobile Enhanced */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-fire-orange/30 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Criamos espetáculos pirotécnicos personalizados para qualquer tipo de evento. Com 40 anos de experiência, transformamos sua visão em realidade.
            </p>
            <Button
              onClick={() => openFormModal({
                source: 'custom_request_mobile',
                audience: 'b2c',
                page: 'produtos'
              })}
              variant="outline"
              className="border-2 border-fire-gold text-fire-gold hover:bg-fire-gold hover:text-black w-full py-3 font-bold"
            >
              Solicitar Show Personalizado
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSelector;
