import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Heart, 
  Baby, 
  Shield, 
  Sparkles,
  Phone,
  Play,
  CheckCircle,
  Gift,
  Users,
  Clock
} from 'lucide-react';

const ChaRevelacaoPage = () => {
  const { openConversionModal } = useAppStore();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Chá Revelação com Fogos | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'cha'
    });
  }, [trackPageView]);

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'cha',
      page: 'cha-revelacao'
    });
  };

  const kits = [
    {
      name: 'Kit Básico',
      price: 'R$ 299',
      audience: '15-30 pessoas',
      features: [
        'Pó colorido (rosa ou azul)',
        '2 bombas de fumaça',
        'Controle remoto',
        'Instruções de segurança',
        'Entrega em casa'
      ],
      image: '👶'
    },
    {
      name: 'Kit Popular',
      price: 'R$ 599',
      audience: '30-60 pessoas',
      features: [
        'Pó colorido premium',
        '4 bombas de fumaça',
        'Fogos de artifício pequenos',
        'Controle remoto profissional',
        'Personalização com nomes',
        'Suporte técnico'
      ],
      image: '💙',
      popular: true
    },
    {
      name: 'Kit Premium',
      price: 'R$ 999',
      audience: '60+ pessoas',
      features: [
        'Show completo personalizado',
        'Múltiplas cores simultâneas',
        'Fogos de artifício especiais',
        'Sistema de controle avançado',
        'Decoração inclusa',
        'Fotógrafo recomendado',
        'Montagem no local'
      ],
      image: '💖'
    }
  ];

  const safetyTips = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Área Segura',
      description: 'Mantenha 10 metros de distância da área de queima'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Adulto Responsável',
      description: 'Sempre tenha um adulto operando o controle remoto'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horário Adequado',
      description: 'Respeite os horários permitidos na sua cidade'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Produtos Certificados',
      description: 'Todos nossos produtos têm certificação de qualidade'
    }
  ];

  const testimonials = [
    {
      name: 'Ana Paula',
      location: 'Brasília/DF',
      content: 'O momento mais emocionante da minha vida! O kit funcionou perfeitamente e todos ficaram emocionados. Super recomendo!',
      rating: 5,
      baby: 'Menina'
    },
    {
      name: 'Ricardo e Márcia',
      location: 'Goiânia/GO',
      content: 'Fizemos uma surpresa para a família toda. A fumaça azul foi linda e o controle remoto funcionou na hora certa!',
      rating: 5,
      baby: 'Menino'
    },
    {
      name: 'Juliana Santos',
      location: 'Anápolis/GO',
      content: 'Kit premium valeu cada centavo. A personalização com nossos nomes ficou perfeita!',
      rating: 5,
      baby: 'Menina'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Chá Revelação com Fogos Coloridos | M5 Max Produções</title>
        <meta name="description" content="Kits especiais para chá revelação com fogos coloridos seguros. Rosa ou azul, controle remoto, entrega em casa. Torne seu momento ainda mais especial!" />
        <meta name="keywords" content="chá revelação, fogos coloridos, pó colorido, rosa azul, revelação sexo bebê, controle remoto" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/10 via-background to-accent-blue/10" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mx-auto bg-accent-pink text-white">
                <Heart className="w-4 h-4 mr-2" />
                CHÁ REVELAÇÃO
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                O Momento Mais
                <br />
                <span className="bg-gradient-to-r from-accent-pink to-accent-blue bg-clip-text text-transparent">
                  Emocionante
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Torne a revelação do sexo do seu bebê ainda mais especial com nossos kits seguros 
                de fogos coloridos. Rosa ou azul, o momento perfeito está garantido!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="bg-accent-pink hover:bg-accent-pink/90" onClick={handleCTAClick}>
                  <Gift className="w-5 h-5 mr-2" />
                  Escolher Meu Kit
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Como Funciona
                </Button>
              </div>

              <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground pt-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  100% Seguro
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Controle Remoto
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-500" />
                  Entrega em Casa
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kits Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Kits Especiais para Cada Momento
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha o kit perfeito para o seu chá revelação. Todos incluem controle remoto e instruções de segurança.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {kits.map((kit, index) => (
                <Card 
                  key={index} 
                  className={`p-6 relative ${kit.popular ? 'border-accent-pink border-2 scale-105' : ''}`}
                >
                  {kit.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-pink">
                      MAIS ESCOLHIDO
                    </Badge>
                  )}
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{kit.image}</div>
                      <h3 className="text-2xl font-bold mb-2">{kit.name}</h3>
                      <div className="text-accent-pink font-semibold text-2xl mb-2">{kit.price}</div>
                      <div className="text-sm text-muted-foreground">
                        Ideal para {kit.audience}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {kit.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full" 
                      variant={kit.popular ? 'default' : 'outline'}
                      style={kit.popular ? { backgroundColor: 'hsl(var(--accent-pink))' } : {}}
                      onClick={handleCTAClick}
                    >
                      Escolher Este Kit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Segurança em Primeiro Lugar
              </h2>
              <p className="text-lg text-muted-foreground">
                Nossos kits são desenvolvidos especialmente para chás revelação, priorizando sempre a segurança da família.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {safetyTips.map((tip, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {tip.icon}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Momentos Especiais de Famílias Reais
              </h2>
              <p className="text-lg text-muted-foreground">
                Veja como nossos kits tornaram momentos únicos ainda mais emocionantes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            testimonial.baby === 'Menina' 
                              ? 'bg-accent-pink text-white' 
                              : 'bg-accent-blue text-white'
                          }`}>
                            {testimonial.baby === 'Menina' ? '👧' : '👦'} {testimonial.baby}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Como Funciona
              </h2>
              <p className="text-lg text-muted-foreground">
                Processo simples e seguro do pedido até o grande momento.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold">Escolha seu Kit</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione o kit ideal para o seu evento
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold">Receba em Casa</h3>
                <p className="text-sm text-muted-foreground">
                  Entrega rápida e segura no seu endereço
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold">Prepare o Momento</h3>
                <p className="text-sm text-muted-foreground">
                  Siga as instruções e prepare a área
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold">Momento Mágico!</h3>
                <p className="text-sm text-muted-foreground">
                  Use o controle remoto no momento perfeito
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para o Grande Momento?
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha seu kit e torne a revelação do sexo do seu bebê um momento inesquecível para toda a família.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent-pink hover:bg-accent-pink/90" onClick={handleCTAClick}>
                  <Baby className="w-5 h-5 mr-2" />
                  Escolher Meu Kit Agora
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Tirar Dúvidas
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground pt-4">
                🚚 Entrega expressa para todo o Brasil • 💳 Parcelamos em até 3x sem juros
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ChaRevelacaoPage;