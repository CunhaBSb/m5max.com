import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  Shield, 
  Users, 
  Clock,
  Target,
  Heart,
  Sparkles
} from "lucide-react";

export default function Sobre() {
  const milestones = [
    { year: "1984", title: "Fundação da M5 Max", desc: "Início da jornada na pirotecnia profissional" },
    { year: "1995", title: "Primeira Certificação", desc: "Obtemos licenças INMETRO para produtos" },
    { year: "2005", title: "Expansão Nacional", desc: "Começamos a atender todo o Brasil" },
    { year: "2015", title: "Tecnologia Digital", desc: "Implementamos sincronização musical digital" },
    { year: "2024", title: "40 Anos de História", desc: "Celebramos quatro décadas de momentos únicos" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Segurança",
      desc: "Prioridade absoluta em todos os nossos produtos e serviços"
    },
    {
      icon: Heart,
      title: "Paixão",
      desc: "Amor genuíno pelo que fazemos e pelos momentos que criamos"
    },
    {
      icon: Users,
      title: "Família",
      desc: "Tratamos cada cliente como parte da nossa família"
    },
    {
      icon: Award,
      title: "Excelência",
      desc: "Busca constante pela perfeição em cada detalhe"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="fire" className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Nossa História
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">40 Anos de</span>
            <br />
            <span className="text-fire-gradient">Experiência</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde 1984, criamos momentos inesquecíveis através da arte da pirotecnia.
            Nossa história é construída com dedicação, segurança e paixão por transformar
            celebrações em memórias eternas.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Como tudo <span className="text-fire-gradient">começou</span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A M5 Max nasceu em 1984 do sonho de uma família apaixonada pela pirotecnia.
                  Com apenas um pequeno galpão e muito entusiasmo, começamos produzindo
                  fogos artesanais para festas locais em São Paulo.
                </p>
                
                <p>
                  O que nos diferenciava desde o início era o cuidado extremo com a segurança
                  e a busca incessante pela perfeição. Cada produto era testado pessoalmente,
                  cada show era planejado nos mínimos detalhes.
                </p>
                
                <p>
                  Hoje, quatro décadas depois, mantemos a mesma paixão e dedicação que nos
                  trouxe até aqui. Crescemos, nos modernizamos, mas nunca perdemos nossa
                  essência: criar momentos únicos com segurança e qualidade incomparáveis.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-fire-orange/10 to-fire-red/10 rounded-lg p-8">
                <div className="text-center">
                  <Award className="w-24 h-24 text-fire-orange mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Liderança Nacional</h3>
                  <p className="text-muted-foreground mb-6">
                    Referência em pirotecnia profissional no Brasil
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-fire-orange">500+</div>
                      <div className="text-sm text-muted-foreground">Eventos Realizados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-fire-orange">100%</div>
                      <div className="text-sm text-muted-foreground">Segurança</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa <span className="text-fire-gradient">Jornada</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Marcos importantes em nossa história de quatro décadas
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-fire-orange/20 hidden lg:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-12 gap-6`}>
                    {/* Content */}
                    <div className="lg:w-1/2">
                      <Card className="border-2 border-fire-orange/20 hover:border-fire-orange/40 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-fire-orange rounded-full flex items-center justify-center font-bold text-white">
                              {milestone.year.slice(-2)}
                            </div>
                            <h3 className="text-xl font-bold">{milestone.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{milestone.desc}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Timeline Point */}
                    <div className="hidden lg:block w-6 h-6 bg-fire-orange rounded-full border-4 border-background shadow-lg z-10" />
                    
                    {/* Year (opposite side) */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                      <div className="text-4xl font-bold text-fire-orange">{milestone.year}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-fire-gradient">Valores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Os princípios que nos guiam há 40 anos e continuarão nos guiando por muitas décadas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-2 hover:border-fire-orange transition-colors">
                <CardContent className="p-6">
                  <value.icon className="w-12 h-12 text-fire-orange mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Target className="w-16 h-16 text-fire-gold mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Nossa <span className="text-fire-gold">Missão</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              "Transformar momentos especiais em memórias eternas através da arte da pirotecnia,
              sempre priorizando a segurança, qualidade e a emoção única que só os fogos de 
              artifício podem proporcionar."
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <Clock className="w-12 h-12 text-fire-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Tradição</h3>
                <p className="text-muted-foreground text-sm">40 anos preservando a arte da pirotecnia</p>
              </div>
              <div>
                <Shield className="w-12 h-12 text-fire-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Segurança</h3>
                <p className="text-muted-foreground text-sm">Compromisso inabalável com a proteção</p>
              </div>
              <div>
                <Sparkles className="w-12 h-12 text-fire-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Magia</h3>
                <p className="text-muted-foreground text-sm">Criando momentos únicos e inesquecíveis</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}