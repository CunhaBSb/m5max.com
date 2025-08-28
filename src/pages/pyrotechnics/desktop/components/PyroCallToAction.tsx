import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/appStore';
import { Phone, MapPin } from 'lucide-react';

export const PyroCallToAction = () => {
  const { openConversionModal } = useAppStore();

  const handleCTAClick = () => {
    openConversionModal({
      source: 'cta',
      audience: 'b2b',
      page: 'shows-pirotecnicos'
    });
  };

  return (
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
  );
};