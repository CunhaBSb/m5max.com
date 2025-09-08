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
      features: ['Simulação do espetáculo', 'Montagem técnica', 'Testes de segurança']
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
    <section className="relative py-8 overflow-hidden">
      {/* M5 Max Pyrotechnic Background System - Mobile Optimized */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/15 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/12 via-fire-gold/8 to-fire-orange/6" />
      
      {/* Enhanced Mobile Pyrotechnic Particle System - Process Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Golden spark particles - mobile density */}
        <div className="absolute top-1/4 left-1/6 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-35" style={{ animationDelay: '1.2s', animationDuration: '2s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-fire-gold/80 rounded-full animate-ping opacity-40" style={{ animationDelay: '2.1s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-30" style={{ animationDelay: '3s', animationDuration: '2.5s' }} />
        
        {/* Mobile firework trails - process lines */}
        <div className="absolute top-1/5 right-1/5 w-px h-10 bg-gradient-to-b from-fire-gold/25 to-transparent rotate-12 opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-px h-8 bg-gradient-to-t from-fire-orange/20 to-transparent -rotate-12 opacity-25" />
        <div className="absolute top-1/2 right-1/3 w-px h-6 bg-gradient-to-b from-fire-gold/15 to-transparent rotate-45 opacity-20" />
      </div>
      
      {/* Mobile Process Flow Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 
             bg-gradient-radial from-fire-gold/10 via-fire-orange/5 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDuration: '5s' }} />
        
        <div className="absolute top-1/4 right-1/3 w-20 h-20 
             bg-gradient-radial from-fire-orange/8 via-fire-gold/4 to-transparent 
             rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '6s' }} />
      </div>
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Professional Ambient Design - Mobile Enhanced */}
      <div className="absolute inset-0 opacity-12 pointer-events-none">
        {/* Mobile lateral ambience - reduced size */}
        <div className="absolute left-0 top-1/3 w-32 h-40 bg-gradient-to-r from-fire-orange/6 to-transparent blur-xl"></div>
        <div className="absolute right-0 top-1/3 w-32 h-40 bg-gradient-to-l from-fire-orange/6 to-transparent blur-xl"></div>
        
        {/* Mobile center focus enhancement */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-full bg-gradient-radial from-white/[0.006] to-transparent"></div>
      </div>
      
      <div className="relative container mx-auto px-4">
        {/* Standardized Header - Mobile */}
        <div className="text-center mb-12">
          {/* Standardized Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Processo Profissional
          </div>
          
          {/* Standardized Title - H2 */}
          <h2 className="text-lg font-bold mb-4">
            <span className="text-white">Como </span>
            <span className="text-fire-gradient">Funciona?</span>
          </h2>
          
          {/* Standardized Description */}
          <p className="text-base text-white/85 mb-6 max-w-xl mx-auto">
            Do primeiro contato até o espetáculo final, cuidamos de cada detalhe
          </p>
        </div>

        {/* Main Content Section - Mobile First Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 max-w-md mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div 
                key={index} 
                className="group relative"
              >
                {/* Mobile decorative elements - smaller and optimized */}
                <div className="absolute -inset-2 opacity-20">
                  <div className="absolute inset-0 bg-fire-orange/10 blur-2xl rounded-xl"></div>
                  <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-fire-orange/50 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-fire-orange/50 rounded-full animate-pulse delay-1000"></div>
                </div>

                <Card className="relative z-10 h-full bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 backdrop-blur-sm border-2 border-fire-gold/30 hover:border-fire-orange/50 shadow-2xl shadow-fire-gold/20 transition-all duration-500 hover:shadow-fire-orange/30 group">
                  {/* Enhanced glow effect for mobile */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/15 via-fire-gold/25 to-fire-orange/15 rounded-xl blur-sm opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
                  
                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fire-orange to-fire-gold flex items-center justify-center shadow-lg">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-fire-gold transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      <div className="text-3xl font-bold text-fire-orange/30">
                        {step.number}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-xs text-white/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-fire-orange group-hover:bg-fire-gold transition-colors"></div>
                          <span className="group-hover:text-white/80 transition-colors">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TimelineSection;
