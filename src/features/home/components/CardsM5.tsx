import { Card, CardContent } from "@/shared/components/ui/card";
import { 
  Shield, 
  Users, 
  Eye, 
  Zap,
} from "lucide-react";

const CardsM5 = () => {
  const cards = [
    {
      icon: Shield,
      title: "Certificação",
      description: "INMETRO aprovado",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Equipe Elite",
      description: "Blasters certificados",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Eye,
      title: "Simulação 3D",
      description: "Prévia completa",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Zap,
      title: "Tecnologia",
      description: "Ignição digital",
      color: "text-fire-orange",
      bgColor: "bg-fire-orange/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className="group bg-card/40 backdrop-blur-sm border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-md"
          >
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CardsM5;