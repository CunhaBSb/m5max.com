import { Card, CardContent } from '@/shared/ui/card';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { Badge } from '@/shared/ui/badge';
import { FaYoutube as YouTube } from 'react-icons/fa';

export interface ShowcaseVideoCardProps {
  youtubeId: string;
  title: string;
  description: string;
  badges: string[];
  features?: string[];
  variant?: 'desktop' | 'mobile';
}

export const ShowcaseVideoCard = ({
  youtubeId,
  title,
  description,
  badges,
  features = [],
  variant = 'desktop'
}: ShowcaseVideoCardProps) => {
  const isMobile = variant === 'mobile';
  const displayBadges = isMobile ? badges : badges.slice(0, 3);

  if (isMobile) {
    return (
      <div className="relative group animate-fade-in-up h-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        {/* Mobile decorative particles */}
        <div className="absolute -inset-1 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-fire-gold/60 rounded-full animate-ping opacity-40" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
          <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-fire-orange/50 rounded-full animate-pulse opacity-30" style={{ animationDelay: '2.8s', animationDuration: '2s' }} />
        </div>

        {/* Enhanced mobile glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-fire-orange/12 via-fire-gold/20 to-fire-orange/12 rounded-xl blur-md opacity-50 group-hover:opacity-80 animate-pulse transition-opacity duration-500" style={{ animationDuration: '4s' }} />

        <Card className="relative h-full flex flex-col bg-gradient-to-br from-black/70 via-gray-900/50 to-black/70 backdrop-blur-sm border-2 border-fire-orange/25 hover:border-fire-gold/40 overflow-hidden shadow-xl shadow-fire-orange/15 group-hover:shadow-fire-gold/25 transition-all duration-500 hover:transform hover:scale-[1.02]">
          {/* Mobile Video Player */}
          <div className="aspect-video relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-br from-fire-gold/8 via-fire-orange/10 to-fire-gold/8 rounded-t-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

            <div className="relative z-10">
              <YouTubeEmbed
                youtubeId={youtubeId}
                title={title}
                className="w-full h-full rounded-t-lg"
              />
            </div>

            {/* Mobile badges overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-4rem)] pointer-events-none z-20">
              {displayBadges.map((badge, index) => (
                <Badge
                  key={badge}
                  className="bg-gradient-to-r from-fire-orange/90 to-fire-orange text-white text-xs font-bold shadow-lg backdrop-blur-md px-2 py-1 border border-fire-orange/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none z-15" />
          </div>

          {/* Compact Mobile Card Content */}
          <CardContent className="p-3 space-y-2 flex-1 flex flex-col bg-gradient-to-br from-gray-900/40 via-black/50 to-gray-900/40 backdrop-blur-sm border-t border-fire-orange/20">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-fire-gradient transition-all duration-300 leading-tight">
                {title}
              </h3>
              <p className="text-xs text-white/85 leading-relaxed group-hover:text-white/95 transition-colors duration-300">
                {description}
              </p>
            </div>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-1 text-xs mt-auto pt-2 border-t border-fire-orange/25 group-hover:border-fire-gold/30 transition-colors duration-300">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gradient-to-r from-fire-orange/20 to-fire-gold/15 text-fire-orange hover:text-fire-gold rounded-full text-xs font-medium border border-fire-orange/40 hover:border-fire-gold/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-sm group-hover:shadow-fire-orange/20 animate-fade-in-up"
                    style={{ animationDelay: `${0.3 + (index * 0.1)}s`, animationFillMode: 'both' }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop variant
  return (
    <Card className="h-full flex flex-col bg-black/30 hover:bg-black/40 backdrop-blur-sm border border-white/10 hover:border-fire-orange/30 overflow-hidden shadow-lg group hover:shadow-fire-orange/10 transition-all duration-300">
      {/* Video Thumbnail with YouTube Watermark */}
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <YouTubeEmbed
          youtubeId={youtubeId}
          title={title}
          className="w-full h-full"
        />
        {/* Discrete YouTube Watermark */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1.5">
          <YouTube className="w-3 h-3 text-red-500" />
          <span className="text-xs text-white/80 font-medium">YouTube</span>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Badges at top */}
        <div className="flex flex-wrap gap-1.5">
          {displayBadges.map(badge => (
            <Badge
              key={badge}
              className="bg-white/10 hover:bg-fire-orange/20 text-white hover:text-fire-orange text-xs px-2 py-0.5 font-medium border border-white/20 transition-colors duration-200"
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-white leading-tight group-hover:text-fire-orange transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
