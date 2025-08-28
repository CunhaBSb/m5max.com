import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Building2, Calendar, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

// Using public assets
const show = "/assets/desktop/show.webp";

const segments = [
  {
    title: "Eventos Corporativos",
    description: "Shows pirotécnicos espetaculares para lançamentos de produtos, convenções empresariais e confraternizações.",
    image: show,
    icon: Building2,
    audience: "Corporativo",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Planejamento executivo", "Equipe especializada", "Licenças incluídas"]
  },
  {
    title: "Formaturas & Casamentos",
    description: "Espetáculos únicos e emocionantes para celebrar momentos especiais com segurança e beleza.",
    image: show,
    icon: Calendar,
    audience: "Eventos Sociais",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Roteiro personalizado", "Segurança certificada", "Momento inesquecível"]
  },
  {
    title: "Réveillon & Festivais",
    description: "Shows espetaculares para Réveillon 2025, festivais e grandes eventos com sincronização musical perfeita.",
    image: show,
    icon: Star,
    audience: "Grandes Eventos",
    audienceType: 'b2b' as const,
    route: '/shows-pirotecnicos',
    features: ["Réveillon 2025", "Sincronização musical", "Cobertura nacional"]
  }
];

const Services = () => {
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            <span className="text-foreground">Shows Pirotécnicos</span>
            <br />
            <span className="text-fire-gradient">Profissionais</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Especialistas em grandes espetáculos para eventos corporativos, formaturas, casamentos e festivais com 40 anos de experiência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="group flex flex-col h-full bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl cursor-pointer transition-all duration-300 hover:border-fire-orange/50"
                onClick={() => handleSegmentClick(segment)}
              >
                <div className="relative aspect-w-4 aspect-h-3 overflow-hidden rounded-t-xl">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 right-4 bg-fire-orange/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white tracking-wider">
                    {segment.audience}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md">
                      <Icon className="w-6 h-6 text-fire-orange" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-fire-orange transition-colors duration-300">
                      {segment.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                      {segment.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow p-0 mt-4">
                    <ul className="space-y-2">
                      {segment.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-fire-orange rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;