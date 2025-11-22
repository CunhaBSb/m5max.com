import { useMemo, useState } from 'react';
import { MessageCircle, FileText, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { useKitsFesta, useKitsChaRevelacao } from '@/shared/hooks/useSupabaseProducts';
import { formatPrecoRange } from '@/shared/types/database';

const PricingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<'kit_festa' | 'kit_revelacao'>('kit_festa');
  const { openFormModal, attribution } = useAppStore();
  const { trackEvent, trackWhatsAppClick } = useAnalytics();
  const { data: kitsFesta } = useKitsFesta({ fallbackToLocal: false });
  const { data: kitsCha } = useKitsChaRevelacao({ fallbackToLocal: false });

  const handleQuoteRequest = () => {
    const audience = selectedCategory === 'kit_festa' ? 'b2b' : 'b2c';
    
    openFormModal({
      source: 'pricing_section_mobile',
      audience,
      page: 'produtos',
      productId: undefined
    });

    trackEvent('pricing_quote_request', {
      category: selectedCategory,
      product_id: undefined,
      source: 'pricing_cta_mobile'
    });
  };

  const handleWhatsAppClick = () => {
    const audience = selectedCategory === 'kit_festa' ? 'b2b' : 'b2c';
    const message = getWhatsAppMessage(audience);
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience, source: 'pricing_whatsapp_mobile' }
    );

    trackWhatsAppClick({
      audience,
      source: 'pricing_whatsapp_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  const { minPrice, maxPrice } = useMemo(() => {
    const products = selectedCategory === 'kit_festa' ? kitsFesta : kitsCha;
    const prices = (products || [])
      .map(p => p.preco)
      .filter((v): v is number => typeof v === 'number');
    if (prices.length === 0) return { minPrice: null as number | null, maxPrice: null as number | null };
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [selectedCategory, kitsFesta, kitsCha]);

  const pricingFactors = [
    {
      icon: Users,
      title: 'Tamanho do Público',
      description: 'Número de convidados determina a escala do espetáculo pirotécnico'
    },
    {
      icon: Calendar,
      title: 'Data do Evento',
      description: 'Datas especiais como Réveillon podem ter preços diferenciados'
    },
    {
      icon: MapPin,
      title: 'Localização Premium',
      description: 'Distância e logística de montagem do local'
    },
    {
      icon: FileText,
      title: 'Personalização Total',
      description: 'Efeitos especiais e cores personalizadas para seu evento'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-sm mx-auto px-4">
        {/* Section Header - Mobile */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">
            Preços e Orçamentos Premium
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Transparência total em nossos preços e orçamentos personalizados para cada necessidade
          </p>
        </div>

        {/* Category Tabs - Mobile Vertical */}
        <div className="flex flex-col gap-2.5 mb-6">
          <button
            onClick={() => setSelectedCategory('kit_festa')}
            className={`flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
              selectedCategory === 'kit_festa'
                ? 'bg-gradient-to-r from-fire-gold to-fire-orange text-black shadow-lg font-bold'
                : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-2xl">🎉</span>
            <span className="font-semibold text-lg">Kit Festa</span>
          </button>
          <button
            onClick={() => setSelectedCategory('kit_revelacao')}
            className={`flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
              selectedCategory === 'kit_revelacao'
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg font-bold'
                : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-2xl">👶</span>
            <span className="font-semibold text-lg">Kit Chá Revelação</span>
          </button>
        </div>

        {/* Price Range Overview - Mobile */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-fire-orange/30">
            <h3 className="text-lg font-bold text-white mb-3">
              Faixa de Preços - {selectedCategory === 'kit_festa' ? 'Kit Festa Premium' : 'Kit Chá Revelação Especial'}
            </h3>
            <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">
              {minPrice === null || maxPrice === null ? 'Sob consulta' : formatPrecoRange([minPrice, maxPrice])}
            </div>
            <p className="text-white/70 mb-4 text-xs leading-relaxed">
              {selectedCategory === 'kit_festa' 
                ? 'Para casamentos de sonho, aniversários memoráveis e celebrações que merecem o melhor'
                : 'Para revelação do sexo do bebê com fogos coloridos exclusivos e momentos únicos'
              }
            </p>
            <Badge variant="outline" className="border-fire-gold text-fire-gold px-4 py-1 font-bold">
              Orçamento personalizado 100% gratuito
            </Badge>
          </div>
        </div>

        {/* CTA Simples - foco em conversão rápida */}
        <div className="space-y-6 mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-fire-orange/30 text-center">
            <h4 className="text-white font-bold mb-2">Receba um orçamento personalizado</h4>
            <p className="text-white/70 text-sm mb-4">Resposta rápida pela nossa equipe</p>
            <Button
              onClick={handleQuoteRequest}
              className="w-full py-3 font-bold transition-all duration-300 bg-gradient-to-r from-fire-gold to-fire-orange hover:from-fire-orange hover:to-fire-gold text-black"
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>

        {/* Pricing Factors - Mobile 2x2 Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Como Calculamos Seu Orçamento?
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Diversos fatores são considerados para criar o orçamento perfeito para seu evento
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {pricingFactors.map((factor, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-fire-orange/20 to-fire-gold/20 border border-fire-orange/40 mb-3">
                  <factor.icon className="w-6 h-6 text-fire-gold" />
                </div>
                <h4 className="text-white font-bold mb-2 text-sm">{factor.title}</h4>
                <p className="text-white/70 text-xs leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Mobile */}
        <div className="bg-gradient-to-r from-fire-orange/10 to-fire-gold/10 border border-fire-orange/30 rounded-xl p-6 text-center backdrop-blur-md">
          <h3 className="text-xl font-bold text-white mb-4">
            Pronto para Seu Orçamento?
          </h3>
          <p className="text-white/70 mb-8 text-sm leading-relaxed">
            Entre em contato para receber um orçamento detalhado e personalizado para seu evento dos sonhos. 
            Nossa equipe garantirá o espetáculo perfeito.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              onClick={() => handleQuoteRequest()}
              className="bg-gradient-to-r from-fire-gold to-fire-orange hover:from-fire-orange hover:to-fire-gold text-black py-4 font-bold shadow-lg group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <FileText className="w-5 h-5 mr-2" />
              Orçamento Detalhado Premium
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleWhatsAppClick}
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-4 font-bold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Direto
            </Button>
          </div>

          <p className="text-white/50 mt-6 text-xs">
            Atendimento especializado de segunda a sexta, das 8h às 18h | Plantão para finais de semana
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
