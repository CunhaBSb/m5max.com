import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  youtubeId?: string;
  src?: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  controls?: boolean;
  trackingEvents?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  src,
  title,
  thumbnail,
  autoplay = false,
  controls = true,
  trackingEvents = true,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasTracked50, setHasTracked50] = useState(false);
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackVideoEvent } = useAnalytics();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);

      if (trackingEvents) {
        // Track 50% progress
        if (currentProgress >= 50 && !hasTracked50) {
          setHasTracked50(true);
          trackVideoEvent('progress_50', {
            video_title: title,
            video_provider: 'custom',
            video_duration: video.duration,
            video_current_time: video.currentTime,
            video_percent: 50
          });
        }

        // Track completion
        if (currentProgress >= 95 && !hasTrackedComplete) {
          setHasTrackedComplete(true);
          trackVideoEvent('complete', {
            video_title: title,
            video_provider: 'custom',
            video_duration: video.duration,
            video_current_time: video.currentTime,
            video_percent: 100
          });
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStarted && trackingEvents) {
        setHasStarted(true);
        trackVideoEvent('start', {
          video_title: title,
          video_provider: 'custom',
          video_duration: video.duration
        });
      }
    };

    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [title, trackingEvents, hasStarted, hasTracked50, hasTrackedComplete, trackVideoEvent]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // YouTube embed
  if (youtubeId) {
    return (
      <Card className={className}>
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0`}
            title={title}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </Card>
    );
  }

  // Custom video player
  return (
    <Card className={className}>
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={thumbnail}
          autoPlay={autoplay}
          muted={autoplay} // Autoplay videos should be muted
        >
          {src && <source src={src} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* Controls overlay */}
        {controls && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              {/* Progress bar */}
              <div className="w-full bg-white/30 rounded-full h-1 mb-4">
                <div 
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};