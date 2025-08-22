import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Heart, Sparkles } from "lucide-react";
import genderReveal from "@/assets/gender-reveal.jpg";
import diyKits from "@/assets/diy-kits.jpg";
import heroFireworks from "@/assets/hero-fireworks.jpg";

const segments = [
  {
    title: "Shows Pirotécnicos para Eventos",
    description: "Espetáculos profissionais para prefeituras, clubes e grandes produtoras com sincronização musical",
    image: heroFireworks,
    icon: Building2,
    audience: "B2B",
    features: ["Sincronização com música", "Equipe especializada", "Licenças incluídas"]
  },
  {
    title: "Chá Revelação com Fogos",
    description: "Momentos únicos e emocionantes para revelar o sexo do bebê com segurança e beleza",
    image: genderReveal,
    icon: Heart,
    audience: "Famílias",
    features: ["Cores personalizadas", "Totalmente seguro", "Momento inesquecível"]
  },
  {
    title: "Kits DIY para Festas",
    description: "Kits completos para Réveillon, aniversários e celebrações íntimas com segurança garantida",
    image: diyKits,
    icon: Sparkles,
    audience: "Consumidores",
    features: ["Fácil de usar", "Manual incluído", "Certificação INMETRO"]
  }
];

const Segments = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Soluções para Cada</span>
            <br />
            <span className="text-fire-gradient">Tipo de Celebração</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Da grande produção ao momento íntimo, temos a solução perfeita para seu evento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-smooth border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={segment.image}
                    alt={segment.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-fire-orange/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {segment.audience}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                      <Icon className="w-6 h-6 text-fire-orange" />
                    </div>
                  </div>
                </div>

                <CardHeader className="space-y-4">
                  <CardTitle className="text-xl font-bold group-hover:text-fire-orange transition-smooth">
                    {segment.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {segment.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {segment.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-fire-orange rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant="cta" 
                    className="w-full"
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

export default Segments;