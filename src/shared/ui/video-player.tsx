import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Maximize, 
  Minimize,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  src?: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  className?: string;
  muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  thumbnail,
  autoplay = false,
  className,
  muted = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [firstPlay, setFirstPlay] = useState(true);
  const [fired50, setFired50] = useState(false);
  const [fired75, setFired75] = useState(false);
  const [fired90, setFired90] = useState(false);
  const [volume, setVolume] = useState(muted ? 0 : 0.8);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { trackVideoEvent } = useAnalytics();

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
      setDuration(video.duration || 0);
      setFirstPlay(true);
      setFired50(false);
      setFired75(false);
      setFired90(false);
      video.volume = volume;
      video.muted = isMuted;
    };

    const handleError = (e: Event) => {
      if (import.meta.env.DEV) {
        console.error('Video error:', e);
      }
      setIsLoading(false);
      setHasError(true);
      setIsBuffering(false);
    };

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      setCurrentTime(t);
      const ratio = duration > 0 ? t / duration : 0;
      if (!fired50 && ratio >= 0.5) {
        setFired50(true);
        trackVideoEvent('progress_50', { video_title: title, video_provider: 'native' });
      }
      if (!fired75 && ratio >= 0.75) {
        setFired75(true);
        trackVideoEvent('progress_75', { video_title: title, video_provider: 'native' });
      }
      if (!fired90 && ratio >= 0.9) {
        setFired90(true);
        trackVideoEvent('progress_90', { video_title: title, video_provider: 'native' });
      }
    };
    const handlePlay = () => {
      setIsPlaying(true);
      if (firstPlay) {
        trackVideoEvent('start', { video_title: title, video_provider: 'native' });
        setFirstPlay(false);
      }
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setFirstPlay(true);
      setFired50(false);
      setFired75(false);
      setFired90(false);
      trackVideoEvent('complete', { video_title: title, video_provider: 'native' });
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', () => setIsLoading(false));
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', () => setIsLoading(false));
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [volume, isMuted, duration, fired50, fired75, fired90, firstPlay, title, trackVideoEvent]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().then(() => {
        trackVideoEvent('click_to_play', {
          video_title: title,
          video_provider: 'native'
        });
      }).catch(error => {
        if (import.meta.env.DEV) {
          console.error('Error playing video:', error);
        }
        setHasError(true);
      });
    }
    showControlsTemporarily();
  }, [isPlaying, showControlsTemporarily, src, title, trackVideoEvent]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const volumeValue = newVolume[0] / 100;
    video.volume = volumeValue;
    setVolume(volumeValue);
    video.muted = volumeValue === 0;
    setIsMuted(volumeValue === 0);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

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

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        if (import.meta.env.DEV) {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        }
      });
    } else {
      document.exitFullscreen();
    }
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <Card className={cn("overflow-hidden bg-black", className)}>
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black group cursor-pointer"
        onMouseMove={showControlsTemporarily}
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

        {(isLoading || isBuffering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        )}

        {!isPlaying && !isLoading && src && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-16 h-16 rounded-full pointer-events-none"
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </Button>
          </div>
        )}

        {(!src || hasError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-fire-orange/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-fire-orange" />
              </div>
              <p className="text-white/80">
                {!src ? "Vídeo não disponível" : "Erro ao carregar vídeo"}
              </p>
              {hasError && (
                <p className="text-white/60 text-xs">
                  Verifique sua conexão ou tente novamente
                </p>
              )}
            </div>
          </div>
        )}

        {(showControls || !isPlaying) && src && !hasError && (
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity opacity-100"
          >
          <div className="absolute bottom-0 left-0 right-0 p-4" onClick={(e) => e.stopPropagation()}>
            <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={0.1} />
            <div className="flex items-center justify-between text-white mt-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                      <VolumeIcon />
                    </Button>
                    <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} className="w-24" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
                  {isFullscreen ? <Minimize /> : <Maximize />}
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

export default VideoPlayer;
