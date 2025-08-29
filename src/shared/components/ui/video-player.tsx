import React from 'react';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  youtubeId?: string;
  title: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  title,
  autoplay = false,
  controls = true,
  className
}) => {
  if (!youtubeId) {
    return (
      <div className={cn("aspect-video bg-gray-900 flex items-center justify-center", className)}>
        <p className="text-white/60">Vídeo não disponível</p>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video bg-black overflow-hidden rounded-lg", className)}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0&modestbranding=1&fs=1&hl=pt`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
};