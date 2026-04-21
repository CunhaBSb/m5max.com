import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Sparkles, Heart, Clock, Package, MapPin, FileText, Users, Palette, Zap, Gamepad2 } from "lucide-react";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { cn } from "@/shared/lib/utils";

interface KitSplitSelectorProps {
  onSelect: (type: 'festa' | 'revelacao') => void;
  className?: string;
  mobile?: boolean;
}

const KitSplitSelector: React.FC<KitSplitSelectorProps> = ({ 
  onSelect, 
  mobile = false,
  className 
}) => {
  const { trackEvent } = useAnalytics();

  const handleSelection = (type: 'festa' | 'revelacao') => {
    trackEvent('kit_type_selected', { kit_type: type });
    onSelect(type);
  };

  // Kit Features Component
  const KitFeatures: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="space-y-3">
      {children}
    </div>
  );

  // Feature Item Component
  const FeatureItem: React.FC<{ icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }> = ({ 
    icon: Icon, 
    children 
  }) => (
    <div className="flex items-center text-white/90">
      <Icon className="w-4 h-4 mr-3 text-fire-gold" />
      <span className="text-sm">{children}</span>
    </div>
  );

  return (
    <section id="kits" className={cn("section-spacing bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Escolha seu <span className="text-fire-gradient">Kit Perfeito</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Kits profissionais com tudo incluído: instruções, detonador e suporte técnico
          </p>
        </div>

        <div className={cn(
          "grid gap-6 max-w-4xl mx-auto",
          mobile ? "grid-cols-1" : "md:grid-cols-2"
        )}>
          {/* Kit Festa */}
          <Card 
            className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-fire group"
            onClick={() => handleSelection('festa')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/20 to-fire-red/20 group-hover:from-fire-orange/30 group-hover:to-fire-red/30 transition-all duration-300" />
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-fire-gold to-fire-orange flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">Kit Festa</h3>
              <p className="text-white/80 mb-4 leading-relaxed text-sm">
                Perfeito para celebrações, aniversários, formaturas e eventos especiais
              </p>
              
              <KitFeatures>
                <FeatureItem icon={Clock}>Duração: 50s a 120s</FeatureItem>
                <FeatureItem icon={Package}>2 a 5 tortas incluídas</FeatureItem>
                <FeatureItem icon={MapPin}>Para espaços abertos</FeatureItem>
                <FeatureItem icon={FileText}>Instruções detalhadas</FeatureItem>
              </KitFeatures>

              <Button variant="fire" size="default" className="w-full mt-4">
                <a href="#kit-festa">Ver Kits Festa</a>
              </Button>
            </CardContent>
          </Card>

          {/* Kit Chá Revelação */}
          <Card 
            className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-tech group"
            onClick={() => handleSelection('revelacao')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tech-blue/20 to-tech-purple/20 group-hover:from-tech-blue/30 group-hover:to-tech-purple/30 transition-all duration-300" />
            <CardContent className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">Kit Chá Revelação</h3>
              <p className="text-white/80 mb-4 leading-relaxed text-sm">
                Momento mágico para revelar o gênero do bebê com cores especiais
              </p>
              
              <KitFeatures>
                <FeatureItem icon={Palette}>Azul, Rosa ou Surpresa</FeatureItem>
                <FeatureItem icon={Zap}>Placas + Gerbs + Pó Mágico</FeatureItem>
                <FeatureItem icon={Gamepad2}>Controle remoto (M4/M5)</FeatureItem>
                <FeatureItem icon={Users}>Para toda família</FeatureItem>
              </KitFeatures>

              <Button variant="tech" size="default" className="w-full mt-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white">
                <a href="#kit-cha-revelacao">Ver Kits Revelação</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default KitSplitSelector;
