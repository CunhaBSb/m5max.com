import { Sparkles } from "lucide-react";

interface SectionSeparatorProps {
  variant?: 'default' | 'gradient' | 'minimal' | 'vintage';
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ variant = 'default' }) => {
  if (variant === 'vintage') {
    return (
      <div className="relative py-16 overflow-hidden">
        {/* Main black gradient band */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-transparent" />
        
        {/* Vintage fade effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/20" />
        
        {/* Highlight effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fire-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fire-gold/30 to-transparent" />
        
        {/* Vintage texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.02]" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-8">
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent to-fire-gold/40" />
              <div className="p-4 bg-black/40 backdrop-blur-md border border-fire-gold/20 rounded-full shadow-2xl">
                <Sparkles className="w-5 h-5 text-fire-gold animate-pulse" />
              </div>
              <div className="w-32 h-[1px] bg-gradient-to-l from-transparent to-fire-gold/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent" />
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-fire-orange/50" />
              <div className="p-2 bg-background border border-fire-orange/20 rounded-full">
                <Sparkles className="w-4 h-4 text-fire-orange" />
              </div>
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-fire-orange/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-6">
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent to-fire-orange/30" />
            <div className="flex items-center gap-3 p-3 bg-background/80 backdrop-blur-sm border border-fire-orange/20 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-fire-gold rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-fire-red rounded-full animate-pulse delay-300" />
            </div>
            <div className="w-24 h-[2px] bg-gradient-to-l from-transparent to-fire-orange/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionSeparator;