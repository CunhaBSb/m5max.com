import { Shield, Zap, Crown, Users } from "lucide-react";

const differentials = [
  {
    icon: Zap,
    title: "Equipamentos de Última Geração",
    description: "Tecnologia profissional avançada com sistemas eletrônicos de ignição e controle remoto",
    iconBgClass: "bg-fire-orange",
    iconColorClass: "text-white"
  },
  {
    icon: Shield,
    title: "Segurança Certificada",
    description: "Todos os produtos certificados pelo INMETRO com protocolos rigorosos de segurança",
    iconBgClass: "bg-blue-600",
    iconColorClass: "text-white"
  },
  {
    icon: Crown,
    title: "40 Anos de Experiência",
    description: "Quatro décadas de expertise em pirotecnia profissional e eventos marcantes",
    iconBgClass: "bg-fire-gold",
    iconColorClass: "text-slate-900"
  },
  {
    icon: Users,
    title: "Equipe Blaster Habilitada",
    description: "Profissionais certificados e especializados em manuseio seguro de materiais pirotécnicos",
    iconBgClass: "bg-fire-red",
    iconColorClass: "text-white"
  }
];

const Differentials = () => {
  return (
    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-foreground">Por Que Escolher a</span>
            <br />
            <span className="text-fire-gradient">M5 Max Produções?</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Tecnologia, segurança e experiência reunidas para criar momentos únicos e inesquecíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {differentials.map((differential, index) => {
            const Icon = differential.icon;
            return (
              <div
                key={index}
                className="group bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-elegant hover:shadow-fire transition-smooth text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-bounce shadow-lg ${differential.iconBgClass}`}>
                  <Icon className={`w-7 h-7 ${differential.iconColorClass}`} />
                </div>
                
                <h3 className="text-lg font-bold mb-3 group-hover:text-fire-orange transition-smooth">
                  {differential.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {differential.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 py-6 lg:py-8 border-t border-border">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-fire-gradient mb-1">500+</div>
            <div className="text-xs text-muted-foreground">Eventos Realizados</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-fire-gradient mb-1">40</div>
            <div className="text-xs text-muted-foreground">Anos de Mercado</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-fire-gradient mb-1">100%</div>
            <div className="text-xs text-muted-foreground">Segurança</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-fire-gradient mb-1">24h</div>
            <div className="text-xs text-muted-foreground">Suporte</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differentials;