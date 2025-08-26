import React from 'react';

export const StatsSection = () => {
  return (
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
  );
};