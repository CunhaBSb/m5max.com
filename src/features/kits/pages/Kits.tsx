import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Shield, 
  Sparkles, 
  Star,
  Phone,
  MessageSquare,
  Calendar,
  Gift,
  Home,
  Users
} from "lucide-react";
import kitsImg from "@/assets/diy-kits.jpg";

export default function Kits() {
  const kitCategories = [
    {
      title: "Kits Réveillon",
      price: "A partir de R$ 89",
      description: "Celebre a virada do ano com segurança",
      features: ["Fogos de 30 segundos", "Velas douradas", "Manual completo", "Suporte online"],
      image: kitsImg,
      popular: true
    },
    {
      title: "Kits Aniversário", 
      price: "A partir de R$ 49",
      description: "Torne qualquer aniversário especial",
      features: ["Velas coloridas", "Sparklers seguros", "Bombinhas alegres", "Kit família"],
      image: kitsImg,
      popular: false
    },
    {
      title: "Kits Casamento",
      price: "A partir de R$ 199",
      description: "Para momentos únicos do grande dia",
      features: ["Saída dos noivos", "Chuva de estrelas", "Fogos românticos", "Consultoria"],
      image: kitsImg,
      popular: false
    }
  ];

  const occasions = [
    { icon: Calendar, title: "Réveillon", desc: "Receba o ano novo com estilo" },
    { icon: Gift, title: "Aniversários", desc: "Celebre cada ano com alegria" },
    { icon: Users, title: "Casamentos", desc: "Momentos únicos para sempre" },
    { icon: Home, title: "Festas Familiares", desc: "Diversão segura em casa" }
  ];

  const safetyTips = [
    "Leia sempre as instruções antes do uso",
    "Mantenha distância de segurança de 5 metros",
    "Use em área aberta e ventilada", 
    "Tenha água ou extintor por perto",
    "Nunca reacenda fogos que falharam",
    "Adultos devem supervisionar sempre"
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="fire" className="mb-6">
                <Package className="w-4 h-4 mr-2" />
                Kits DIY Seguros
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Diversão</span>
                <br />
                <span className="text-fire-gradient">em Casa</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Kits completos com fogos de artifício seguros para suas celebrações familiares,
                com instruções detalhadas e suporte técnico incluído
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
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
                src={kitsImg} 
                alt="Kits DIY de fogos de artifício"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Kits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-fire-gradient">Kits</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o kit perfeito para sua ocasião especial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {kitCategories.map((kit, index) => (
              <Card 
                key={index} 
                className={`relative ${kit.popular ? 'border-fire-orange border-2 scale-105' : 'border-2'} hover:border-fire-orange transition-all`}
              >
                {kit.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fire-orange">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Vendido
                  </Badge>
                )}
                
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={kit.image} 
                    alt={kit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {kit.title}
                    <span className="text-fire-orange font-bold">{kit.price}</span>
                  </CardTitle>
                  <CardDescription>{kit.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {kit.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Sparkles className="w-4 h-4 text-fire-gold mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={kit.popular ? "default" : "outline"}
                  >
                    Comprar Kit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Para todas as <span className="text-fire-gradient">Ocasiões</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Temos o kit ideal para cada momento especial
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {occasions.map((occasion, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-fire-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-fire-orange/20 transition-colors">
                  <occasion.icon className="w-10 h-10 text-fire-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2">{occasion.title}</h3>
                <p className="text-muted-foreground">{occasion.desc}</p>
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
              
              <p className="text-lg text-muted-foreground mb-8">
                Todos os nossos kits vêm com instruções detalhadas e são certificados
                para uso doméstico seguro. Confira nossas dicas essenciais:
              </p>
              
              <ul className="grid grid-cols-1 gap-4">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-fire-orange mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-fire-orange/10 to-fire-red/10 rounded-lg p-8 text-center">
                <Shield className="w-24 h-24 text-fire-orange mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Certificação INMETRO</h3>
                <p className="text-muted-foreground mb-6">
                  Todos os nossos produtos são testados e aprovados pelos órgãos competentes
                </p>
                <Badge variant="outline" className="border-fire-orange text-fire-orange">
                  Licença ABC-123456
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Pronto para a <span className="text-fire-gold">diversão</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Escolha seu kit e torne suas celebrações inesquecíveis com segurança
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="fire" size="lg" className="bg-fire-orange hover:bg-fire-red">
              <Package className="w-5 h-5 mr-2" />
              Comprar Kits
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