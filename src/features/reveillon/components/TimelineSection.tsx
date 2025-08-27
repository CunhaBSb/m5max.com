import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar, FileCheck, Truck, Sparkles } from 'lucide-react';

const TimelineSection = () => {
  const timeline = [
    {
      time: '6 meses antes',
      task: 'Planejamento e Orçamento',
      description: 'Definição do conceito e aprovação do projeto',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      time: '3 meses antes',
      task: 'Licenças e Autorizações',
      description: 'Obtenção de todas as licenças necessárias',
      icon: FileCheck,
      color: 'bg-green-500'
    },
    {
      time: '1 mês antes',
      task: 'Logística e Preparação',
      description: 'Confirmação de detalhes e preparação técnica',
      icon: Truck,
      color: 'bg-orange-500'
    },
    {
      time: '31 de Dezembro',
      task: 'Show Espetacular!',
      description: 'Execução perfeita do espetáculo pirotécnico',
      icon: Sparkles,
      color: 'bg-yellow-400'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Como Funciona o Processo
          </h2>
          <p className="text-lg text-muted-foreground">
            Do primeiro contato até o espetáculo final, cuidamos de cada detalhe 
            para garantir o sucesso do seu evento.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:gap-8">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`${item.color} rounded-full p-3 flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.time}
                        </Badge>
                        <h3 className="text-xl font-semibold">{item.task}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;