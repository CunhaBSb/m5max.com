import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play, Quote } from "lucide-react";

const clients = [
  { name: "Iate Clube", logo: "🏖️" },
  { name: "Prefeitura Municipal", logo: "🏛️" },
  { name: "Club Atlético", logo: "⚽" },
  { name: "Eventos Premium", logo: "🎭" },
  { name: "Resort Paradise", logo: "🌴" },
  { name: "Marina Bay", logo: "⛵" }
];

const testimonial = {
  text: "A M5 Max superou todas as expectativas! O show pirotécnico foi perfeito, com sincronização impecável e segurança total. Nossos convidados ficaram encantados.",
  author: "Maria Silva",
  position: "Organizadora de Eventos",
  company: "Iate Clube Santos"
};

const Portfolio = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Portfólio e</span>
            <br />
            <span className="text-fire-gradient">Clientes Satisfeitos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça alguns dos eventos memoráveis que ajudamos a criar
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-16">
          <h3 className="text-center text-lg font-semibold text-muted-foreground mb-8">
            Confiado por grandes nomes do mercado
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="bg-card/50 p-6 rounded-lg text-center hover:shadow-elegant transition-smooth group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-bounce">
                  {client.logo}
                </div>
                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                  {client.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Case */}
          <div className="space-y-6">
            <div className="relative bg-gradient-to-br from-fire-orange to-fire-red rounded-2xl overflow-hidden aspect-video group cursor-pointer shadow-fire">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full group-hover:bg-white group-hover:scale-110 transition-bounce">
                  <Play className="w-8 h-8 text-fire-orange ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-sm font-medium">Case de Sucesso</div>
                <div className="text-lg font-bold">Réveillon 2024 - Santos</div>
              </div>
            </div>
            
            <Button variant="tech" size="lg" className="w-full">
              Ver Mais Projetos
            </Button>
          </div>

          {/* Testimonial */}
          <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-fire-gold text-fire-gold" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-fire-orange/30" />
                <blockquote className="text-lg leading-relaxed pl-6">
                  "{testimonial.text}"
                </blockquote>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 bg-fire-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-fire-orange font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.position}, {testimonial.company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;