import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  Gift,
  Phone,
  MessageSquare,
  Baby,
  Camera,
  Users
} from "lucide-react";
import chaRevelacaoImg from "@/assets/gender-reveal.jpg";

export default function ChaRevelacao() {
  const packages = [
    {
      title: "Kit Básico",
      price: "R$ 299",
      description: "Perfeito para revelações íntimas com família",
      features: ["2 Bombas coloridas", "Vela mágica", "Confete biodegradável", "Manual de segurança"],
      popular: false
    },
    {
      title: "Kit Premium",
      price: "R$ 599", 
      description: "Para revelações especiais com convidados",
      features: ["4 Bombas coloridas", "Cascata de faíscas", "Balões especiais", "Suporte técnico"],
      popular: true
    },
    {
      title: "Show Completo",
      price: "Sob consulta",
      description: "Espetáculo profissional com equipe especializada",
      features: ["Equipe profissional", "Show sincronizado", "Fotografia inclusa", "Limpeza pós-evento"],
      popular: false
    }
  ];

  const colors = [
    { color: "Azul", hex: "#3B82F6", meaning: "É menino!" },
    { color: "Rosa", hex: "#EC4899", meaning: "É menina!" },
    { color: "Dourado", hex: "#F59E0B", meaning: "Surpresa!" }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="fire" className="mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Chá Revelação Especial
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Momentos</span>
                <br />
                <span className="text-fire-gradient">Mágicos</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Torne a revelação do sexo do seu bebê um momento ainda mais especial
                com nossos kits seguros e shows profissionais personalizados
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Ver Kits
                </Button>
                <Button variant="whatsapp" size="lg" className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src={chaRevelacaoImg} 
                alt="Chá Revelação com fogos coloridos"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-fire-gradient">Pacotes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o pacote ideal para tornar sua revelação inesquecível
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'border-fire-orange border-2 scale-105' : 'border-2'} hover:border-fire-orange transition-all`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fire-orange">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                  <div className="text-3xl font-bold text-fire-orange">{pkg.price}</div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Sparkles className="w-4 h-4 text-fire-gold mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    Escolher Pacote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cores <span className="text-fire-gradient">Disponíveis</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha a cor perfeita para sua revelação especial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {colors.map((color, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <Baby className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{color.color}</h3>
                <p className="text-muted-foreground">{color.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-fire-gradient">Segurança</span> em Primeiro Lugar
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-fire-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Produtos Certificados</h3>
                    <p className="text-muted-foreground">Todos nossos produtos são testados e aprovados pelo INMETRO</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-fire-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Suporte Especializado</h3>
                    <p className="text-muted-foreground">Nossa equipe oferece orientação completa sobre uso seguro</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Camera className="w-6 h-6 text-fire-orange mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Momentos Especiais</h3>
                    <p className="text-muted-foreground">Criamos memórias seguras que durarão para sempre</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-fire-orange/10 to-fire-red/10 rounded-lg p-8">
                <Shield className="w-24 h-24 text-fire-orange mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-center mb-4">40 Anos de Experiência</h3>
                <p className="text-center text-muted-foreground">
                  Confiança que só quatro décadas de dedicação à pirotecnia podem oferecer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Pronta para a <span className="text-fire-gold">revelação</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato e personalize seu chá revelação com segurança e magia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="fire" size="lg" className="bg-fire-orange hover:bg-fire-red">
              <Phone className="w-5 h-5 mr-2" />
              Solicitar Orçamento
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}