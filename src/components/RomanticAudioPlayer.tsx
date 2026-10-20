import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Disc, ChevronDown, ChevronUp } from 'lucide-react';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const AUDIO_SRC = `${baseUrl}assets/aistudio/_______First_Love_Music_Video_4K_UPGRADE_ee93113f.mp3`;

interface RomanticAudioPlayerProps {
  onPlayStateChange?: (playing: boolean) => void;
}

export const RomanticAudioPlayer: React.FC<RomanticAudioPlayerProps> = ({ onPlayStateChange }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Attempt auto-play immediately upon page load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowAutoplayPrompt(false);
          if (onPlayStateChange) onPlayStateChange(true);
        })
        .catch(() => {
          setIsPlaying(false);
          setShowAutoplayPrompt(true);
          if (onPlayStateChange) onPlayStateChange(false);
        });
    }

    const handleFirstGesture = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          setShowAutoplayPrompt(false);
          if (onPlayStateChange) onPlayStateChange(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setShowAutoplayPrompt(false);
        if (onPlayStateChange) onPlayStateChange(true);
      }).catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      setIsMuted(false);
      audio.volume = volume || 0.75;
    } else {
      setIsMuted(true);
      audio.volume = 0;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setShowAutoplayPrompt(false);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Autoplay Banner Prompt (Only shown if browser stops initial sound) */}
      {showAutoplayPrompt && !isPlaying && (
        <div
          onClick={togglePlay}
          className="fixed top-18 inset-x-3 sm:inset-x-4 max-w-md mx-auto z-50 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 cursor-pointer animate-bounce hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Disc className="w-5 h-5 animate-spin text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Chạm để bật bài hát First Love</p>
              <p className="text-[10px] text-rose-100">Giai điệu lãng mạn dành riêng tặng Bé Yêu 20/10</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-xs shrink-0">
            Bật Nhạc 🎵
          </button>
        </div>
      )}

      {/* Floating Bottom Music Bar with collapse toggle */}
      <div className="fixed bottom-4 right-3 sm:right-5 z-40 transition-all duration-300">
        {isCollapsed ? (
          /* Mini compact vinyl disk button (Doesn't cover anything!) */
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md border border-rose-300 shadow-xl shadow-rose-300/50 flex items-center justify-center text-rose-600 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group"
            title="Mở thanh điều khiển nhạc"
            aria-label="Mở thanh điều khiển nhạc"
          >
            <Disc className={`w-7 h-7 text-rose-600 ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white animate-pulse"></span>
            )}
          </button>
        ) : (
          /* Full slim music pill */
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-rose-200/90 shadow-xl shadow-rose-200/50 rounded-full p-1.5 pl-3 transition-transform">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 cursor-pointer group"
              title={isPlaying ? 'Tạm dừng nhạc First Love' : 'Phát nhạc First Love'}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-300'
                    : 'bg-rose-100 text-rose-600 group-hover:bg-rose-200'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </div>

              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[125px] sm:max-w-[170px]">
                    First Love · Utada Hikaru
                  </span>
                  {isPlaying && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-rose-500 font-medium block leading-tight">
                  {isPlaying ? 'Giai điệu tình yêu đang phát' : 'Chạm để nghe bài hát'}
                </span>
              </div>
            </button>

            {/* Volume on desktop */}
            <div className="hidden sm:flex items-center gap-1.5 pl-1.5 border-l border-rose-100 pr-1">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Bật âm' : 'Tắt âm'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 accent-rose-500 h-1.5 bg-rose-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Collapse/Minimize toggle button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              title="Thu nhỏ thanh nhạc để không che chữ"
              aria-label="Thu nhỏ thanh nhạc"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
