import React, { useState } from 'react';
import { Heart, Sparkles, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audioSynth';

export const LoveLetterEnvelope: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const recipientName = 'Bé Yêu';
  const senderName = 'Anh Yêu Của Em';

  const defaultLetter = `Gửi Bé Yêu - người con gái anh yêu thương nhất,\n\nNhân ngày 20/10 - Ngày Phụ nữ Việt Nam, dù khoảng cách giữa Đà Nẵng và Nhật Bản có xa xôi đến đâu, trái tim và mọi nỗi nhớ của anh lúc nào cũng hướng trọn về phía em.\n\nCảm ơn em vì đã luôn kiên trì, mạnh mẽ và dịu dàng bước cùng anh trên chặng đường này. Giữa những ngày bận rộn nơi xứ sở hoa anh đào hay những chiều lộng gió bên bờ biển Đà Nẵng, anh luôn cảm thấy may mắn vô bờ vì trong đời có em.\n\nChúc Bé Yêu của anh ngày 20/10 thật nhiều niềm vui, luôn xinh đẹp rạng rỡ, giữ ấm bản thân thật tốt và luôn mỉm cười hạnh phúc. Chờ anh nhé, ngày gặp lại anh sẽ bù đắp cho em tất cả những cái ôm ấm áp nhất!\n\nMãi mãi yêu và thương Bé Yêu!`;

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      audioManager.playOpenLetter();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fbbf24'],
      });
      setIsOpen(true);
    }
  };

  return (
    <section id="thu-tinh" className="w-full py-10 sm:py-14 px-3 sm:px-4 max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-500 mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Bức Thư Tình 20/10 Nối Liền Khoảng Cách</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800">
          Gửi Bé Yêu Từ Nơi Trái Tim Anh
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto px-2">
          {isOpen
            ? 'Bức thư tay đã mở ra, gói trọn mọi nhớ thương gửi đến Bé Yêu'
            : 'Chạm nhẹ vào con dấu sáp vàng để mở bức thư tình gửi từ Đà Nẵng đến Nhật Bản'}
        </p>
      </div>

      {/* Main Interactive Envelope Container (Optimized for Mobile) */}
      <div className="relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* SEALED ENVELOPE */
            <motion.div
              key="sealed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleOpenEnvelope}
              className="relative cursor-pointer group select-none max-w-full"
            >
              {/* Envelope Body */}
              <div className="w-[290px] sm:w-[420px] h-[240px] sm:h-[280px] bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 rounded-3xl shadow-2xl border border-rose-200/90 relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-rose-300/40">
                {/* Triangular top flap design */}
                <div className="absolute top-0 left-0 right-0 h-0 border-t-[110px] sm:border-t-[130px] border-t-rose-200/80 border-x-[145px] sm:border-x-[210px] border-x-transparent z-10 filter drop-shadow-sm transition-transform origin-top group-hover:brightness-95"></div>

                {/* Postage stamp & flight path */}
                <div className="relative z-20 flex justify-between items-start">
                  <div className="border border-rose-300/80 rounded-xl p-1.5 sm:p-2 px-2.5 sm:px-3 bg-white/85 backdrop-blur-xs text-left shadow-xs">
                    <span className="block text-xs font-bold text-rose-800">
                      Gửi: {recipientName} ❤️
                    </span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-rose-600 mt-0.5">
                      <Plane className="w-3 h-3 text-rose-500" />
                      <span>Đà Nẵng · Nhật Bản ✈️🌸</span>
                    </span>
                    <span className="block text-[8px] sm:text-[9px] text-slate-500 mt-0.5">
                      20.10.2026 · Đường bay tình yêu
                    </span>
                  </div>

                  <div className="w-11 sm:w-13 h-13 sm:h-15 bg-white/90 border-2 border-dashed border-rose-400 rounded-lg flex flex-col items-center justify-center shadow-xs p-1">
                    <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-400" />
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-rose-700 mt-0.5 uppercase tracking-tighter">
                      20/10 AIR
                    </span>
                    <span className="text-[6px] sm:text-[7px] text-slate-400">JAPAN ⇄ VN</span>
                  </div>
                </div>

                {/* Wax Seal Center button */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-rose-600 to-amber-600 p-1 shadow-lg shadow-rose-900/30 flex items-center justify-center border-2 border-amber-200/60"
                  >
                    <div className="w-full h-full rounded-full bg-rose-700/95 border border-amber-300/50 flex flex-col items-center justify-center text-white">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-200 text-amber-200 animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-amber-100 tracking-tighter mt-0.5">
                        20 / 10
                      </span>
                    </div>
                    <div className="absolute -inset-1 rounded-full bg-rose-400/20 animate-ping pointer-events-none"></div>
                  </motion.div>
                </div>

                {/* Bottom Sender tag */}
                <div className="relative z-20 text-center pt-6 sm:pt-8">
                  <p className="text-xs text-rose-800 font-medium tracking-wide">
                    Từ: <span className="font-bold text-rose-950">{senderName}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-rose-600/80 mt-1 flex items-center justify-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span>Nhấn con dấu để mở thư tình</span>
                    <Sparkles className="w-3 h-3 text-rose-400" />
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* OPENED LETTER PARCHMENT (MOBILE FRIENDLY) */
            <motion.div
              key="opened-letter"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-rose-200/90 p-5 sm:p-10 relative overflow-hidden text-slate-800"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2.5 left-2.5 text-rose-300/70 pointer-events-none text-base sm:text-xl font-serif">
                ❦
              </div>
              <div className="absolute top-2.5 right-2.5 text-rose-300/70 pointer-events-none text-base sm:text-xl font-serif">
                ❦
              </div>

              {/* Letter Header */}
              <div className="text-center border-b border-rose-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] sm:text-[11px] font-semibold mb-2 border border-rose-200/60">
                  <Plane className="w-3 h-3 text-rose-500" />
                  <span>Đà Nẵng ⇄ Nhật Bản · Tình Yêu Vượt Khoảng Cách</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-script text-rose-900 font-bold">
                  Gửi Bé Yêu Của Anh
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Ngày 20 tháng 10 năm 2026 · Dành trọn mọi yêu thương đến em
                </p>
              </div>

              {/* Letter Body */}
              <div className="prose prose-rose max-w-none text-slate-700 leading-relaxed font-sans text-xs sm:text-base whitespace-pre-line px-1 sm:px-4">
                {defaultLetter}
              </div>

              {/* Letter Signature */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[11px] sm:text-xs text-slate-500 block">Mãi mãi yêu Bé Yêu,</span>
                  <span className="text-lg sm:text-2xl font-script font-bold text-rose-800">
                    {senderName}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => {
                      audioManager.playSparkle();
                      confetti({ particleCount: 30, spread: 60 });
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 shadow-sm transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Em nhận được thư rồi ❤️</span>
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Gấp lại phong bì"
                  >
                    Gấp lại
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
