import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  Music, 
  Award,
  Phone,
  MessageSquare
} from "lucide-react";

export default function ShowsPirotecnicos() {
  const services = [
    {
      title: "Shows Sincronizados",
      description: "Espetáculos pirotécnicos sincronizados com música para eventos corporativos",
      features: ["Sincronização musical", "Equipe certificada", "Seguro total"],
      icon: Music
    },
    {
      title: "Eventos Institucionais", 
      description: "Shows para prefeituras, empresas e eventos de grande porte",
      features: ["Licenças em dia", "Equipe Blaster", "Consultoria técnica"],
      icon: Users
    },
    {
      title: "Réveillon e Festas",
      description: "Espetáculos sazonais para viradas de ano e celebrações especiais",
      features: ["Shows temáticos", "Múltiplos pontos", "Logística completa"],
      icon: Sparkles
    }
  ];

  const differentials = [
    { icon: Award, title: "40 Anos de Experiência", desc: "Referência em pirotecnia profissional" },
    { icon: Shield, title: "Segurança Certificada", desc: "Licenças INMETRO e equipe habilitada" },
    { icon: Clock, title: "Pontualidade Total", desc: "Cronograma rigoroso e backup" }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="fire" className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Shows Pirotécnicos Profissionais
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Espetáculos</span>
            <br />
            <span className="text-fire-gradient">Inesquecíveis</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            40 anos criando momentos únicos com shows pirotécnicos sincronizados,
            equipe certificada e segurança total para seus eventos corporativos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Solicitar Orçamento
            </Button>
            <Button variant="whatsapp" size="lg" className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              WhatsApp Direto
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-fire-gradient">Serviços</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluções completas em pirotecnia profissional para eventos corporativos e institucionais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-fire-orange transition-colors">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-fire-orange mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Sparkles className="w-4 h-4 text-fire-gold mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a <span className="text-fire-gradient">M5 Max</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentials.map((diff, index) => (
              <div key={index} className="text-center">
                <diff.icon className="w-16 h-16 text-fire-orange mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">{diff.title}</h3>
                <p className="text-muted-foreground">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Pronto para criar um evento <span className="text-fire-gold">inesquecível</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato e receba uma proposta personalizada para seu evento
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