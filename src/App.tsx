import React, { useState, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Gift,
  Music,
  Flame,
  Plane,
  Flower2,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { FallingPetalsCanvas } from './components/FallingPetalsCanvas';
import { RomanticAudioPlayer } from './components/RomanticAudioPlayer';
import { LoveLetterEnvelope } from './components/LoveLetterEnvelope';
import { SurpriseGiftBox } from './components/SurpriseGiftBox';
import { LoveWheel } from './components/LoveWheel';
import { CardModal } from './components/CardModal';
import { audioManager } from './utils/audioSynth';
import { assets } from './assets';
import confetti from 'canvas-confetti';

export default function App() {
  const recipientName = 'Bé Yêu';
  const senderName = 'Anh Yêu Của Em';
  const letterMessage = `Gửi Bé Yêu - người con gái anh yêu thương nhất,\n\nNhân ngày 20/10 - Ngày Phụ nữ Việt Nam, dù khoảng cách giữa Đà Nẵng và Nhật Bản có xa xôi đến đâu, trái tim và mọi nỗi nhớ của anh lúc nào cũng hướng trọn về phía em.\n\nChúc Bé Yêu của anh ngày 20/10 thật nhiều niềm vui, luôn xinh đẹp rạng rỡ, giữ ấm bản thân thật tốt và luôn mỉm cười hạnh phúc. Chờ anh nhé, ngày gặp lại anh sẽ bù đắp cho em tất cả những cái ôm ấm áp nhất!`;

  const [petalsIntensity, setPetalsIntensity] = useState<'gentle' | 'vibrant' | 'off'>('vibrant');
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleHeroExplore = () => {
    audioManager.playSparkle();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#ffffff'],
    });
    const letterEl = document.getElementById('thu-tinh');
    if (letterEl) {
      letterEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToGift = () => {
    audioManager.playSparkle();
    const giftEl = document.getElementById('hop-qua');
    if (giftEl) {
      giftEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setVideoPlaying(true);
    } else {
      v.pause();
      setVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  };

  const [copiedFooterLink, setCopiedFooterLink] = useState<boolean>(false);

  const handleShareViaFacebook = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Ignore
    }
    setCopiedFooterLink(true);
    audioManager.playSparkle();

    // If mobile native share is available, open share sheet
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Món Quà 20/10 Gửi Bé Yêu ❤️',
          text: 'Món quà 20/10 ngọt ngào từ Đà Nẵng gửi sang Nhật Bản cho Bé Yêu!',
          url: url,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to opening Messenger
      }
    }

    // Direct fallback: Open Facebook Messenger
    window.open('https://m.me', '_blank');
    setTimeout(() => setCopiedFooterLink(false), 4000);
  };

  const handleCopyPageUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Ignore
    }
    setCopiedFooterLink(true);
    audioManager.playSparkle();
    setTimeout(() => setCopiedFooterLink(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50/70 via-pink-50/40 to-amber-50/20 text-slate-800">
      {/* Falling Petals & Hearts Particle Layer */}
      <FallingPetalsCanvas intensity={petalsIntensity} />

      {/* Romantic Background Audio Player (First Love - Utada Hikaru) */}
      <RomanticAudioPlayer />

      {/* TOP NAVIGATION BAR (Optimized for Desktop & Mobile) */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-rose-200/70">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="text-base sm:text-xl font-display font-bold text-rose-900 tracking-tight whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-500" />
            <span>20/10 · Dành Cho Bé Yêu</span>
          </a>

          {/* Zone 2: Navigation Links (hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a
              href="#thu-tinh"
              className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
            >
              Thư Tình
            </a>
            <a
              href="#hop-qua"
              className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
            >
              Hộp Quà
            </a>
            <a
              href="#vong-quay"
              className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Vòng Quay 18+</span>
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Thiệp 20/10</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-3 sm:px-4 max-w-6xl mx-auto">
        {/* Top Indicator Strip */}
        <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8 pb-2.5 sm:pb-3 border-b border-rose-200/60 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium text-slate-700 text-[11px] sm:text-xs truncate">
            <Plane className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="font-semibold text-rose-700">Đà Nẵng · Nhật Bản ✈️🌸</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-slate-500">Tình Yêu Vượt Khoảng Cách</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
            <Flower2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden xs:inline">Hoa rơi:</span>
            <button
              onClick={() =>
                setPetalsIntensity((prev) =>
                  prev === 'vibrant' ? 'gentle' : prev === 'gentle' ? 'off' : 'vibrant'
                )
              }
              className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-600 font-medium hover:bg-rose-50 transition-colors cursor-pointer text-[10px] sm:text-[11px]"
            >
              {petalsIntensity === 'vibrant'
                ? 'Rực rỡ 🌸'
                : petalsIntensity === 'gentle'
                ? 'Thoang thoảng 🍃'
                : 'Tắt ⏸️'}
            </button>
          </div>
        </div>

        {/* Hero 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Romantic Headline & Prose */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 border border-rose-200 text-rose-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
              <span>Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-[1.2] text-balance">
              Gửi <span className="text-rose-600 font-script font-bold text-3xl sm:text-5xl md:text-6xl">Bé Yêu</span>, Người Phụ Nữ Đẹp Nhất Trong Lòng Anh
            </h1>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Dù một người ở Đà Nẵng, một người ở Nhật Bản, khoảng cách hàng ngàn cây số chẳng thể
              làm vơi đi nỗi nhớ và tình yêu anh dành cho em. 20/10 này, anh gửi tặng Bé Yêu cả bầu
              trời hoa rơi, giai điệu bài hát First Love ngọt ngào và những bất ngờ chỉ dành riêng cho em.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={handleHeroExplore}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-300 transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95"
              >
                <Music className="w-4 h-4" />
                <span>Mở Bức Thư Tình Gửi Bé Yêu</span>
              </button>

              <button
                onClick={handleScrollToGift}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4 text-rose-500" />
                <span>Bóc Hộp Quà 20/10</span>
              </button>
            </div>

            {/* Sweet tags */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-rose-600">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Đà Nẵng ⇄ Nhật Bản</span>
              </span>
              <span>·</span>
              <span>365 ngày trân trọng</span>
              <span>·</span>
              <span>Hôm nay Bé Yêu là công chúa</span>
            </div>
          </div>

          {/* Right Column: Hero Real Video of Girlfriend */}
          <div className="lg:col-span-5 relative mt-2 sm:mt-0">
            <div className="relative mx-auto max-w-[340px] sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 bg-white">
              {/* Real Video Player */}
              <div className="relative aspect-3/4 sm:aspect-4/5 overflow-hidden bg-rose-950">
                <video
                  ref={videoRef}
                  src={assets.girlfriendVideo}
                  autoPlay
                  loop
                  muted={videoMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video controls overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                  <button
                    onClick={toggleVideoMute}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
                    title={videoMuted ? 'Bật tiếng video' : 'Tắt tiếng video'}
                  >
                    {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleVideoPlay}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
                    title={videoPlaying ? 'Tạm dừng video' : 'Phát video'}
                  >
                    {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>

                {/* Scrim gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"></div>

                {/* Bottom Video Caption */}
                <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Khoảnh khắc của Bé Yêu tại Nhật Bản</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold line-clamp-2 drop-shadow-sm">
                    Nụ cười của Bé Yêu là điều dịu dàng và đẹp đẽ nhất trong lòng anh!
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 sm:p-4 bg-white text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                    20.10.2026 · First Love
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Bé Yêu & Anh</span>
                </div>
                <p className="text-xs text-slate-600 font-serif italic">
                  "Hạnh phúc là khi cách xa nửa vòng trái đất, tim mình vẫn chung một nhịp đập."
                </p>
              </div>
            </div>

            {/* Small Floating Real Photo Badge */}
            <div className="absolute -bottom-3 sm:-bottom-4 -left-2 sm:-left-5 bg-white/95 backdrop-blur-md border border-rose-200 shadow-xl rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 z-20">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-rose-200">
                <img
                  src={assets.girlfriendPhoto}
                  alt="Bé Yêu mini"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pr-1">
                <p className="text-[11px] sm:text-xs font-bold text-rose-900 leading-tight">
                  Công chúa của anh
                </p>
                <p className="text-[9px] sm:text-[10px] text-rose-500 font-medium">
                  Luôn mỉm cười rạng rỡ nhé 🌸
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: LOVE LETTER ENVELOPE (Đà Nẵng & Nhật Bản) */}
      <LoveLetterEnvelope />

      {/* SECTION 2: SURPRISE GIFT BOX & VOUCHERS (With real photo & persistent localStorage) */}
      <SurpriseGiftBox />

      {/* SECTION 3: 18+ LUCKY LOVE WHEEL (With result notification popup modal) */}
      <LoveWheel />

      {/* FOOTER (With generous bottom padding and prominent Facebook Share button) */}
      <footer className="w-full border-t border-rose-200/80 bg-white/75 backdrop-blur-md pt-8 pb-28 sm:pb-16 px-4 text-center mt-12">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-3.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span className="font-semibold text-slate-800">
              Món Quà 20/10 Ngày Phụ Nữ Việt Nam
            </span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>

          <p className="text-slate-600 font-medium">
            Dành riêng tặng <span className="font-bold text-rose-700">{recipientName}</span> từ{' '}
            <span className="font-bold text-slate-800">{senderName}</span>
          </p>

          {/* PROMINENT FACEBOOK MESSENGER SHARE BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 my-2 w-full sm:w-auto">
            <button
              onClick={handleShareViaFacebook}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0084FF] hover:bg-[#0073e6] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Gửi link qua Facebook</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={handleCopyPageUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 active:scale-95 text-rose-700 border border-rose-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {copiedFooterLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Đã sao chép link web!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép link trang web</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            {copiedFooterLink
              ? 'Đã sao chép link trang web vào máy! Hãy dán gửi cho Bé Yêu nhé ❤️'
              : 'Bấm nút trên để mở Messenger và gửi đường link trang web cho người yêu'}
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-1 text-rose-600 hover:text-rose-800 transition-colors text-xs font-semibold cursor-pointer py-1 px-3 rounded-lg hover:bg-rose-50"
          >
            Về đầu trang ↑
          </button>
        </div>
      </footer>

      {/* MODAL: SHARE GREETING CARD */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        recipientName={recipientName}
        senderName={senderName}
        message={letterMessage}
      />
    </div>
  );
}
