import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Calendar, 
  MapPin, 
  Users,
  Star,
  Play,
  ArrowRight
} from "lucide-react";

export default function Cases() {
  const cases = [
    {
      title: "Réveillon São Paulo 2024",
      category: "Evento Corporativo",
      client: "Prefeitura de São Paulo",
      year: "2024",
      location: "Copacabana, SP",
      audience: "2 milhões",
      description: "Show pirotécnico sincronizado de 12 minutos para celebração da virada do ano com transmissão ao vivo.",
      highlights: [
        "12 minutos de sincronização perfeita",
        "Transmissão ao vivo nacional",
        "Zero acidentes reportados",
        "Mais de 2 mil efeitos utilizados"
      ],
      image: "/placeholder.svg",
      featured: true
    },
    {
      title: "Casamento dos Sonhos",
      category: "Evento Social",
      client: "Marina & Roberto",
      year: "2023",
      location: "Campos do Jordão, SP",
      audience: "300 convidados",
      description: "Show romântico para celebração de casamento em resort de luxo com efeitos dourados e prateados.",
      highlights: [
        "Saída dos noivos com chuva dourada",
        "Sincronização com valsa especial",
        "Fotografia aérea incluída",
        "5 estrelas no feedback dos noivos"
      ],
      image: "/placeholder.svg",
      featured: false
    },
    {
      title: "Festival Junino Municipal",
      category: "Evento Cultural",
      client: "Prefeitura de Campinas",
      year: "2023",
      location: "Parque do Taquaral, Campinas",
      audience: "50 mil",
      description: "Espetáculo tradicional com fogos temáticos para encerramento do maior festival junino da região.",
      highlights: [
        "Tema tradicional brasileiro",
        "Integração com quadrilhas",
        "Fogos coloridos especiais",
        "Apoio cultural comunitário"
      ],
      image: "/placeholder.svg",
      featured: false
    },
    {
      title: "Inauguração Shopping Center",
      category: "Evento Comercial",
      client: "Grupo Multiplan",
      year: "2023",
      location: "Ribeirão Preto, SP",
      audience: "10 mil",
      description: "Show de inauguração com temática moderna e efeitos especiais para lançamento do novo empreendimento.",
      highlights: [
        "Tema futurista e moderno",
        "Integração com holografia",
        "Show durante 3 noites consecutivas",
        "Cobertura midiática completa"
      ],
      image: "/placeholder.svg",
      featured: false
    },
    {
      title: "Chá Revelação Premium",
      category: "Evento Familiar",
      client: "Família Silva",
      year: "2024",
      location: "Alphaville, SP",
      audience: "80 convidados",
      description: "Revelação especial com show personalizado, fotografia profissional e surpresa para os futuros papais.",
      highlights: [
        "Efeito surpresa duplo (gêmeos)",
        "Cores personalizadas azul/rosa",
        "Cobertura fotográfica completa",
        "Depoimento emocionante da família"
      ],
      image: "/placeholder.svg",
      featured: false
    },
    {
      title: "Festa de 15 Anos VIP",
      category: "Evento Social",
      client: "Família Montenegro",
      year: "2023",
      location: "Country Club, SP",
      audience: "500 convidados",
      description: "Celebração de debutante com show temático e efeitos especiais coordenados com a decoração do evento.",
      highlights: [
        "Tema princesa com dourado/rosa",
        "Entrada da aniversariante especial",
        "Coordenação com DJ e iluminação",
        "Surpresa para a família"
      ],
      image: "/placeholder.svg",
      featured: false
    }
  ];

  const testimonials = [
    {
      name: "Marina Oliveira",
      event: "Casamento",
      rating: 5,
      text: "Superou todas nossas expectativas! O show foi o ponto alto da nossa festa. Profissionalismo exemplar e resultado espetacular."
    },
    {
      name: "Carlos Silva - Prefeitura SP",
      event: "Evento Público",
      rating: 5,
      text: "Parceria de anos! A M5 Max sempre entrega excelência em segurança e espetáculo. Confiança total para nossos eventos."
    },
    {
      name: "Ana e Pedro",
      event: "Chá Revelação",
      rating: 5,
      text: "Momento mágico! A revelação foi perfeita, emocionou toda nossa família. Equipe atenciosa e resultado incrível."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="fire" className="mb-6">
            <Award className="w-4 h-4 mr-2" />
            Cases de Sucesso
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Momentos que</span>
            <br />
            <span className="text-fire-gradient">Marcaram História</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça alguns dos espetáculos mais marcantes que criamos nos últimos 40 anos.
            Cada evento é único, cada momento é especial.
          </p>
        </div>
      </section>

      {/* Featured Case */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <Badge variant="outline" className="border-fire-orange text-fire-orange mb-6">
              Destaque
            </Badge>
            
            <Card className="border-2 border-fire-orange/20 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="aspect-video lg:aspect-square relative">
                  <img 
                    src={cases[0].image} 
                    alt={cases[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button variant="ghost" size="icon" className="w-16 h-16 bg-white/20 hover:bg-white/30">
                      <Play className="w-8 h-8 text-white" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {cases[0].category}
                  </Badge>
                  
                  <h2 className="text-3xl font-bold mb-4">{cases[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{cases[0].description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-fire-orange" />
                      {cases[0].year}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-fire-orange" />
                      {cases[0].location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-fire-orange" />
                      {cases[0].audience}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-fire-orange" />
                      {cases[0].client}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="font-semibold">Destaques do projeto:</h3>
                    {cases[0].highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-fire-orange mt-0.5 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-fit bg-fire-orange hover:bg-fire-red">
                    Ver Detalhes Completos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Cases */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Outros <span className="text-fire-gradient">Projetos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada evento é único e especial para nós
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.slice(1).map((case_item, index) => (
              <Card key={index} className="border-2 hover:border-fire-orange transition-colors overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={case_item.image} 
                    alt={case_item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-4 left-4"
                  >
                    {case_item.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{case_item.title}</CardTitle>
                  <CardDescription>{case_item.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-fire-orange" />
                      {case_item.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-fire-orange" />
                      {case_item.audience}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {case_item.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-1 text-xs text-muted-foreground">
                        <ArrowRight className="w-3 h-3 text-fire-orange mt-0.5 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que dizem nossos <span className="text-fire-gradient">Clientes</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Depoimentos reais de quem confiou em nosso trabalho
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-fire-orange text-fire-orange" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Pronto para criar seu <span className="text-fire-gold">case de sucesso</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cada evento é único e especial. Deixe-nos criar um momento inesquecível para você.
          </p>
          
          <Button variant="fire" size="lg" className="bg-fire-orange hover:bg-fire-red">
            <Award className="w-5 h-5 mr-2" />
            Solicitar Orçamento
          </Button>
        </div>
      </section>
    </div>
  );
}