import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore } from '@/store/appStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Home, 
  Users, 
  Shield, 
  AlertTriangle,
  Phone,
  ShoppingCart,
  CheckCircle,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

const KitsPage = () => {
  const { openConversionModal } = useAppStore();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Kits DIY de Fogos de Artifício | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'kits'
    });
  }, [trackPageView]);

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'kits',
      page: 'kits'
    });
  };

  const categories = [
    {
      name: 'Réveillon em Casa',
      description: 'Kits especiais para celebrar a virada em família',
      icon: '🎆',
      features: ['5-15 pessoas', 'Quintal médio', 'Fogos coloridos', 'Controle de tempo'],
      priceRange: 'R$ 199 - R$ 599',
      season: 'Dezembro - Janeiro'
    },
    {
      name: 'Aniversários',
      description: 'Torne qualquer aniversário mais especial',
      icon: '🎂',
      features: ['10-30 pessoas', 'Área externa', 'Efeitos alegres', 'Fácil manuseio'],
      priceRange: 'R$ 149 - R$ 399',
      season: 'Ano todo'
    },
    {
      name: 'Confraternizações',
      description: 'Para eventos corporativos e familiares',
      icon: '🎉',
      features: ['20-50 pessoas', 'Área ampla', 'Shows de 5-10min', 'Kit completo'],
      priceRange: 'R$ 299 - R$ 799',
      season: 'Março - Novembro'
    }
  ];

  const kitSizes = [
    {
      name: 'Kit Pequeno',
      people: '5-15 pessoas',
      space: 'Quintal pequeno (até 100m²)',
      duration: '3-5 minutos',
      pieces: '8-12 peças',
      price: 'A partir de R$ 149',
      ideal: 'Família, amigos próximos'
    },
    {
      name: 'Kit Médio',
      people: '15-30 pessoas',
      space: 'Quintal médio (100-300m²)',
      duration: '5-8 minutos',
      pieces: '15-20 peças',
      price: 'A partir de R$ 299',
      ideal: 'Festas de aniversário',
      popular: true
    },
    {
      name: 'Kit Grande',
      people: '30+ pessoas',
      space: 'Área ampla (300m²+)',
      duration: '8-12 minutos',
      pieces: '25+ peças',
      price: 'A partir de R$ 599',
      ideal: 'Confraternizações, eventos'
    }
  ];

  const safetyRules = [
    'Apenas maiores de 18 anos podem manusear',
    'Mantenha distância mínima de 10 metros',
    'Use sempre em área aberta e ventilada',
    'Verifique a regulamentação local',
    'Mantenha água por perto para emergências',
    'Leia todas as instruções antes de usar'
  ];

  return (
    <>
      <Helmet>
        <title>Kits DIY de Fogos de Artifício | M5 Max Produções</title>
        <meta name="description" content="Kits DIY certificados para suas festas caseiras. Réveillon, aniversários e confraternizações. Produtos seguros com instruções completas." />
        <meta name="keywords" content="kits fogos artifício, fogos caseiros, réveillon casa, aniversário fogos, DIY pirotecnia" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mx-auto">
                <Home className="w-4 h-4 mr-2" />
                KITS DIY
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Fogos Seguros
                <br />
                <span className="text-fire-gradient">para Casa</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Kits certificados para suas festas caseiras. Réveillon, aniversários e confraternizações 
                com a segurança M5 Max que você já conhece.
              </p>

              <Alert className="max-w-2xl mx-auto border-safety-warning bg-safety-warning/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Produtos para maiores de 18 anos. 
                  Siga sempre as instruções de segurança.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" onClick={handleCTAClick}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ver Kits Disponíveis
                </Button>
                <Button size="lg" variant="outline">
                  <Shield className="w-5 h-5 mr-2" />
                  Guia de Segurança
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Kits para Cada Ocasião
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha o kit ideal para seu evento. Todos certificados e com instruções detalhadas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{category.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {category.season}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <div className="text-primary font-medium text-lg mb-4">
                        {category.priceRange}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full" onClick={handleCTAClick}>
                      Ver Kits desta Categoria
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Kit Sizes Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tamanhos para Cada Espaço
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha o kit do tamanho certo para seu evento e espaço disponível.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {kitSizes.map((kit, index) => (
                <Card 
                  key={index} 
                  className={`p-6 relative ${kit.popular ? 'border-primary border-2 scale-105' : ''}`}
                >
                  {kit.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      MAIS VENDIDO
                    </Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{kit.name}</h3>
                      <div className="text-primary font-semibold text-lg">{kit.price}</div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{kit.people}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{kit.space}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{kit.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span>{kit.pieces}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-xs text-muted-foreground mb-2">Ideal para:</div>
                      <div className="text-sm font-medium">{kit.ideal}</div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={kit.popular ? 'default' : 'outline'}
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
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Segurança em Primeiro Lugar
                </h2>
                <p className="text-lg text-muted-foreground">
                  Nossos kits DIY seguem os mais rigorosos padrões de segurança. 
                  Siga sempre nossas instruções para garantir diversão com responsabilidade.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    Regras de Segurança Obrigatórias
                  </h3>
                  <div className="space-y-4">
                    {safetyRules.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-safety-warning rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-muted-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="p-6 bg-safety-green/10 border-safety-green">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-safety-green" />
                      <h4 className="font-semibold">Certificação de Qualidade</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-safety-green" />
                        <span>Produtos certificados pelo Exército</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-safety-green" />
                        <span>Testados em laboratório</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-safety-green" />
                        <span>Instruções em português</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-safety-green" />
                        <span>Suporte técnico incluso</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-safety-green text-safety-green">
                      Baixar Manual de Segurança
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Rápido */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Dúvidas Frequentes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-6">
                <h4 className="font-semibold mb-3">Posso usar em condomínio?</h4>
                <p className="text-sm text-muted-foreground">
                  Verifique as regras do condomínio e da cidade. Muitos permitem 
                  fogos de baixo ruído em horários específicos.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-3">Como calcular o kit ideal?</h4>
                <p className="text-sm text-muted-foreground">
                  Use nossa calculadora online considerando número de pessoas, 
                  tamanho do espaço e duração desejada.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-3">Entrega em quanto tempo?</h4>
                <p className="text-sm text-muted-foreground">
                  3-7 dias úteis para todo o Brasil. Entregas expressas 
                  disponíveis para regiões metropolitanas.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-3">Tem garantia?</h4>
                <p className="text-sm text-muted-foreground">
                  Sim! Garantia total contra defeitos de fabricação. 
                  Suporte técnico gratuito por WhatsApp.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para Sua Festa?
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha seu kit DIY e transforme qualquer ocasião em um momento especial e seguro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleCTAClick}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ver Todos os Kits
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Falar com Especialista
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground pt-4">
                🔒 Compra 100% segura • 🚚 Entrega expressa • 💳 Parcelamos sem juros
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default KitsPage;