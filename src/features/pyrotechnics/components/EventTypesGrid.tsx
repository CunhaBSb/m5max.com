import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

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

export const EventTypesGrid = () => {
  return (
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
  );
};