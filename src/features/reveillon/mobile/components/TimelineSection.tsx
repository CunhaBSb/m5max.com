import { Card } from '@/shared/ui/card';
import { Calendar, Shield, Truck, Sparkles, Clock } from 'lucide-react';

const TimelineSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Orçamento e Planejamento',
      description: 'Analisamos suas necessidades e criamos o conceito personalizado para o seu espetáculo.',
      icon: Calendar,
      features: ['Consulta personalizada', 'Orçamento detalhado', 'Cronograma definido']
    },
    {
      number: '02',
      title: 'Licenças e Autorizações',
      description: 'Cuidamos de toda a documentação legal e autorizações necessárias para o evento.',
      icon: Shield,
      features: ['Licenças municipais', 'Corpo de bombeiros', 'Documentação legal']
    },
    {
      number: '03',
      title: 'Logística e Preparação',
      description: 'Coordenamos transporte dos equipamentos e preparação técnica no local.',
      icon: Truck,
      features: ['Transporte seguro', 'Montagem técnica', 'Testes de segurança']
    },
    {
      number: '04',
      title: 'Show Espetacular!',
      description: 'Execução perfeita do espetáculo pirotécnico sincronizado e inesquecível.',
      icon: Sparkles,
      features: ['Execução perfeita', 'Efeitos espetaculares', 'Momentos únicos']
    }
  ];

  return (
    <section className="relative py-10 overflow-hidden">
      {/* Background harmonizado */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-slate-900/25 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.04),transparent_70%)]"></div>
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-fire-orange/20 text-fire-orange px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-fire-orange/30">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-fire-gradient flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
                <span>Processo Profissional</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-fire-gold to-white bg-clip-text text-transparent">
            Como Funciona?
          </h2>
          <p className="text-white/70 leading-relaxed text-base">
            Do primeiro contato até o espetáculo final, cuidamos de cada detalhe.
          </p>
          
          {/* Mobile Trust Badge */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">Processo Rápido</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div 
                  key={index} 
                  className="group relative"
                >
                  <Card className="relative h-full bg-gradient-to-br from-slate-900/60 via-slate-800/30 to-slate-900/60 backdrop-blur-sm border border-white/10 hover:border-fire-orange/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-fire-orange/20">
                    {/* Background hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/5 via-transparent to-fire-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-5">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fire-orange to-fire-gold flex items-center justify-center shadow-md">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-fire-orange/40">
                          {step.number}
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-fire-gold transition-colors">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-1.5">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-xs text-white/50">
                            <div className="w-1 h-1 rounded-full bg-fire-orange/60"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 text-fire-gold/60 text-sm">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-fire-orange/40"></div>
              <span>Processo completo em 4 etapas</span>
              <div className="w-6 h-px bg-gradient-to-r from-fire-orange/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
