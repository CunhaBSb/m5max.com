import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, Shield, Truck, Sparkles, Clock, Play } from 'lucide-react';
import { FaWhatsapp as WhatsApp } from 'react-icons/fa';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

const TimelineSection = () => {
  const { openFormModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openFormModal({
      source: 'reveillon_timeline',
      audience: 'general',
      page: 'reveillon'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'reveillon_timeline' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'reveillon_timeline',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  const handleSaibaMaisClick = () => {
    const empresaSection = document.getElementById('empresa');
    if (empresaSection) {
      empresaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const steps = [
    {
      number: '01',
      title: 'Orçamento e Planejamento',
      description: 'Analisamos suas necessidades e criamos o conceito visual personalizado para o espetáculo.',
      icon: Calendar,
      features: ['Consulta personalizada', 'Orçamento detalhado', 'Cronograma definido']
    },
    {
      number: '02',
      title: 'Licenças e Autorizações',
      description: 'Cuidamos de toda a documentação (ART/CREA, licenças ambientais) e seguro incluído.',
      icon: Shield,
      features: ['Licenças oficiais', 'Seguro incluído', 'Documentação legal']
    },
    {
      number: '03',
      title: 'Logística e Preparação',
      description: 'Coordenamos equipamentos e preparação técnica no local com testes controlados.',
      icon: Truck,
      features: ['Simulação do show', 'Montagem técnica', 'Testes de segurança']
    },
    {
      number: '04',
      title: 'Show Visual Sincronizado',
      description: 'Execução sincronizada do espetáculo de luz e efeitos, monitoramento e limpeza da área.',
      icon: Sparkles,
      features: ['Execução monitorada', 'Efeitos sincronizados', 'Pós-show completo']
    }
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      {/* M5 Max Pyrotechnic Background System - Desktop Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/15 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/12 via-fire-gold/8 to-fire-orange/6" />
      
      {/* Enhanced Desktop Pyrotechnic Particle System - Process Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Golden spark particles - desktop density */}
        <div className="absolute top-1/6 left-1/8 w-1 h-1 bg-fire-gold rounded-full animate-ping opacity-60" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
        <div className="absolute top-1/4 right-1/6 w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse opacity-45" style={{ animationDelay: '1s', animationDuration: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-fire-gold/80 rounded-full animate-ping opacity-50" style={{ animationDelay: '1.8s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/8 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-40" style={{ animationDelay: '2.5s', animationDuration: '2.5s' }} />
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-fire-gold rounded-full animate-ping opacity-35" style={{ animationDelay: '3.2s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-1/6 right-1/4 w-0.5 h-0.5 bg-fire-orange/80 rounded-full animate-pulse opacity-30" style={{ animationDelay: '4s', animationDuration: '2.8s' }} />
        
        {/* Desktop firework trails - process lines */}
        <div className="absolute top-1/5 right-1/5 w-px h-16 bg-gradient-to-b from-fire-gold/30 to-transparent rotate-12 opacity-40" />
        <div className="absolute bottom-1/3 left-1/5 w-px h-12 bg-gradient-to-t from-fire-orange/25 to-transparent -rotate-12 opacity-35" />
        <div className="absolute top-1/3 right-1/3 w-px h-10 bg-gradient-to-b from-fire-gold/20 to-transparent rotate-45 opacity-30" />
        <div className="absolute bottom-1/5 left-1/3 w-px h-8 bg-gradient-to-t from-fire-orange/15 to-transparent -rotate-45 opacity-25" />
      </div>
      
      {/* Desktop Process Flow Pattern - Enhanced */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 
             bg-gradient-radial from-fire-gold/12 via-fire-orange/6 to-transparent 
             rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '6s' }} />
        
        <div className="absolute top-1/4 right-1/4 w-32 h-32 
             bg-gradient-radial from-fire-orange/10 via-fire-gold/5 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '2s', animationDuration: '7s' }} />
        
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 
             bg-gradient-radial from-fire-gold/8 via-fire-orange/4 to-transparent 
             rounded-full blur-xl opacity-35 animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }} />
      </div>
      
      {/* Standardized Section Transitions - Desktop */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/85 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/85 to-transparent pointer-events-none" />
      
      {/* Professional Ambient Design - Desktop Enhanced */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {/* Desktop lateral ambience - full size */}
        <div className="absolute left-0 top-1/3 w-48 h-64 bg-gradient-to-r from-fire-orange/8 to-transparent blur-2xl"></div>
        <div className="absolute right-0 top-1/3 w-48 h-64 bg-gradient-to-l from-fire-orange/8 to-transparent blur-2xl"></div>
        
        {/* Desktop center focus enhancement */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-radial from-white/[0.008] to-transparent"></div>
        
        {/* Desktop corner accent lights */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-fire-gold/6 to-transparent blur-xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-fire-gold/6 to-transparent blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fire-orange/6 to-transparent blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-fire-orange/6 to-transparent blur-xl"></div>
      </div>
      
      <div className="relative container mx-auto px-8">
        {/* Standardized Header - Desktop */}
        <div className="text-center mb-16">
          {/* Standardized Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-8">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Processo Profissional
          </div>
          
          {/* Standardized Title - H2 */}
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-white">Como </span>
            <span className="text-fire-gradient">Funciona?</span>
          </h2>
          
          {/* Standardized Description */}
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            Do primeiro contato até o espetáculo final, cuidamos de cada detalhe
          </p>
        </div>

        {/* Main Content Section - Desktop Responsive Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div 
                  key={index} 
                  className="group relative"
                >
                  {/* Desktop decorative elements - enhanced */}
                  <div className="absolute -inset-3 opacity-25">
                    <div className="absolute inset-0 bg-fire-orange/12 blur-3xl rounded-xl"></div>
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-fire-orange/60 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-fire-gold/60 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 bg-fire-orange/40 rounded-full animate-pulse delay-2000"></div>
                  </div>

                  <Card className="relative z-10 h-full bg-gradient-to-br from-black/50 via-gray-900/40 to-black/50 backdrop-blur-sm border-2 border-fire-gold/40 hover:border-fire-orange/60 shadow-2xl shadow-fire-gold/25 transition-all duration-500 hover:shadow-fire-orange/40 group">
                    {/* Enhanced glow effect for desktop */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/20 via-fire-gold/30 to-fire-orange/20 rounded-xl blur-sm opacity-70 animate-pulse" style={{ animationDuration: '4s' }} />
                    
                    <div className="relative z-10 p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fire-orange to-fire-gold flex items-center justify-center shadow-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-fire-orange/30">
                          {step.number}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-fire-gold transition-colors mb-4">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/70 text-sm leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3 text-xs text-white/60">
                            <div className="w-2 h-2 rounded-full bg-fire-orange group-hover:bg-fire-gold transition-colors flex-shrink-0"></div>
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

        {/* Professional Desktop CTA Section - Home Style Buttons */}
        <div className="text-center mt-16 space-y-8">
          
          
          {/* Home Hero Style Buttons - Reveillon Theme */}
          <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
            {/* Primary Button - Saiba Mais - Desktop */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Button 
                variant="ghost"
                className="flex items-center justify-center gap-4 w-full h-16 bg-gradient-to-r from-purple-500/20 via-purple-400/30 to-purple-500/20 border-2 border-purple-400/50 text-white hover:from-purple-400/30 hover:via-purple-300/40 hover:to-purple-400/30 hover:border-purple-300/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-purple-400/20 hover:shadow-purple-300/30"
                onClick={handleSaibaMaisClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-400/50 transition-all group-hover:scale-110">
                  <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold">Saiba Mais Sobre a M5 Max</span>
                  <span className="text-xs text-purple-200/80">40 anos de experiência</span>
                </div>
              </Button>
            </div>

            {/* Secondary Buttons - Desktop */}
            <div className="flex gap-3 w-full">
              {/* WhatsApp Button - Desktop */}
              <Button
                variant="ghost"
                className="flex-1 h-12 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 hover:via-green-400/40 hover:to-green-500/30 hover:border-green-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-green-500/20"
                onClick={handleWhatsAppClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <WhatsApp className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">WhatsApp</span>
                <div className="flex items-center gap-1 ml-2 bg-green-400/20 px-1.5 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-200">Online</span>
                </div>
              </Button>

              {/* Orçamento Button - Desktop */}
              <Button
                variant="ghost"
                className="flex-1 h-12 bg-gradient-to-r from-gold-600/20 via-gold-500/30 to-gold-600/20 border border-gold-500/50 text-white hover:from-gold-500/30 hover:via-gold-400/40 hover:to-gold-500/30 hover:border-gold-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-gold-500/20"
                onClick={handleOrçamentoClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Orçamento</span>
                <div className="flex items-center gap-1 ml-2 bg-gold-400/20 px-1.5 py-0.5 rounded-full">
                  <span className="text-xs text-gold-200 font-bold">Grátis</span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Desktop trust indicators - Enhanced */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Shield className="w-4 h-4 text-fire-orange" />
              <span>Licenças completas</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4 text-fire-gold" />
              <span>Processo otimizado</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Sparkles className="w-4 h-4 text-fire-orange" />
              <span>Resultado garantido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
