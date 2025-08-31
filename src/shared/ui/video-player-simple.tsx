import React, { useState, useRef } from 'react';
import { Card } from '@/shared/ui/card';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  src?: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  className?: string;
  muted?: boolean;
}

export const VideoPlayerSimple: React.FC<VideoPlayerProps> = ({
  src,
  title,
  thumbnail,
  autoplay = false,
  className,
  muted = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setShowPlayButton(false);
      }).catch(err => {
        console.error('Error playing video:', err);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      setShowPlayButton(true);
    }
  };

  const handleVideoClick = () => {
    handlePlay();
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
  };

  if (!src) {
    return (
      <Card className={cn("overflow-hidden bg-black", className)}>
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-fire-orange" />
            </div>
            <p className="text-white/80">Vídeo não disponível</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden bg-black", className)}>
      <div className="relative aspect-video bg-black cursor-pointer" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnail}
          autoPlay={autoplay}
          muted={muted}
          playsInline
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          controls={isPlaying}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-16 h-16 rounded-full flex items-center justify-center transition-colors">
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoPlayerSimple;