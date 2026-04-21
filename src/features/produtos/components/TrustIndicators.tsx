import { Shield, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Award,
      title: '40+ Anos',
      subtitle: 'de Experiência',
      description: 'Mais de quatro décadas criando espetáculos pirotécnicos únicos e memoráveis',
      color: 'from-fire-gold to-fire-orange'
    },
    {
      icon: Shield,
      title: 'Segurança',
      subtitle: 'Certificada',
      description: 'Protocolos rigorosos e certificações internacionais de segurança pirotécnica',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: '2K+',
      subtitle: 'Eventos Realizados',
      description: 'Milhares de eventos bem-sucedidos em todo o Brasil com excelência comprovada',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: 'Pontualidade',
      subtitle: 'Garantida',
      description: 'Compromisso total com horários e cronogramas - sua data é sagrada para nós',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const certifications = [
    'ABNT NBR 15998',
    'Licença Exército Brasileiro',
    'Seguro Responsabilidade Civil'
  ];

  const { openFormModal } = useAppStore();
  const { trackEvent } = useAnalytics();

  const handleQuickQuote = () => {
    openFormModal({ source: 'trust_indicators_mobile', page: 'produtos' });
    trackEvent('quick_quote_click', { location: 'trust_indicators_mobile' });
  };

  return (
    <section className="py-12 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-sm mx-auto px-4">
        {/* Section Header - Mobile */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-fire-gold to-fire-orange bg-clip-text text-transparent">
            Por Que Confiar na M5 Max?
          </h2>
          <p className="text-base text-white/80 leading-relaxed">
            Mais de 40 anos criando momentos únicos com segurança, qualidade e profissionalismo reconhecidos
          </p>
        </div>

        {/* Trust Indicators Grid - Mobile 2x2 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${indicator.color} mb-4 group-hover:shadow-lg transition-all duration-300`}>
                <indicator.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">
                {indicator.title}
              </h3>
              <p className="text-sm font-medium text-fire-gold mb-2">
                {indicator.subtitle}
              </p>
              <p className="text-white/70 text-xs leading-relaxed">
                {indicator.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications - conciso */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-fire-orange/30">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-3">
                Certificações e Licenças Premium
              </h3>
              <p className="text-white/70 text-sm">Operação segura e legal</p>
            </div>
            
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA concisa para conversão */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-fire-orange/10 to-fire-gold/10 border border-fire-orange/30 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-3">Solicite Seu Orçamento</h3>
            <p className="text-white/70 text-sm mb-4">Atendimento rápido e especializado</p>
            <Button onClick={handleQuickQuote} className="w-full">Solicitar Orçamento</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
