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
  const [isLoading, setIsLoading] = useState(false); // Start as false for mobile compatibility
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [isMuted, setIsMuted] = useState(muted);
  
  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
      setDuration(video.duration || 0);
      
      // Set maximum volume on mobile, use controlled volume on desktop
      if (isMobile) {
        video.volume = 1.0; // Maximum volume for mobile
        video.muted = false;
        setVolume(1.0);
        setIsMuted(false);
      } else {
        if (video.volume !== undefined) {
          video.volume = volume;
        }
        video.muted = isMuted;
      }
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
  }, [title, duration, hasStarted, hasTracked25, hasTracked50, hasTracked75, hasTrackedComplete, trackVideoEvent, trackingEvents, volume, isMuted, isMobile]);

  // Control functions
  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      try {
        await video.play();
        
        // Auto-fullscreen and landscape on mobile when play starts
        if (isMobile) {
          // iPhone/iPad specific handling
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // iOS requires user interaction for fullscreen
            if ('webkitEnterFullscreen' in video) {
              try {
                setTimeout(() => {
                  (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
                }, 50);
              } catch (err) {
                console.log('iOS webkitEnterFullscreen failed:', err);
              }
            }
            
            // Multiple approaches for iOS landscape orientation
            setTimeout(() => {
              try {
                // Method 1: Screen Orientation API
                if (screen.orientation && 'lock' in screen.orientation) {
                  (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape-primary').catch((err: Error) => {
                    console.log('Screen orientation lock failed:', err);
                    // Try landscape-secondary as fallback
                    (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape-secondary').catch(() => {
                      // Try generic landscape
                      (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape').catch(() => {
                        console.log('All landscape orientations failed');
                      });
                    });
                  });
                }
                
                // Method 2: Legacy webkit orientation (iOS Safari)
                if ('webkitRequestFullscreen' in document.documentElement) {
                  const style = document.createElement('style');
                  style.innerHTML = `
                    @media screen and (orientation: portrait) {
                      html, body { 
                        transform: rotate(90deg);
                        transform-origin: center center;
                        width: 100vh;
                        height: 100vw;
                        overflow: hidden;
                      }
                    }
                  `;
                  document.head.appendChild(style);
                  
                  // Remove style after 5 seconds
                  setTimeout(() => {
                    document.head.removeChild(style);
                  }, 5000);
                }
                
                // Method 3: Request orientation change via meta viewport
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                  const originalContent = viewport.getAttribute('content');
                  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, orientation=landscape');
                  
                  // Restore after 3 seconds
                  setTimeout(() => {
                    if (originalContent) {
                      viewport.setAttribute('content', originalContent);
                    }
                  }, 3000);
                }
                
              } catch (err) {
                console.log('iOS landscape methods failed:', err);
              }
            }, 300); // Increased delay for iOS
          } else {
            // Android handling
            try {
              if (container && container.requestFullscreen) {
                await container.requestFullscreen();
              } else if (container && 'webkitRequestFullscreen' in container) {
                await (container as HTMLDivElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
              }
              
              // Lock orientation for Android
              if (screen.orientation && 'lock' in screen.orientation) {
                setTimeout(async () => {
                  try {
                    await (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape');
                  } catch (err) {
                    console.log('Android landscape lock failed:', err);
                  }
                }, 100);
              }
            } catch (err) {
              console.log('Android fullscreen failed:', err);
            }
          }
        }
      } catch (error) {
        console.error('Play failed:', error);
      }
    }
    showControlsTemporarily();
  }, [isPlaying, showControlsTemporarily, isMobile]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const volumeValue = newVolume[0] / 100; // Convert percentage to decimal
    
    try {
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
    } catch (error) {
      console.warn('Volume adjustment failed:', error);
    }
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


  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    try {
      if (!document.fullscreenElement) {
        // Mobile-specific fullscreen handling
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          // Try video element fullscreen first for mobile
          if ('webkitEnterFullscreen' in video) {
            (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
          } else if (container.requestFullscreen) {
            await container.requestFullscreen();
          } else if ('webkitRequestFullscreen' in container) {
            await (container as HTMLDivElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
          }
          
          // Force landscape orientation on mobile
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as ScreenOrientation & { lock: (orientation: string) => Promise<void> }).lock('landscape');
            } catch (err) {
              console.log('Orientation lock not supported');
            }
          }
        } else {
          // Desktop fullscreen
          await container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ('webkitExitFullscreen' in document) {
          (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
        }
        
        // Unlock orientation when exiting fullscreen
        if (screen.orientation && 'unlock' in screen.orientation) {
          try {
            (screen.orientation as ScreenOrientation & { unlock: () => void }).unlock();
          } catch (err) {
            console.log('Orientation unlock not supported');
          }
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
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

        {/* Loading Overlay - Hidden on mobile to prevent infinite loading visual */}
        {isLoading && (
          <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/50">
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

        {/* Play Button Overlay - Always visible when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 w-16 h-16 rounded-full shadow-lg"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </Button>
          </div>
        )}

        {/* Controls Overlay - Only show after video has started */}
        {controls && hasStarted && (
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
                {/* Desktop Controls */}
                <div className="hidden sm:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 p-2 h-8 w-8"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="text-white hover:bg-white/20 p-2 h-8 w-8"
                    >
                      <VolumeIcon className="w-4 h-4" />
                    </Button>
                    
                    <div className="w-16" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                      <Slider
                        value={[isMuted ? 0 : Math.round(volume * 100)]}
                        onValueChange={handleVolumeChange}
                        onValueCommit={handleVolumeChange}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Mobile - Empty left side (no controls) */}
                <div className="sm:hidden"></div>

                {/* Fullscreen Button - Right Side */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="text-white hover:bg-white/20 p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                >
                  {isFullscreen ? <Minimize className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};