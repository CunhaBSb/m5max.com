interface SectionSeparatorProps {
  variant?: 'minimal' | 'subtle' | 'standard' | 'emphasis';
}

const SectionSeparator: React.FC<SectionSeparatorProps> = ({ variant = 'minimal' }) => {
  if (variant === 'emphasis') {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-fire-orange/40" />
              <div className="w-2 h-2 bg-fire-orange/60 rounded-full" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-fire-orange/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'standard') {
    return (
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className="py-4">
        <div className="container mx-auto px-4">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>
      </div>
    );
  }

  // Minimal variant (default)
  return (
    <div className="py-3">
      <div className="container mx-auto px-4">
        <div className="w-full h-[1px] bg-border/30" />
      </div>
    </div>
  );
};

export default SectionSeparator;

/*
 * Professional Separator Usage Guide:
 * 
 * - minimal (24px): Default, between related content blocks
 * - subtle (32px): Between component sections
 * - standard (48px): Between major page sections
 * - emphasis (64px): Between distinct page areas (hero -> content)
 * 
 * Color Strategy:
 * - Minimal: Neutral border for subtle division
 * - Subtle: Low-opacity border for gentle separation
 * - Standard: Fire-orange accent for clear section breaks
 * - Emphasis: Fire-orange with decorative element for major transitions
 */