import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Heart, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import show from "@/assets/services/show.webp";
import cha from "@/assets/services/cha.webp";
import kits from "@/assets/services/kits.webp";

const segments = [
  {
    title: "Shows Pirotécnicos para Eventos",
    description: "Espetáculos profissionais para prefeituras, clubes e grandes produtoras com equipamentos de última geração",
    image: show,
    icon: Building2,
    audience: "B2B",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Equipamentos profissionais", "Equipe especializada", "Licenças incluídas"]
  },
  {
    title: "Chá Revelação com Fogos",
    description: "Momentos únicos e emocionantes para revelar o sexo do bebê com segurança e beleza",
    image: cha,
    icon: Heart,
    audience: "Famílias",
    audienceType: 'cha' as const,
    route: '/cha-revelacao',
    features: ["Cores personalizadas", "Totalmente seguro", "Momento inesquecível"]
  },
  {
    title: "Kits DIY para Festas",
    description: "Kits completos para Réveillon, aniversários e celebrações íntimas com segurança garantida",
    image: kits,
    icon: Sparkles,
    audience: "Consumidores",
    audienceType: 'kits' as const,
    route: '/kits',
    features: ["Fácil de usar", "Manual incluído", "Certificação INMETRO"]
  }
];

const Services = () => {
  const navigate = useNavigate();
  const { openConversionModal } = useAppStore();
  const { trackPageView } = useAnalytics();

  const handleSegmentClick = (segment: typeof segments[0]) => {
    // Track the click
    trackPageView({
      page_title: segment.title,
      page_location: segment.route,
      page_category: segment.audienceType
    });

    // Navigate to the specific page
    navigate(segment.route);
  };

  const handleCTAClick = (segment: typeof segments[0]) => {
    openConversionModal({
      source: 'segments',
      audience: segment.audienceType,
      page: 'home'
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-foreground">Soluções para Cada</span>
            <br />
            <span className="text-fire-gradient">Tipo de Celebração</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Da grande produção ao momento íntimo, temos a solução perfeita para seu evento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-smooth border-0 bg-card/50 backdrop-blur-sm overflow-hidden cursor-pointer"
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 bg-fire-orange/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white">
                    {segment.audience}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg">
                      <Icon className="w-5 h-5 text-fire-orange" />
                    </div>
                  </div>
                </div>

                <CardHeader className="space-y-3 p-4">
                  <CardTitle className="text-lg font-bold group-hover:text-fire-orange transition-smooth">
                    {segment.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {segment.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 p-4 pt-0">
                  <ul className="space-y-1.5">
                    {segment.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-fire-orange rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant="cta" 
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleCTAClick(segment);
                    }}
                  >
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;