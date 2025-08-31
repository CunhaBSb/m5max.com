import React, { useState } from 'react';
import { Play } from 'lucide-react';
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
  const [isLoaded, setIsLoaded] = useState(autoplay);

  const handleLoadVideo = () => {
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return (
      <div 
        className={cn("relative aspect-video bg-black overflow-hidden rounded-md sm:rounded-lg cursor-pointer group", className)}
        onClick={handleLoadVideo}
      >
        {/* Thumbnail from YouTube */}
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-current ml-0.5 sm:ml-1" />
          </div>
        </div>
        
        {/* YouTube logo */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-white text-xs font-bold">
          YouTube
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video bg-black overflow-hidden rounded-md sm:rounded-lg", className)}>
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