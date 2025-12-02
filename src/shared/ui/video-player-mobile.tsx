import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import { Play, Pause, Loader2, AlertCircle, Maximize, RotateCcw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

type WebKitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type WebKitFullscreenContainer = Element & { webkitRequestFullscreen?: () => Promise<void> | void };
type ScreenWithOrientation = Screen & { orientation?: { lock?: (orientation: 'landscape' | 'portrait' | string) => Promise<void> } };

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
  muted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [firstPlay, setFirstPlay] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fired50, setFired50] = useState(false);
  const [fired75, setFired75] = useState(false);
  const [fired90, setFired90] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const { trackVideoEvent } = useAnalytics();

  const formatTime = useCallback((time: number) => {
    if (!isFinite(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Attach video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      video.muted = muted;
      setFired50(false);
      setFired75(false);
      setFired90(false);
      if (autoplay) {
        setIsLoading(true);
        video.play().catch(() => setIsLoading(false));
      }
    };
    const handleCanPlay = () => {
      // Media can start playing
      setIsLoading(false);
    };
    const handlePlaying = () => {
      // Actually playing (after potential buffering)
      setIsLoading(false);
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
      showControlsTemporarily();
      if (firstPlay) {
        trackVideoEvent('start', { video_title: title, video_provider: 'native' });
        setFirstPlay(false);
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    const handleWaiting = () => {
      // Buffering
      setIsLoading(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      setFirstPlay(true);
      setFired50(false);
      setFired75(false);
      setFired90(false);
      trackVideoEvent('complete', { video_title: title, video_provider: 'native' });
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
      video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [autoplay, muted, showControlsTemporarily, firstPlay, title, trackVideoEvent, duration, fired50, fired75, fired90]);

  const enterMobileFullscreen = useCallback(async () => {
    const video = videoRef.current as WebKitVideo | null;
    const container = containerRef.current as (WebKitFullscreenContainer | null);
    try {
      // iOS Safari native fullscreen if available
      if (video && typeof video.webkitEnterFullscreen === 'function') {
        video.webkitEnterFullscreen();
      } else if (container && (container.requestFullscreen || container.webkitRequestFullscreen)) {
        await (container.requestFullscreen?.() || container.webkitRequestFullscreen?.());
      }
      // Try orientation lock to landscape when fullscreen
      const orientation = (screen as ScreenWithOrientation).orientation;
      if (orientation && typeof orientation.lock === 'function') {
        orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {
      // Non-fatal
    }
  }, []);

  const playPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src || hasError) return;
    if (isPlaying) {
      video.pause();
    } else {
      // User-initiated play → click_to_play
      if (firstPlay) {
        trackVideoEvent('click_to_play', { video_title: title, video_provider: 'native' });
      }
      setIsLoading(true);
      // Enter fullscreen on mobile when starting playback
      enterMobileFullscreen();
      video.play().catch(() => setIsLoading(false));
    }
  }, [isPlaying, src, hasError, firstPlay, title, trackVideoEvent, enterMobileFullscreen]);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Centro do elemento funciona como play/pause
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const radius = Math.min(rect.width, rect.height) * 0.30; // 30% do menor lado
    const inCenter = dx * dx + dy * dy <= radius * radius;
    if (inCenter) {
      e.stopPropagation();
      playPause();
    }
  }, [playPause]);

  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || duration === 0) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = Math.min(Math.max(0, ratio * duration), duration);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    showControlsTemporarily();
  }, [duration, showControlsTemporarily]);

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current as WebKitVideo | null;
    const container = containerRef.current as (WebKitFullscreenContainer | null);
    if (!container && !video) return;
    try {
      if (!document.fullscreenElement) {
        // Prefer native iOS fullscreen when available
        if (video && typeof video.webkitEnterFullscreen === 'function') {
          video.webkitEnterFullscreen();
        } else if (container && (container.requestFullscreen || container.webkitRequestFullscreen)) {
          await (container.requestFullscreen?.() || container.webkitRequestFullscreen?.());
        }
        const orientation = (screen as ScreenWithOrientation).orientation;
        if (orientation && typeof orientation.lock === 'function') {
          orientation.lock('landscape').catch(() => {});
        }
      } else {
        await document.exitFullscreen?.();
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const retry = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    setHasError(false);
    setIsLoading(true);
    video.load();
  }, [src]);

  if (!src) {
    return (
      <Card className={cn('overflow-hidden bg-black', className)}>
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto bg-red-600/20 rounded-full flex items-center justify-center">
              <Play className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-white/80 text-sm">{title}</p>
            <p className="text-white/60 text-xs">Vídeo indisponível</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden bg-black', className)}>
      <div
        ref={containerRef}
        className="relative aspect-video bg-black select-none"
        onClick={handleContainerClick}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnail}
          autoPlay={false}
          muted={muted}
          playsInline
          preload="metadata"
          controls={false}
        >
          <source src={src} type={src?.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          Your browser does not support the video tag.
        </video>

        {/* Loading */}
        {isLoading && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}

        {/* Error */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center space-y-3 p-4">
              <div className="w-14 h-14 mx-auto bg-red-600/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-white/90 font-medium">Erro ao carregar vídeo</p>
              <p className="text-white/60 text-xs">Verifique sua conexão e tente novamente</p>
              <button
                onClick={(e) => { e.stopPropagation(); retry(); }}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Primeira fase: apenas thumb + único botão de play central */}
        {!isPlaying && !isLoading && !hasError && firstPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-white fill-current ml-0.5" />
            </div>
          </div>
        )}

        

        {/* Controls (YouTube-like) - não mostrar na primeira fase */}
        {(!firstPlay) && (showControls || isPlaying) && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pb-3" onClick={(e) => e.stopPropagation()}>
              {/* Progress */}
              <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden" onClick={handleProgressBarClick}>
                <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
              </div>
              {/* Controls row */}
              <div className="mt-2 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button
                    aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    className="p-1.5 active:scale-95"
                    onClick={(e) => { e.stopPropagation(); playPause(); }}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div className="text-xs font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Reiniciar"
                    className="p-1.5 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      const v = videoRef.current; if (v) { v.currentTime = 0; }
                    }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    aria-label={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
                    className="p-1.5 active:scale-95"
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoPlayerMobile;
