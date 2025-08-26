import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Building2, Heart, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

const segments = [
  {
    title: "Shows Pirotécnicos para Eventos",
    description: "Espetáculos profissionais para prefeituras, clubes e grandes produtoras.",
    image: "/assets/mobile/show_mobile.webp",
    icon: Building2,
    audience: "B2B",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Equipamentos profissionais", "Equipe especializada", "Licenças incluídas"]
  },
  {
    title: "Chá Revelação com Fogos",
    description: "Momentos únicos e emocionantes para revelar o sexo do bebê com segurança.",
    image: "/assets/mobile/cha_mobile.webp",
    icon: Heart,
    audience: "Famílias",
    audienceType: 'cha' as const,
    route: '/cha-revelacao',
    features: ["Cores personalizadas", "Totalmente seguro", "Momento inesquecível"]
  },
  {
    title: "Kits DIY para Festas",
    description: "Kits completos para Réveillon, aniversários e celebrações íntimas.",
    image: "/assets/mobile/kits_mobile.webp",
    icon: Sparkles,
    audience: "Consumidores",
    audienceType: 'kits' as const,
    route: '/kits',
    features: ["Fácil de usar", "Manual incluído", "Certificação INMETRO"]
  }
];

const ServicesMobile = () => {
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();

  const handleSegmentClick = (segment: typeof segments[0]) => {
    trackPageView({
      page_title: segment.title,
      page_location: segment.route,
      page_category: segment.audienceType
    });
    navigate(segment.route);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="text-foreground">Soluções para Cada</span>
            <br />
            <span className="text-fire-gradient">Tipo de Celebração</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Da grande produção ao momento íntimo, temos a solução perfeita para seu evento.
          </p>
        </div>

        <div className="space-y-6">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="group bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl cursor-pointer transition-all duration-300 hover:border-fire-orange/50 hover:shadow-lg"
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-[16/10] sm:aspect-square sm:w-32 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none flex-shrink-0">
                    <img
                      src={segment.image}
                      alt={segment.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      width={128}
                      height={128}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg">
                        <Icon className="w-4 h-4 text-fire-orange" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-fire-orange/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white">
                      {segment.audience}
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-4 sm:p-6">
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg font-bold text-white group-hover:text-fire-orange transition-colors duration-300">
                        {segment.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground mt-2 text-sm">
                        {segment.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 mt-3">
                      <ul className="space-y-1">
                        {segment.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-fire-orange rounded-full flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="text-fire-orange font-semibold text-xs group-hover:text-fire-gold transition-colors duration-300">
                        Saiba mais →
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesMobile;