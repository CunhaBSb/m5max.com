import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-foreground">Portfólio e</span>
            <br />
            <span className="text-fire-gradient">Clientes Satisfeitos</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Conheça alguns dos eventos memoráveis que ajudamos a criar
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-12">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-6">
            Confiado por grandes nomes do mercado
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="bg-card/50 p-4 rounded-lg text-center hover:shadow-elegant transition-smooth group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-bounce">
                  {client.logo}
                </div>
                <div className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                  {client.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Video Case */}
          <div className="space-y-4">
            <div className="relative bg-gradient-to-br from-fire-orange to-fire-red rounded-2xl overflow-hidden aspect-video shadow-fire">
              <iframe 
                src="https://www.youtube.com/embed/AY1CF0LRKUw?rel=0&showinfo=0&modestbranding=1" 
                title="Shows Pirotécnicos M5 Max - Festa do Mimosa 2025"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <Button variant="tech" size="default" className="w-full">
              Ver Mais Projetos
            </Button>
          </div>

          {/* Testimonial */}
          <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-fire-gold text-fire-gold" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-fire-orange/30" />
                <blockquote className="text-sm leading-relaxed pl-4">
                  "{testimonial.text}"
                </blockquote>
              </div>
              
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-10 h-10 bg-fire-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-fire-orange font-bold text-sm">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">
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