import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useAppStore } from '@/shared/store/appStore';
import { Sparkles, Calendar, Phone } from 'lucide-react';

export const PyroBanner = () => {
  const { openConversionModal } = useAppStore();

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'b2b',
      page: 'shows-pirotecnicos'
    });
  };

  return (
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
  );
};