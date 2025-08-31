import React from 'react';
import { cn } from '@/shared/lib/utils';

interface SectionSeparatorProps {
  variant?: 'fire-line' | 'ember-glow' | 'sparkle';
  className?: string;
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ variant = 'fire-line', className = '' }) => {
  const baseClasses = 'w-full my-16 lg:my-24';

  const variants = {
    'fire-line': (
      <div className={cn(baseClasses, 'h-px bg-gradient-to-r from-transparent via-fire-orange/60 to-transparent', className)} />
    ),
    'ember-glow': (
      <div className={cn(baseClasses, 'h-3 relative', className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-fire-orange/20 to-transparent" />
      </div>
    ),
    'sparkle': (
      <div className={cn(baseClasses, 'relative h-8 flex items-center justify-center', className)}>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-fire-orange/50 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-3">
            <div className="w-1 h-1 bg-fire-orange/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-1.5 h-1.5 bg-fire-orange/80 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-fire-orange/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}/>
        </div>
        <div className="w-48 h-px bg-gradient-to-l from-transparent via-fire-orange/50 to-transparent" />
      </div>
    ),
  };

  return variants[variant] || variants['fire-line'];
};

export default SectionSeparator;
