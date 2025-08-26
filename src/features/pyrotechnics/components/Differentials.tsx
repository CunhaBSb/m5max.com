import React from 'react';
import { Shield, Music, Award, Clock } from 'lucide-react';

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

export const Differentials = () => {
  return (
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
  );
};