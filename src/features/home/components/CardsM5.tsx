import { Card, CardContent } from "@/shared/components/ui/card";
import { 
  Shield, 
  Users, 
  Eye, 
  Zap,
} from "lucide-react";

const CardsM5 = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {[
        {
          icon: Shield,
          title: "Certificação",
          description: "INMETRO e protocolos rigorosos",
          color: "text-green-500"
        },
        {
          icon: Users,
          title: "Equipe Elite",
          description: "Blasters certificados especialistas",
          color: "text-blue-500"
        },
        {
          icon: Eye,
          title: "Simulação 3D",
          description: "Pré-visualização completa",
          color: "text-purple-500"
        },
        {
          icon: Zap,
          title: "Tecnologia",
          description: "Ignição remota digital",
          color: "text-fire-orange"
        }
      ].map((credential, index) => {
        const Icon = credential.icon;
        return (
          <Card 
            key={index} 
            className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
          >
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-3 bg-background/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Icon className={`w-5 h-5 ${credential.color}`} />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                {credential.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-tight">
                {credential.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CardsM5;
