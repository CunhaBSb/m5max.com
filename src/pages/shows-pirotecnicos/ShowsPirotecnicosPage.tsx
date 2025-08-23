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
  Sparkles, 
  Calendar, 
  Users, 
  Music, 
  Shield, 
  Award, 
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

const ShowsPirotecnicosPage = () => {
  const { openConversionModal } = useAppStore();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows Pirotécnicos Profissionais - M5 Max',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'b2b',
      page: 'shows-pirotecnicos'
    });
  };

  const eventTypes = [
    {
      title: 'Réveillon',
      description: 'Shows espetaculares para virada do ano',
      icon: '🎆',
      features: ['Equipamentos profissionais', 'Múltiplos pontos', 'Queima simultânea'],
      season: 'Dezembro - Janeiro'
    },
    {
      title: 'Festa Junina',
      description: 'Tradição e segurança para festivais',
      icon: '🔥',
      features: ['Temática junina', 'Shows noturnos', 'Fogos coloridos'],
      season: 'Maio - Julho'
    },
    {
      title: 'Casamentos',
      description: 'Momentos únicos e inesquecíveis',
      icon: '💍',
      features: ['Shows românticos', 'Timing perfeito', 'Efeitos especiais'],
      season: 'Ano todo'
    },
    {
      title: 'Festivais',
      description: 'Grandes eventos e multidões',
      icon: '🎪',
      features: ['Grande escala', 'Múltiplos shows', 'Logística completa'],
      season: 'Março - Novembro'
    },
    {
      title: 'Corporativo',
      description: 'Eventos empresariais e inaugurações',
      icon: '🏢',
      features: ['Discreção', 'Profissionalismo', 'Pontualidade'],
      season: 'Ano todo'
    },
    {
      title: 'Clubes & Resorts',
      description: 'Entretenimento para sócios e hóspedes',
      icon: '🏖️',
      features: ['Shows regulares', 'Pacotes anuais', 'Manutenção inclusa'],
      season: 'Temporadas'
    }
  ];

  const differentials = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Equipe Blaster Certificada',
      description: 'Profissionais habilitados pelo Exército Brasileiro'
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Sincronização Musical',
      description: 'Software próprio para sincronização perfeita'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: '40+ Anos de Experiência',
      description: 'Mais de 500 eventos realizados com sucesso'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Logística Completa',
      description: 'Licenças, transporte e montagem inclusos'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Shows Pirotécnicos Profissionais | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais com equipamentos profissionais. Réveillon, casamentos, festivais e eventos corporativos. Equipe Blaster certificada e 40+ anos de experiência." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, réveillon, casamentos, festivais, eventos corporativos, pirotecnia profissional" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mx-auto">
                <Sparkles className="w-4 h-4 mr-2" />
                PIROTECNIA PROFISSIONAL
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Shows Pirotécnicos
                <br />
                <span className="text-fire-gradient">Espetaculares</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Transforme seu evento em um espetáculo inesquecível com nossa pirotecnia profissional. 
                Equipamentos profissionais, segurança certificada e 40+ anos de experiência.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="hero" onClick={handleCTAClick}>
                  <Phone className="w-5 h-5 mr-2" />
                  Solicitar Orçamento
                </Button>
                <Button size="lg" variant="outline">
                  <Calendar className="w-5 h-5 mr-2" />
                  Ver Agenda
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Grid */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Especialistas em Todos os Tipos de Eventos
              </h2>
              <p className="text-lg text-muted-foreground">
                Cada evento é único. Nossos shows são personalizados para criar a experiência perfeita.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map((event, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">{event.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {event.season}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {event.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Por Que Escolher a M5 Max?
              </h2>
              <p className="text-lg text-muted-foreground">
                Somos referência nacional em pirotecnia profissional, com diferenciais únicos no mercado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {differentials.map((differential, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {differential.icon}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {differential.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {differential.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">40+</div>
                <div className="text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Eventos Realizados</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground">Segurança Certificada</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">15</div>
                <div className="text-muted-foreground">Estados Atendidos</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto para Criar um Espetáculo?
              </h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato conosco e vamos criar juntos o show pirotécnico perfeito para seu evento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleCTAClick}>
                  <Phone className="w-5 h-5 mr-2" />
                  Solicitar Orçamento Agora
                </Button>
                <Button size="lg" variant="outline">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Cases de Sucesso
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ShowsPirotecnicosPage;