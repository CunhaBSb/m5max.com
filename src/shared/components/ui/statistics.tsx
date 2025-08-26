import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  animate?: boolean;
  duration?: number;
  className?: string;
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  suffix = '',
  prefix = '',
  label,
  description,
  icon,
  animate = true,
  duration = 2000,
  className
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !animate) {
      setCurrentValue(value);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (value - startValue) * easeOut);
      
      setCurrentValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setCurrentValue(value);
      }
    };

    requestAnimationFrame(animateValue);
  }, [isVisible, animate, value, duration]);

  return (
    <div ref={ref} className={cn('text-center space-y-2', className)}>
      {icon && (
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
      )}
      
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {prefix}
        {currentValue.toLocaleString()}
        {suffix}
      </div>
      
      <div className="font-medium text-foreground">
        {label}
      </div>
      
      {description && (
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
};

interface StatisticsGridProps {
  stats: Array<Omit<StatItemProps, 'animate' | 'duration'>>;
  columns?: number;
  animate?: boolean;
  duration?: number;
  className?: string;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  stats,
  columns = 4,
  animate = true,
  duration = 2000,
  className
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  };

  return (
    <div className={cn('grid gap-8', gridCols[columns as keyof typeof gridCols], className)}>
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          {...stat}
          animate={animate}
          duration={duration + (index * 200)} // Stagger animation
        />
      ))}
    </div>
  );
};

// Preset statistics for M5 Max
export const M5MaxStats = () => (
  <StatisticsGrid
    stats={[
      {
        value: 40,
        suffix: '+',
        label: 'Anos de Experiência',
        description: 'Desde 1984'
      },
      {
        value: 500,
        suffix: '+',
        label: 'Eventos Realizados',
        description: 'Em todo o Brasil'
      },
      {
        value: 100,
        suffix: '%',
        label: 'Segurança Certificada',
        description: 'Equipe Blaster habilitada'
      },
      {
        value: 15,
        label: 'Estados Atendidos',
        description: 'Cobertura nacional'
      }
    ]}
    columns={4}
  />
);

// Preset for product statistics
export const ProductStats: React.FC<{ audience: 'cha' | 'kits' }> = ({ audience }) => {
  const chaStats = [
    { value: 98, suffix: '%', label: 'Satisfação', description: 'Famílias felizes' },
    { value: 24, label: 'Horas', description: 'Entrega expressa' },
    { value: 100, suffix: '%', label: 'Seguro', description: 'Controle remoto' },
    { value: 3, label: 'Cores Disponíveis', description: 'Rosa, azul, surpresa' }
  ];

  const kitsStats = [
    { value: 95, suffix: '%', label: 'Aprovação', description: 'Clientes satisfeitos' },
    { value: 7, label: 'Dias', description: 'Entrega nacional' },
    { value: 18, suffix: '+', label: 'Idade Mínima', description: 'Uso responsável' },
    { value: 50, suffix: '+', label: 'Tipos de Kits', description: 'Para toda ocasião' }
  ];

  return (
    <StatisticsGrid
      stats={audience === 'cha' ? chaStats : kitsStats}
      columns={4}
    />
  );
};