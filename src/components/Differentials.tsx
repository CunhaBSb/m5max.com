import { Shield, Zap, Crown, Users } from "lucide-react";

const differentials = [
  {
    icon: Zap,
    title: "Equipamentos de Última Geração",
    description: "Tecnologia profissional avançada com sistemas eletrônicos de ignição e controle remoto",
    color: "fire-orange"
  },
  {
    icon: Shield,
    title: "Segurança Certificada",
    description: "Todos os produtos certificados pelo INMETRO com protocolos rigorosos de segurança",
    color: "tech-blue"
  },
  {
    icon: Crown,
    title: "40 Anos de Experiência",
    description: "Quatro décadas de expertise em pirotecnia profissional e eventos marcantes",
    color: "fire-gold"
  },
  {
    icon: Users,
    title: "Equipe Blaster Habilitada",
    description: "Profissionais certificados e especializados em manuseio seguro de materiais pirotécnicos",
    color: "fire-red"
  }
];

const Differentials = () => {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Por Que Escolher a</span>
            <br />
            <span className="text-fire-gradient">M5 Max Produções?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tecnologia, segurança e experiência reunidas para criar momentos únicos e inesquecíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {differentials.map((differential, index) => {
            const Icon = differential.icon;
            return (
              <div
                key={index}
                className="group bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-elegant hover:shadow-fire transition-smooth text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-${differential.color} bg-opacity-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                  <Icon className={`w-8 h-8 text-${differential.color}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-fire-orange transition-smooth">
                  {differential.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {differential.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-8 lg:py-12 border-t border-border">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fire-gradient mb-1 lg:mb-2">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Eventos Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fire-gradient mb-1 lg:mb-2">40</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Anos de Mercado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fire-gradient mb-1 lg:mb-2">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Segurança</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fire-gradient mb-1 lg:mb-2">24h</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Suporte</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differentials;