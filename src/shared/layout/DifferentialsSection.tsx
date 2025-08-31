
import { LucideIcon } from "lucide-react";

interface DifferentialItem {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

interface DifferentialsSectionProps {
  titleComponent: React.ReactNode;
  subtitle: string;
  differentials: DifferentialItem[];
  showStats?: boolean;
}

export const DifferentialsSection = ({
  titleComponent,
  subtitle,
  differentials,
  showStats = false,
}: DifferentialsSectionProps) => {
  return (
    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
            {titleComponent}
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {differentials.map((differential, index) => {
            const Icon = differential.icon;
            return (
              <div
                key={index}
                className="group bg-card/80 backdrop-blur-sm p-4 rounded-2xl shadow-elegant hover:shadow-fire transition-smooth text-center"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center transition-bounce shadow-lg ${
                    differential.iconBgClass || "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      differential.iconColorClass || "text-primary"
                    }`}
                  />
                </div>

                <h3 className="text-base font-bold mb-3 group-hover:text-fire-orange transition-smooth">
                  {differential.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {differential.description}
                </p>
              </div>
            );
          })}
        </div>

        {showStats && (
          <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 py-6 lg:py-8 border-t border-border">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-fire-gradient mb-1">
                500+
              </div>
              <div className="text-xs text-muted-foreground">
                Eventos Realizados
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-fire-gradient mb-1">
                40
              </div>
              <div className="text-xs text-muted-foreground">Anos de Mercado</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-fire-gradient mb-1">
                100%
              </div>
              <div className="text-xs text-muted-foreground">Segurança</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-fire-gradient mb-1">
                24h
              </div>
              <div className="text-xs text-muted-foreground">Suporte</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
