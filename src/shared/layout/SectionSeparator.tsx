import React from 'react';
import { cn } from '@/shared/lib/utils';

interface SectionSeparatorProps {
  variant?: 'fire-line' | 'ember-glow' | 'sparkle' | 'sparkle-trail' | 'gradient-wave' | 'geometric-pattern';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ 
  variant = 'fire-line', 
  className = '',
  spacing = 'md'
}) => {
  const spacingClasses = {
    'sm': 'my-4 lg:my-6',
    'md': 'my-6 lg:my-8', 
    'lg': 'my-8 lg:my-12',
    'xl': 'my-12 lg:my-16'
  };

  const baseClasses = cn('w-full', spacingClasses[spacing]);

  const variants = {
    'fire-line': (
      <div className={cn(baseClasses, 'relative h-8 overflow-hidden', className)}>
        <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/50 to-transparent" />
        <div className="absolute top-3.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/40" />
      </div>
    ),
    'ember-glow': (
      <div className={cn(baseClasses, 'relative h-8 overflow-hidden', className)}>
        <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/60 to-transparent" />
        <div className="absolute top-3 left-0 w-full h-2 bg-gradient-to-r from-transparent via-fire-gold/15 to-transparent blur-md" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/30" />
      </div>
    ),
    'sparkle': (
      <div className={cn(baseClasses, 'relative h-8 flex items-center justify-center', className)}>
        <div className="w-48 lg:w-64 h-px bg-gradient-to-r from-transparent via-fire-orange/60 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2 lg:gap-3">
          <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse shadow-lg shadow-fire-orange/50" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse shadow-lg shadow-fire-orange/60" />
          <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse shadow-lg shadow-fire-orange/50" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 lg:w-40 h-4 bg-gradient-to-r from-transparent via-fire-orange/10 to-transparent blur-md" />
      </div>
    ),
    'sparkle-trail': (
      <div className={cn(baseClasses, 'relative h-6 overflow-hidden', className)}>
        <div className="absolute top-3 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/30" />
        <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-fire-orange rounded-full animate-ping shadow-sm shadow-fire-orange/60" style={{ animationDelay: '0.3s', animationDuration: '3s' }} />
        <div className="absolute top-1 right-1/3 w-1 h-1 bg-fire-gold rounded-full animate-ping shadow-sm shadow-fire-gold/60" style={{ animationDelay: '1.2s', animationDuration: '3s' }} />
        <div className="absolute bottom-0 left-3/4 w-1.5 h-1.5 bg-fire-orange rounded-full animate-ping shadow-sm shadow-fire-orange/60" style={{ animationDelay: '2.1s', animationDuration: '3s' }} />
      </div>
    ),
    'gradient-wave': (
      <div className={cn(baseClasses, 'relative h-6 overflow-hidden', className)}>
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-fire-orange/20 via-fire-gold/25 to-transparent" />
          <div className="absolute top-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/50 via-fire-gold/60 to-transparent" />
          <div className="absolute top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fire-orange/15 via-fire-gold/20 to-transparent blur-sm" />
        </div>
      </div>
    ),
    'geometric-pattern': (
      <div className={cn(baseClasses, 'relative h-8 flex items-center justify-center', className)}>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-fire-orange to-fire-gold shadow-sm shadow-fire-orange/40" />
          <div className="w-12 lg:w-16 h-px bg-gradient-to-r from-fire-orange/60 to-fire-gold/60" />
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-fire-orange to-fire-gold shadow-md shadow-fire-orange/50 border border-fire-orange/30" />
          <div className="w-12 lg:w-16 h-px bg-gradient-to-l from-fire-orange/60 to-fire-gold/60" />
          <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-fire-orange to-fire-gold shadow-sm shadow-fire-orange/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/5 to-transparent blur-lg" />
      </div>
    ),
  };

  return variants[variant] || variants['fire-line'];
};

export default SectionSeparator;
