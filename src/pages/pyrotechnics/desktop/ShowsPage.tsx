import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import RootLayout from '@/app/layouts/RootLayout';
import SectionSeparator from '@/shared/components/layout/SectionSeparator';
import { PyroBanner } from './components/PyroBanner';
import { EventTypesGrid } from './components/EventTypesGrid';
import { Shield, Eye, Award, Clock } from 'lucide-react';
import { DifferentialsSection } from '@/shared/components/layout/DifferentialsSection';

const pyroDifferentials = [
  {
    icon: Shield,
    title: 'Equipe Blaster Certificada',
    description: 'Profissionais habilitados pelo Exército Brasileiro',
    iconBgClass: 'bg-blue-600',
    iconColorClass: 'text-white',
  },
  {
    icon: Eye,
    title: 'Simulação',
    description: 'Tenha a prévia do show antes de realizá-lo',
    iconBgClass: 'bg-fire-red',
    iconColorClass: 'text-white',
  },
  {
    icon: Award,
    title: '40+ Anos de Experiência',
    description: 'Mais de 2000 eventos realizados com sucesso',
    iconBgClass: 'bg-fire-gold',
    iconColorClass: 'text-slate-900',
  },
  {
    icon: Clock,
    title: 'Logística Completa',
    description: 'Licenças, transporte e montagem inclusos',
    iconBgClass: 'bg-green-600',
    iconColorClass: 'text-white',
  },
];
import { StatsSection } from './components/StatsSection';
import { PyroCallToAction } from './components/PyroCallToAction';

const ShowsPage = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      page_title: 'Shows Pirotécnicos Profissionais - M5 Max',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  return (
    <>
      <Helmet>
        <title>Shows Pirotécnicos Profissionais | M5 Max Produções</title>
        <meta name="description" content="Shows pirotécnicos profissionais com equipamentos profissionais. Réveillon, casamentos, festivais e eventos corporativos. Equipe Blaster certificada e 40+ anos de experiência." />
        <meta name="keywords" content="shows pirotécnicos, fogos de artifício, réveillon, casamentos, festivais, eventos corporativos, pirotecnia profissional" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen bg-background">
        <div className="section-spacing">
          <PyroBanner />
        </div>

        <div className="section-spacing">
          <EventTypesGrid />
        </div>

        <div className="section-spacing">
                  <DifferentialsSection 
          titleComponent={<><span className="text-foreground">Por Que Escolher a</span><br /><span className="text-fire-gradient">M5 Max para seu Evento?</span></>}
          subtitle="Somos referência nacional em pirotecnia profissional, com diferenciais únicos no mercado."
          differentials={pyroDifferentials}
        />
        </div>

        <div className="section-spacing">
          <StatsSection />
        </div>

        <div className="component-spacing">
          <PyroCallToAction />
        </div>
        </main>
      </RootLayout>
    </>
  );
};

export default ShowsPage;