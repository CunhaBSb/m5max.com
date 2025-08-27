import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Slider } from '@/shared/components/ui/slider';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  youtubeId?: string;
  src?: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  controls?: boolean;
  trackingEvents?: boolean;
  className?: string;
  muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  src,
  title,
  thumbnail,
  autoplay = false,
  controls = true,
  trackingEvents = true,
  className,
  muted = false
}) => {
  // Video states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Tracking states
  const [hasStarted, setHasStarted] = useState(false);
  const [hasTracked25, setHasTracked25] = useState(false);
  const [hasTracked50, setHasTracked50] = useState(false);
  const [hasTracked75, setHasTracked75] = useState(false);
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { trackVideoEvent } = useAnalytics();

  // Format time display
  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      video.volume = volume;
      video.muted = isMuted;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      if (trackingEvents && duration > 0) {
        const progressPercent = (video.currentTime / duration) * 100;
        
        // Track progress milestones
        if (progressPercent >= 25 && !hasTracked25) {
          setHasTracked25(true);
          trackVideoEvent('progress_25', {
            video_title: title,
            video_provider: 'custom',
            video_duration: duration,
            video_current_time: video.currentTime,
            video_percent: 25
          });
        }
        
        if (progressPercent >= 50 && !hasTracked50) {
          setHasTracked50(true);
          trackVideoEvent('progress_50', {
            video_title: title,
            video_provider: 'custom',
            video_duration: duration,
            video_current_time: video.currentTime,
            video_percent: 50
          });
        }
        
        if (progressPercent >= 75 && !hasTracked75) {
          setHasTracked75(true);
          trackVideoEvent('progress_75', {
            video_title: title,
            video_provider: 'custom',
            video_duration: duration,
            video_current_time: video.currentTime,
            video_percent: 75
          });
        }

        if (progressPercent >= 95 && !hasTrackedComplete) {
          setHasTrackedComplete(true);
          trackVideoEvent('complete', {
            video_title: title,
            video_provider: 'custom',
            video_duration: duration,
            video_current_time: video.currentTime,
            video_percent: 100
          });
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      if (!hasStarted && trackingEvents) {
        setHasStarted(true);
        trackVideoEvent('start', {
          video_title: title,
          video_provider: 'custom',
          video_duration: duration
        });
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('volumechange', handleVolumeChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('volumechange', handleVolumeChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [title, duration, hasStarted, hasTracked25, hasTracked50, hasTracked75, hasTrackedComplete, trackVideoEvent, trackingEvents, volume, isMuted]);

  // Control functions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
    showControlsTemporarily();
  }, [isPlaying, showControlsTemporarily]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const volumeValue = newVolume[0];
    video.volume = volumeValue;
    setVolume(volumeValue);
    
    if (volumeValue === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    
    showControlsTemporarily();
  }, [isMuted, showControlsTemporarily]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!video.muted);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleProgressChange = useCallback((newProgress: number[]) => {
    const video = videoRef.current;
    if (!video || duration === 0) return;

    const newTime = (newProgress[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Get volume icon
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  // YouTube embed
  if (youtubeId) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0&modestbranding=1`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </Card>
    );
  }

  // Custom video player
  return (
    <Card className={cn("overflow-hidden bg-black", className)}>
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black group cursor-pointer"
        onMouseMove={showControlsTemporarily}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1000);
          }
        }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnail}
          autoPlay={autoplay}
          muted={muted}
          playsInline
          preload="metadata"
        >
          {src && <source src={src} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center space-y-3">
              <Loader2 className="w-12 h-12 animate-spin text-white mx-auto" />
              <p className="text-white text-sm">Carregando vídeo...</p>
            </div>
          </div>
        )}

        {/* Buffering Overlay */}
        {isBuffering && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 w-16 h-16 rounded-full"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </Button>
          </div>
        )}

        {/* Controls Overlay */}
        {controls && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Time Display */}
              <div className="flex justify-end">
                <div className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <Slider
                  value={[progress]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 p-2"
                    >
                      <VolumeIcon className="w-4 h-4" />
                    </Button>
                    
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};