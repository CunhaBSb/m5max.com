import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Building2, Heart, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

const segments = [
  {
    title: "Shows Pirotécnicos para Eventos",
    description: "Espetáculos profissionais para prefeituras, clubes e grandes produtoras com equipamentos de última geração.",
    image: "/assets/desktop/show.webp",
    icon: Building2,
    audience: "B2B",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Equipamentos profissionais", "Equipe especializada", "Licenças incluídas"]
  },
  {
    title: "Chá Revelação com Fogos",
    description: "Momentos únicos e emocionantes para revelar o sexo do bebê com segurança e beleza.",
    image: "/assets/desktop/cha.webp",
    icon: Heart,
    audience: "Famílias",
    audienceType: 'cha' as const,
    route: '/cha-revelacao',
    features: ["Cores personalizadas", "Totalmente seguro", "Momento inesquecível"]
  },
  {
    title: "Kits DIY para Festas",
    description: "Kits completos para Réveillon, aniversários e celebrações íntimas com segurança garantida.",
    image: "/assets/desktop/kits.webp",
    icon: Sparkles,
    audience: "Consumidores",
    audienceType: 'kits' as const,
    route: '/kits',
    features: ["Fácil de usar", "Manual incluído", "Certificação INMETRO"]
  }
];

const ServicesDesktop = () => {
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
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl xl:text-6xl font-bold mb-8">
            <span className="text-foreground">Soluções para Cada</span>
            <br />
            <span className="text-fire-gradient">Tipo de Celebração</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Da grande produção ao momento íntimo, temos a solução perfeita para transformar seu evento em uma memória inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="group flex flex-col h-full bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl cursor-pointer transition-all duration-500 hover:border-fire-orange/50 hover:shadow-2xl hover:shadow-fire-orange/20 hover:-translate-y-2"
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-6 right-6 bg-fire-orange/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white tracking-wider">
                    {segment.audience}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                      <Icon className="w-8 h-8 text-fire-orange" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-8">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-fire-orange transition-colors duration-300">
                      {segment.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-3 text-base leading-relaxed">
                      {segment.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow p-0 mt-6">
                    <ul className="space-y-3">
                      {segment.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-fire-orange rounded-full flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="text-fire-orange font-semibold text-sm group-hover:text-fire-gold transition-colors duration-300">
                      Saiba mais →
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

export default ServicesDesktop;