import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import { Play, Pause, Loader2, AlertCircle, Maximize } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

interface VideoPlayerMobileProps {
  src?: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  className?: string;
  muted?: boolean;
}

export const VideoPlayerMobile: React.FC<VideoPlayerMobileProps> = ({
  src,
  title,
  thumbnail,
  autoplay = false,
  className,
  muted = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [firstPlay, setFirstPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { trackVideoEvent } = useAnalytics();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    checkMobile();
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const hideControlsWithDelay = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    hideControlsWithDelay();
  }, [hideControlsWithDelay]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      video.volume = muted ? 0 : 0.8;
      video.muted = muted;
    };
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => {
      setIsPlaying(true);
      hideControlsWithDelay();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      setFirstPlay(true);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [muted, hideControlsWithDelay]);

  const handleCenterTap = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const video = videoRef.current;
    if (!video || !src || hasError) return;

    if (isPlaying) {
      video.pause();
      trackVideoEvent('video_pause', {
        video_title: title,
        video_provider: 'native',
        current_time: currentTime
      });
    } else {
      setIsLoading(true);
      video.play().then(() => {
        setIsLoading(false);
        
        // Try fullscreen on first play (mobile)
        if (firstPlay && isMobile) {
          setFirstPlay(false);
          
          // Request fullscreen on mobile devices
          const container = containerRef.current;
          if (container) {
            // iOS Safari uses webkitEnterFullscreen on video element
            if ('webkitEnterFullscreen' in video) {
              (video as any).webkitEnterFullscreen();
            } else if (container.requestFullscreen) {
              container.requestFullscreen().catch(() => {
                // Fullscreen failed, continue normally
              });
            }
          }
        }
        
        trackVideoEvent('video_play', {
          video_title: title,
          video_provider: 'native',
          is_first_play: firstPlay
        });
        
        setFirstPlay(false);
      }).catch(error => {
        setIsLoading(false);
        setHasError(true);
        console.error('Video play error:', error);
      });
    }
  }, [isPlaying, src, hasError, currentTime, title, firstPlay, isMobile, trackVideoEvent]);

  const handleContainerTap = useCallback((e: React.MouseEvent) => {
    if (!isPlaying) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const tapRadius = Math.min(rect.width, rect.height) * 0.15; // 30% of smaller dimension
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );
    
    // Only trigger play/pause if tap is in center zone
    if (distance <= tapRadius) {
      handleCenterTap(e);
    } else {
      // Show controls temporarily for other areas
      showControlsTemporarily();
    }
  }, [isPlaying, handleCenterTap, showControlsTemporarily]);

  const retry = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    
    setHasError(false);
    setIsLoading(true);
    video.load();
  }, [src]);

  if (!src) {
    return (
      <Card className={cn("overflow-hidden bg-black", className)}>
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-fire-orange" />
            </div>
            <p className="text-white/80 text-sm">{title}</p>
            <p className="text-white/60 text-xs">Vídeo não disponível</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden bg-black", className)}>
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black group cursor-pointer select-none"
        onClick={handleContainerTap}
        onTouchStart={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnail}
          autoPlay={autoplay}
          muted={muted}
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <p className="text-white/80 text-sm">Carregando...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center space-y-4 p-4">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-2">
                <p className="text-white/90 font-medium">Erro ao carregar vídeo</p>
                <p className="text-white/60 text-sm">Verifique sua conexão e tente novamente</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); retry(); }}
                className="bg-fire-orange hover:bg-fire-orange/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* YouTube-style Play Button - Only before first play */}
        {!isPlaying && !isLoading && !hasError && firstPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm text-white w-20 h-20 rounded-full flex items-center justify-center transition-all hover:bg-black/70 hover:scale-110">
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Mobile-optimized Controls Overlay */}
        {(showControls && isPlaying) && !isLoading && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 transition-opacity duration-300">
            {/* Progress Bar - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-white/20 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-fire-orange h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Time and fullscreen */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-white text-sm font-medium">
                  {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const container = containerRef.current;
                    if (container && container.requestFullscreen) {
                      container.requestFullscreen();
                    }
                  }}
                  className="text-white/80 hover:text-white p-2"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Play/Pause Indicator - Temporary */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/40 text-white w-16 h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" fill="currentColor" />}
              </div>
            </div>
          </div>
        )}

        {/* Tap Zone Indicator (dev only - remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 border-2 border-fire-orange/30 rounded-full opacity-20" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoPlayerMobile;