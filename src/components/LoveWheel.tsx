import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Flame, Check, Heart, X, MessageCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audioSynth';

interface Slice {
  id: number;
  shortLabel: string;
  label: string;
  sub: string;
  bgColor: string;
}

const WHEEL_18_SLICES: Slice[] = [
  {
    id: 1,
    shortLabel: '💆 Massage Body',
    label: 'Massage Toàn Thân Tinh Dầu',
    sub: 'Không bỏ sót chỗ nào, xoa dịu từng tấc da thịt',
    bgColor: '#9f1239', // deep rose
  },
  {
    id: 2,
    shortLabel: '💋 Hôn Sâu 5 Phút',
    label: 'Hôn Sâu & Cắn Tai 5 Phút',
    sub: 'Nụ hôn nồng cháy, mơn trớn đánh thức xúc cảm',
    bgColor: '#e11d48', // rose red
  },
  {
    id: 3,
    shortLabel: '👑 Tư Thế Em Chọn',
    label: 'Tư Thế Em Chọn 100%',
    sub: 'Em làm chủ cuộc yêu nồng nhiệt đêm nay',
    bgColor: '#be123c', // ruby
  },
  {
    id: 4,
    shortLabel: '🔥 Dạo Đầu 30 Phút',
    label: 'Dạo Đầu Ướt Át 30 Phút',
    sub: 'Chậm rãi, cưng chiều từng điểm nhạy cảm của em',
    bgColor: '#881337', // dark wine
  },
  {
    id: 5,
    shortLabel: '👄 Cởi Đồ Bằng Miệng',
    label: 'Cởi Đồ Chỉ Bằng Miệng',
    sub: 'Thử thách quyến rũ, cởi từng món đồ của đối phương',
    bgColor: '#c026d3', // fuchsia
  },
  {
    id: 6,
    shortLabel: '🛁 Tắm Chung Bồn Nước',
    label: 'Tắm Chung Bồn Nước Ấm',
    sub: 'Tắm cùng nhau, kỳ cọ và âu yếm trong làn hơi nước',
    bgColor: '#db2777', // pink
  },
  {
    id: 7,
    shortLabel: '🤫 Thì Thầm Hư Hỏng',
    label: 'Thì Thầm Hư Hỏng Vào Tai',
    sub: 'Nói những lời ngọt ngào và táo bạo nhất khiến em run rẩy',
    bgColor: '#9d174d', // berry
  },
  {
    id: 8,
    shortLabel: '⚡ Đêm Cuồng Nhiệt',
    label: 'Một Đêm Không Giới Hạn',
    sub: 'Yêu thương và chiều chuộng em suốt cả đêm dài',
    bgColor: '#b91c1c', // red
  },
];

