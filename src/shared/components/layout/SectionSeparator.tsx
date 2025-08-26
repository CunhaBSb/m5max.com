import React from 'react';

interface SectionSeparatorProps {
  variant?: 'minimal' | 'subtle' | 'standard' | 'emphasis' | 'gradient' | 'curved' | 'vintage';
  className?: string;
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ variant = 'minimal', className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'h-px bg-gradient-to-r from-transparent via-border/20 to-transparent my-0';
      
      case 'subtle':
        return 'h-px bg-gradient-to-r from-transparent via-border/30 to-transparent my-4';
      
      case 'standard':
        return 'h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-8';
      
      case 'emphasis':
        return 'h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent my-12';
        
      case 'gradient':
        return 'h-1 bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent my-16';
      
      case 'curved':
        return 'relative h-12 my-0 overflow-hidden';
        
      case 'vintage':
        return 'relative h-8 my-8';
        
      default:
        return 'h-px bg-border/20 my-0';
    }
  };

  // Special curved separator
  if (variant === 'curved') {
    return (
      <div className={`${getVariantStyles()} ${className}`}>
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 1200 120"
        >
          <path 
            d="M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z" 
            fill="url(#curveGradient)"
            opacity="0.05"
          />
          <defs>
            <linearGradient id="curveGradient">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Special vintage separator with dots
  if (variant === 'vintage') {
    return (
      <div className={`${getVariantStyles()} ${className} flex items-center justify-center`}>
        <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-border/30" />
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-border/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
            <div className="w-1 h-1 bg-border/40 rounded-full" />
          </div>
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-border/30" />
        </div>
      </div>
    );
  }

  // Default linear separators
  return <div className={`${getVariantStyles()} ${className}`} />;
};

export default SectionSeparator;