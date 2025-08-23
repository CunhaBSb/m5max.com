import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Calendar, 
  Clock, 
  Users, 
  Music, 
  Sparkles,
  Phone,
  Play,
  CheckCircle
} from 'lucide-react';

const ReveillonPage = () => {
  const { openConversionModal } = useAppStore();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows de Réveillon | M5 Max Produções',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'b2b',
      page: 'shows-pirotecnicos-reveillon',
      context: { eventType: 'reveillon' }
    });
  };

  const packages = [
    {
      name: 'Réveillon Básico',
      duration: '10 minutos',
      audience: 'Até 1.000 pessoas',
      price: 'A partir de R$ 15.000',
      features: [
        'Show de 10 minutos',
        'Sincronização musical',
        'Fogos coloridos tradicionais',
        'Equipe técnica inclusa',
        'Licenças e segurança'
      ]
    },
    {
      name: 'Réveillon Premium',
      duration: '15 minutos',
      audience: 'Até 5.000 pessoas',
      price: 'A partir de R$ 45.000',
      features: [
        'Show de 15 minutos',
        'Sincronização musical avançada',
        'Fogos especiais e cascatas',
        'Múltiplos pontos de queima',
        'Efeitos especiais únicos',
        'Cobertura completa'
      ],
      popular: true
    },
    {
      name: 'Réveillon Espetacular',
      duration: '20+ minutos',
      audience: 'Mais de 10.000 pessoas',
      price: 'Sob consulta',
      features: [
        'Show personalizado',
        'Queimas simultâneas',
        'Efeitos 3D no céu',
        'Coordenação de múltiplos shows',
        'Logística completa',
        'Transmissão ao vivo'
      ]
    }
  ];

  const timeline = [
    {
      time: '6 meses antes',
      task: 'Planejamento e Orçamento',
      description: 'Definição do conceito e aprovação do projeto'
    },
    {
      time: '3 meses antes',
      task: 'Licenças e Autorizações',
      description: 'Obtenção de todas as licenças necessárias'
    },
    {
      time: '1 mês antes',
      task: 'Logística e Preparação',
      description: 'Confirmação de detalhes e preparação técnica'
    },
    {
      time: '31 de Dezembro',
      task: 'Show Espetacular!',
      description: 'Execução perfeita do espetáculo pirotécnico'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Shows de Réveillon 2025 | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos espetaculares para Réveillon 2025. Sincronização musical, múltiplos pontos de queima e segurança certificada. Faça seu evento ser inesquecível." />
        <meta name="keywords" content="réveillon 2025, shows pirotécnicos, fogos de artifício, virada do ano, festa de ano novo, pirotecnia" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mx-auto bg-accent-gold text-white">
                <Calendar className="w-4 h-4 mr-2" />
                RÉVEILLON 2025
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                O Maior Show
                <br />
                <span className="text-fire-gradient">da Virada</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Comece 2025 com o pé direito! Shows pirotécnicos sincronizados que transformam 
                sua celebração no evento mais comentado da cidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="hero" onClick={handleCTAClick}>
                  <Phone className="w-5 h-5 mr-2" />
                  Garantir Meu Show 2025
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Shows Anteriores
                </Button>
              </div>

              <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Agenda 2024 completa
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-gold" />
                  Reserve já para 2025
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pacotes para Réveillon 2025
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha o show perfeito para o seu evento. Todos os pacotes incluem licenças e equipe técnica.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`p-6 relative ${pkg.popular ? 'border-primary border-2 scale-105' : ''}`}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      MAIS POPULAR
                    </Badge>
                  )}
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <div className="text-primary font-semibold text-lg mb-4">{pkg.price}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {pkg.audience}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full" 
                      variant={pkg.popular ? 'default' : 'outline'}
                      onClick={handleCTAClick}
                    >
                      Solicitar Orçamento
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Destaque */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  CASE DE SUCESSO
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Réveillon Iate Clube Brasília 2024
                </h2>
                
                <p className="text-lg text-muted-foreground">
                  Mais de 3.000 pessoas presenciaram um espetáculo de 15 minutos com sincronização 
                  musical perfeita. O show teve 4 pontos de queima simultâneos e efeitos especiais 
                  que iluminaram toda a orla do Lago Paranoá.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-primary">15 min</div>
                    <div className="text-sm text-muted-foreground">Duração do show</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4 pontos</div>
                    <div className="text-sm text-muted-foreground">Queima simultânea</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">3.000+</div>
                    <div className="text-sm text-muted-foreground">Pessoas presentes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Aprovação</div>
                  </div>
                </div>

                <Button variant="outline" className="w-fit">
                  <Play className="w-4 h-4 mr-2" />
                  Assistir Vídeo Completo
                </Button>
              </div>

              <div className="relative">
                <Card className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-muted-foreground">Vídeo: Réveillon Iate Clube 2024</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Como Funciona o Processo
                </h2>
                <p className="text-lg text-muted-foreground">
                  Planejamento antecipado para garantir um show perfeito na virada.
                </p>
              </div>

              <div className="space-y-8">
                {timeline.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-border mt-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{step.task}</h3>
                        <Badge variant="outline" className="text-xs">
                          {step.time}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Não Deixe para a Última Hora!
              </h2>
              <p className="text-lg text-muted-foreground">
                As melhores datas para Réveillon 2025 já estão sendo reservadas. 
                Garante já o seu show e comece o ano com o pé direito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleCTAClick}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Réveillon 2025
                </Button>
                <Button size="lg" variant="outline">
                  <Music className="w-5 h-5 mr-2" />
                  Personalizar Show
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground pt-4">
                ⏰ Desconto especial para reservas até Março de 2024
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ReveillonPage;