export const LoveWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<Slice | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [spinHistory, setSpinHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spin_18_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentAngleRef = useRef<number>(0);
  const numSlices = WHEEL_18_SLICES.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Draw wheel with strictly upright, readable text orientation
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 12;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = angle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = WHEEL_18_SLICES[i].bgColor;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw text: SMART ORIENTATION so text is NEVER upside down!
      const midAngle = (startAngle + sliceAngle / 2) % (2 * Math.PI);
      const normalizedAngle = midAngle < 0 ? midAngle + 2 * Math.PI : midAngle;

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(normalizedAngle);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Plus Jakarta Sans, system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;

      // If angle is pointing in the left half (PI/2 to 3*PI/2), flip text so it reads upright
      if (normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI) / 2) {
        ctx.rotate(Math.PI);
        ctx.textAlign = 'left';
        ctx.fillText(WHEEL_18_SLICES[i].shortLabel, -radius + 20, 4);
      } else {
        ctx.textAlign = 'right';
        ctx.fillText(WHEEL_18_SLICES[i].shortLabel, radius - 20, 4);
      }

      ctx.restore();
    }

    // Outer ring border
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#7f1d1d';
    ctx.stroke();

    // Center pivot circle
    ctx.beginPath();
    ctx.arc(center, center, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#e11d48';
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedReward(null);
    setShowResultModal(false);
    setCopied(false);

    const targetIndex = Math.floor(Math.random() * numSlices);
    const extraRounds = 5 + Math.floor(Math.random() * 3);

    const targetMidAngle = targetIndex * sliceAngle + sliceAngle / 2;
    const finalAngle =
      (3 * Math.PI) / 2 - targetMidAngle + extraRounds * 2 * Math.PI;

    const startAngle = currentAngleRef.current % (2 * Math.PI);
    const totalRotation = finalAngle - startAngle;

    const duration = 4000;
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalRotation * easeProgress;
      currentAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle * 0.9) {
        audioManager.playWheelTick();
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        const reward = WHEEL_18_SLICES[targetIndex];
        setSelectedReward(reward);
        setShowResultModal(true);

        const updatedHistory = [reward.label, ...spinHistory.slice(0, 5)];
        setSpinHistory(updatedHistory);
        try {
          localStorage.setItem('spin_18_history', JSON.stringify(updatedHistory));
        } catch {
          // Ignore
        }

        audioManager.playGiftFanfare();
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fbbf24'],
        });
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const getRewardMessage = (reward: Slice) => {
    return `Anh yêu ơi! 💋 Hôm nay 20/10 Bé Yêu quay trúng ô 18+: "${reward.label}" (${reward.sub}) nè! Anh chuẩn bị tinh thần thực hiện cho em nha! 🔥❤️`;
  };

  const handleSendViaFacebook = () => {
    if (!selectedReward) return;
    const message = getRewardMessage(selectedReward);
    navigator.clipboard.writeText(message);
    setCopied(true);
    audioManager.playSparkle();

    // Open Facebook Messenger directly
    window.open('https://m.me', '_blank');
  };

  const handleCopyOnly = () => {
    if (!selectedReward) return;
    const message = getRewardMessage(selectedReward);
    navigator.clipboard.writeText(message);
    setCopied(true);
    audioManager.playSparkle();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="vong-quay" className="w-full py-10 sm:py-14 px-3 sm:px-4 max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-600 mb-2">
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
          <span>Vòng Quay May Mắn 18+ Cho Bé Yêu</span>
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Vòng Quay Cuồng Nhiệt & Chiều Chuộng
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto px-2">
          Chữ được thiết kế to rõ ràng, dễ đọc. Quay trúng là có thể gửi ngay qua Facebook Messenger cho anh!
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 bg-gradient-to-br from-white via-rose-50/50 to-pink-50/60 rounded-3xl p-5 sm:p-8 border border-rose-300/80 shadow-xl">
        {/* Wheel Box (Fixed readable font & size) */}
        <div className="relative flex flex-col items-center">
          {/* Top Arrow Pointer */}
          <div className="absolute -top-3.5 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-0 h-0 border-l-[11px] sm:border-l-[13px] border-l-transparent border-r-[11px] sm:border-r-[13px] border-r-transparent border-t-[22px] sm:border-t-[24px] border-t-rose-600 filter drop-shadow-md"></div>
          </div>

          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] transition-transform select-none"
          />

          {/* Center Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-tight flex flex-col items-center justify-center shadow-lg border-2 border-white transition-transform cursor-pointer ${
              isSpinning ? 'opacity-80 scale-95' : 'hover:scale-110 active:scale-95'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 mb-0.5" />
            <span>{isSpinning ? '...' : 'QUAY'}</span>
          </button>
        </div>

        {/* Spin Info on side */}
        <div className="flex-1 max-w-sm w-full space-y-3.5 text-center md:text-left">
          <div className="bg-white/90 border border-rose-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <Flame className="w-7 h-7 text-rose-500 mx-auto mb-2 fill-rose-100" />
            <h4 className="font-bold text-slate-800 text-sm">
              Chạm nút "QUAY" ở giữa bánh xe
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Quay xong popup sẽ hiện lên để Bé Yêu gửi tin nhắn qua Facebook Messenger cho anh!
            </p>
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="mt-3.5 w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{isSpinning ? 'Bánh xe đang quay...' : 'Bắt đầu quay ngay'}</span>
            </button>
          </div>

          {/* Persistent History */}
          {spinHistory.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5 text-center md:text-left">
                Các phần thưởng Bé Yêu đã quay trúng:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {spinHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 bg-white/95 px-3 py-1.5 rounded-xl border border-rose-100 shadow-2xs"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear List of all 8 prizes for easy reading */}
      <div className="mt-8 bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-6 border border-rose-200 shadow-xs">
        <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Danh Sách 8 Món Quà Chiều Chuộng 18+ Trên Bánh Xe</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {WHEEL_18_SLICES.map((slice) => (
            <div
              key={slice.id}
              className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50 border border-rose-100 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                {slice.id}
              </span>
              <div>
                <p className="font-bold text-slate-900 leading-tight">{slice.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{slice.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP MODAL NOTIFICATION WITH DIRECT FACEBOOK MESSENGER SEND */}
      <AnimatePresence>
        {showResultModal && selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full border-2 border-rose-300 shadow-2xl relative text-center"
            >
              <button
                onClick={() => setShowResultModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                <Flame className="w-8 h-8 fill-rose-500 text-rose-600 animate-pulse" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1.5 border border-rose-200">
                🎉 Xin Chúc Mừng Bé Yêu!
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-rose-950 font-display">
                "{selectedReward.label}"
              </h3>

              <p className="text-xs sm:text-sm text-rose-700 mt-1.5 italic font-medium leading-relaxed px-2">
                {selectedReward.sub}
              </p>

              {/* Message Preview */}
              <div className="my-3.5 p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-left text-xs text-slate-700">
                <span className="font-bold text-rose-900 block mb-0.5">Nội dung tin nhắn:</span>
                <p className="italic text-slate-600 leading-relaxed">
                  "{getRewardMessage(selectedReward)}"
                </p>
              </div>

              {/* Actions: Send via Facebook Messenger or Copy */}
              <div className="space-y-2">
                <button
                  onClick={handleSendViaFacebook}
                  className="w-full py-3 px-4 bg-[#0084FF] hover:bg-[#0073e6] active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Gửi Qua Facebook Messenger 💬</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={handleCopyOnly}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép tin nhắn!</span>
                    </>
                  ) : (
                    <span>Chỉ sao chép tin nhắn</span>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  {copied
                    ? 'Đã copy vào máy! Chỉ cần dán vào chat Facebook gửi anh nhé ❤️'
                    : 'Nhấn nút xanh để mở Facebook Messenger và dán gửi anh ngay!'}
                </p>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      setShowResultModal(false);
                      spinWheel();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Quay thêm lượt nữa</span>
                  </button>
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
