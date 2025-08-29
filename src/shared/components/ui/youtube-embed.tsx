import React from 'react';
import { cn } from '@/shared/lib/utils';

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  youtubeId,
  title,
  autoplay = false,
  controls = true,
  className
}) => {
  return (
    <div className={cn("relative aspect-video bg-black overflow-hidden rounded-lg", className)}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0&modestbranding=1&fs=1&hl=pt`}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
      />
    </div>
  );
};