import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { FaWhatsapp as WhatsApp } from 'react-icons/fa';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
  features: string[];
}

const ShowcaseVideoCardMobile = ({ youtubeId, title, description, badges, features }: ShowcaseVideoCardProps) => {
  const { trackWhatsAppClick } = useAnalytics();
  const { attribution } = useAppStore();

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('b2b');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'b2b', source: 'reveillon_services_mobile' }
    );

    trackWhatsAppClick({
      audience: 'b2b',
      source: 'reveillon_services_mobile',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm border border-fire-orange/30 overflow-hidden shadow-lg mb-4">
      {/* Video Player */}
      <div className="aspect-video relative overflow-hidden">
        <YouTubeEmbed 
          youtubeId={youtubeId || ""}
          title={title}
          className="w-full h-full"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-3rem)] pointer-events-none z-10">
          {badges.map(badge => (
            <Badge key={badge} className="bg-fire-orange/90 text-white text-xs font-medium px-1.5 py-0.5">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Card Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            {description}
          </p>
        </div>
        
        {/* Features List */}
        <div className="space-y-1">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-fire-orange rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={handleWhatsAppClick}
          className="w-full bg-fire-gradient hover:opacity-90 text-white font-semibold"
        >
          <WhatsApp className="w-4 h-4 mr-2" />
          Solicitar Orçamento
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const ServicesMobile = () => {
  const showcaseData = [
    {
      youtubeId: "cEFsQC_nW74",
      title: "Shows Pirotécnicos Profissionais",
      description: "Espetáculos únicos com tecnologia de ponta para grandes eventos corporativos e celebrações especiais.",
      badges: ["Profissional", "Licenciado", "Seguro"],
      features: [
        "Equipamentos eletrônicos de última geração",
        "Licenciamento junto aos órgãos competentes",
        "Equipe técnica especializada",
        "Seguro de responsabilidade civil incluso"
      ]
    },
    {
      youtubeId: "YBdoYj8cNzE",
      title: "Chá Revelação",
      description: "Momentos mágicos para revelar o sexo do bebê com fogos coloridos e efeitos especiais únicos.",
      badges: ["Colorido", "Emocionante", "Personalizado"],
      features: [
        "Fogos com cores específicas (azul/rosa)",
        "Efeitos especiais personalizados",
        "Setup completo para fotos e vídeos",
        "Pacotes para diferentes orçamentos"
      ]
    },
    {
      youtubeId: "example3",
      title: "Kits DIY para Casa",
      description: "Kits completos com fogos seguros para você mesmo executar em casa, com manual detalhado.",
      badges: ["DIY", "Seguro", "Certificado"],
      features: [
        "Produtos certificados para uso doméstico",
        "Manual de segurança detalhado",
        "Diferentes pacotes e tamanhos",
        "Entrega em todo Brasil"
      ]
    }
  ];

  return (
    <section className="relative py-10 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950/10 to-background"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-fire-orange/5 via-transparent to-fire-gold/5"></div>
      
      <div className="relative container mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-fire-orange mb-3">
            <div className="w-7 h-7 rounded-full bg-fire-gradient flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold uppercase tracking-wide text-sm">Nossos Serviços</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            <span className="text-foreground">Escolha o</span>
            <br />
            <span className="text-fire-gradient">Serviço Ideal</span>
          </h2>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Soluções completas para todos os tipos de evento
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          {showcaseData.map((service, index) => (
            <ShowcaseVideoCardMobile key={index} {...service} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 p-6 bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg">
          <h3 className="text-lg font-bold text-fire-gradient mb-2">
            Precisa de algo personalizado?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Criamos shows únicos para eventos especiais
          </p>
          
          <Button 
            className="bg-fire-gradient hover:opacity-90 text-white w-full"
            onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
          >
            <WhatsApp className="w-4 h-4 mr-2" />
            Falar com Especialista
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesMobile;