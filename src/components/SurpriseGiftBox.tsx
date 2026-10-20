import React, { useState, useEffect } from 'react';
import {
  Gift,
  Heart,
  Sparkles,
  CheckCircle2,
  Award,
  Coffee,
  Utensils,
  Star,
  Flame,
  Send,
  Check,
  RotateCcw,
  MessageCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audioSynth';
import { assets } from '../assets';

interface Voucher {
  id: string;
  title: string;
  desc: string;
  iconType: string;
  isUsed: boolean;
  usedAt?: string;
}

const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    title: 'Trà Sữa Full Topping Theo Yêu Cầu',
    desc: 'Bất kể sáng trưa chiều tối, em thèm là anh ship tận nơi!',
    iconType: 'coffee',
    isUsed: false,
  },
  {
    id: 'v2',
    title: 'Massage Toàn Thân & Sấy Tóc Cho Công Chúa',
    desc: 'Xoa bóp vai gáy xua tan mệt mỏi, sấy tóc nhẹ nhàng trước khi ngủ.',
    iconType: 'sparkles',
    isUsed: false,
  },
  {
    id: 'v3',
    title: 'Quyền Năng "Em Luôn Đúng 100%"',
    desc: 'Miễn trừ mọi tranh cãi trong 24h. Lời của em là chân lý tối thượng!',
    iconType: 'award',
    isUsed: false,
  },
  {
    id: 'v4',
    title: 'Một Đêm Nồng Cháy Chiều Chuộng 18+',
    desc: 'Ân ái ngọt ngào theo tư thế và nhịp điệu em thích nhất.',
    iconType: 'flame',
    isUsed: false,
  },
  {
    id: 'v5',
    title: 'Bữa Tối Lãng Mạn Do Anh Vào Bếp',
    desc: 'Nấu món em mê, dọn nến thơm và dọn dẹp sạch tinh tươm.',
    iconType: 'utensils',
    isUsed: false,
  },
  {
    id: 'v6',
    title: 'Một Điều Ước Tùy Ý Của Em',
    desc: 'Bất cứ điều gì em muốn, chỉ cần nói ra anh sẽ cố gắng hết mình!',
    iconType: 'star',
    isUsed: false,
  },
];

const STORAGE_KEY = 'love_vouchers_2010_state';
const GIFT_OPEN_KEY = 'gift_box_2010_opened';

export const SurpriseGiftBox: React.FC = () => {
  const [isOpened, setIsOpened] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GIFT_OPEN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_VOUCHERS;
  });

  const [activeNotifyVoucher, setActiveNotifyVoucher] = useState<Voucher | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [customWish, setCustomWish] = useState<string>('');
  const [customWishModal, setCustomWishModal] = useState<string | null>(null);
  const [customWishSaved, setCustomWishSaved] = useState<string>(() => {
    try {
      return localStorage.getItem('love_custom_wish_2010') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
    } catch {
      // Ignore
    }
  }, [vouchers]);

  const handleOpenGift = () => {
    setIsOpened(true);
    try {
      localStorage.setItem(GIFT_OPEN_KEY, 'true');
    } catch {
      // Ignore
    }

    audioManager.playGiftFanfare();

    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fbbf24', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fda4af', '#fb7185', '#f43f5e'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fda4af', '#fb7185', '#f43f5e'],
      });
    }, 300);
  };

  const handleRedeemVoucher = (voucher: Voucher) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });

    const updated = vouchers.map((v) =>
      v.id === voucher.id ? { ...v, isUsed: true, usedAt: timeStr } : v
    );

    setVouchers(updated);
    audioManager.playCouponRedeem();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185'],
    });

    setActiveNotifyVoucher({ ...voucher, isUsed: true, usedAt: timeStr });
  };

  const handleResetAllVouchers = () => {
    if (window.confirm('Em có muốn mở lại tất cả các phiếu quà tặng này không?')) {
      const reset = DEFAULT_VOUCHERS.map((v) => ({ ...v, isUsed: false, usedAt: undefined }));
      setVouchers(reset);
      audioManager.playSparkle();
    }
  };

  const getShareText = (v: Voucher) => {
    return `Anh yêu ơi! 💌 Hôm nay 20/10 Bé Yêu kích hoạt phiếu: "${v.title}" (${v.desc}) lúc ${v.usedAt || 'hôm nay'} nè! Anh nhớ thực hiện ngay cho em nhé! Yêu anh ❤️`;
  };

  const handleSendVoucherViaFacebook = (v: Voucher) => {
    const text = getShareText(v);
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    audioManager.playSparkle();
    window.open('https://m.me', '_blank');
  };

  const handleCopyVoucherText = (v: Voucher) => {
    const text = getShareText(v);
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    audioManager.playSparkle();
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  // SEND CUSTOM WISH VIA FACEBOOK
  const handleSendCustomWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;

    setCustomWishSaved(customWish);
    try {
      localStorage.setItem('love_custom_wish_2010', customWish);
    } catch {
      // Ignore
    }

    const text = `Anh yêu ơi! 🌟 Hôm nay 20/10 điều ước của Bé Yêu là: "${customWish}". Anh hứa là phải thực hiện cho em nha! Yêu anh ❤️`;
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    audioManager.playSparkle();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });

    // Open Wish Modal
    setCustomWishModal(customWish);
  };

  const handleOpenFacebookForWish = (wishText: string) => {
    const text = `Anh yêu ơi! 🌟 Hôm nay 20/10 điều ước của Bé Yêu là: "${wishText}". Anh hứa là phải thực hiện cho em nha! Yêu anh ❤️`;
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    audioManager.playSparkle();
    window.open('https://m.me', '_blank');
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-rose-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-rose-600 fill-rose-500" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'star':
      default:
        return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };

  const usedCount = vouchers.filter((v) => v.isUsed).length;

  return (
    <section id="hop-qua" className="w-full py-10 sm:py-14 px-3 sm:px-4 max-w-5xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-rose-500 mb-2">
          <Gift className="w-3.5 h-3.5 text-rose-500" />
          <span>Hộp Quà Bất Ngờ 20/10</span>
          <Gift className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800">
          Món Quà Ngọt Ngào Dành Cho Bé Yêu
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto px-2">
          {isOpened
            ? 'Bức ảnh đáng yêu của em và tất cả phiếu quà tặng đã sẵn sàng. Dù reload trang dữ liệu vẫn được lưu lại!'
            : 'Một chiếc hộp quà chứa đựng sự chiều chuộng tuyệt đối đang chờ em mở'}
        </p>
      </div>

      {!isOpened ? (
        /* CLOSED GIFT BOX STATE (MOBILE OPTIMIZED) */
        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenGift}
            className="cursor-pointer relative group flex flex-col items-center max-w-full"
          >
            <div className="relative w-68 sm:w-80 h-76 sm:h-92 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 transition-all duration-300 group-hover:shadow-rose-400/40 bg-rose-100">
              <img
                src={assets.girlfriendPhoto}
                alt="Bé Yêu 20/10"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-rose-900/20 to-transparent"></div>

              <div className="absolute bottom-4 inset-x-4 text-center text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-rose-100 mb-2 border border-white/30">
                  Dành riêng cho Bé Yêu ❤️
                </span>
                <p className="font-display text-base sm:text-lg font-bold leading-snug">
                  Chạm để mở hộp quà bất ngờ
                </p>
                <p className="text-[11px] text-rose-200/90 mt-0.5">
                  Bên trong có phiếu chiều chuộng & điều ngọt ngào
                </p>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-xs shadow-lg shadow-rose-400/50 group-hover:bg-rose-500 transition-colors">
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
              <span>Nhấn để bóc quà ngay</span>
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
          </motion.div>
        </div>
      ) : (
        /* OPENED REVEAL STATE */
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 sm:space-y-10"
        >
          {/* Card with Girlfriend's Real Photo */}
          <div className="bg-white rounded-3xl border border-rose-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
            <div className="md:col-span-5 relative min-h-[300px] sm:min-h-[360px] bg-rose-50">
              <img
                src={assets.girlfriendPhoto}
                alt="Bé Yêu siêu đáng yêu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-rose-700 border border-rose-200 shadow-xs flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Bé Yêu của anh tại Nhật Bản 🌸</span>
              </div>
            </div>

            <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                Món Quà Đầu Tiên
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-800 mt-1">
                Gửi Cô Gái Đáng Yêu Nhất Thế Gian
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Nhìn nụ cười hồn nhiên và rạng rỡ của em nơi xứ người, anh vừa tự hào, vừa thương và
                yêu em nhiều hơn gấp bội. Dù khoảng cách địa lý ngăn cách hai phương trời, anh luôn
                hướng về em mỗi ngày. Chúc Bé Yêu ngày 20/10 ngập tràn niềm vui, sức khỏe dồi dào và
                luôn cảm nhận được sự che chở, yêu thương từ anh!
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    audioManager.playSparkle();
                    confetti({ particleCount: 35, spread: 50 });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors border border-rose-200 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Em nhận trọn tình cảm rồi nè ❤️</span>
                </button>
                <span className="text-xs text-slate-500">
                  Đà Nẵng gửi yêu thương sang Nhật Bản
                </span>
              </div>
            </div>
          </div>

          {/* Love Coupons Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-800">
                  Bộ Phiếu Quà Tặng Chiều Chuộng (Love Coupons)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Bấm sử dụng phiếu sẽ lưu lại vĩnh viễn và tạo tin nhắn gửi qua Facebook Messenger cho anh!
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                  Đã dùng:{' '}
                  <span className="font-bold tabular-nums">
                    {usedCount}/{vouchers.length}
                  </span>{' '}
                  phiếu
                </div>

                {usedCount > 0 && (
                  <button
                    onClick={handleResetAllVouchers}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Đặt lại phiếu để dùng lại"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid of 6 vouchers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`relative rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    voucher.isUsed
                      ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                      : 'bg-white border-rose-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                        {renderIcon(voucher.iconType)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-md">
                        20/10 VIP
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {voucher.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {voucher.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-rose-200">
                    {voucher.isUsed ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã kích hoạt ({voucher.usedAt})
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveNotifyVoucher(voucher)}
                          className="w-full py-2 px-3 rounded-xl bg-[#0084FF] text-white hover:bg-[#0073e6] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Gửi qua Facebook cho Anh</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRedeemVoucher(voucher)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>Sử dụng phiếu này</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOM WISH CARD WITH DIRECT FACEBOOK MESSENGER ACTION */}
          <div className="bg-gradient-to-br from-rose-100/80 via-white to-pink-50 rounded-3xl p-5 sm:p-7 border border-rose-200 shadow-sm">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center mx-auto mb-2.5">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <h4 className="text-base sm:text-lg font-display font-bold text-slate-800">
                Bé Yêu Có Điều Ước Gì Khác Cho Hôm Nay Không?
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Gõ điều ước của em rồi bấm gửi — hệ thống sẽ tự động sao chép và mở Facebook Messenger để gửi cho anh ngay!
              </p>

              <form onSubmit={handleSendCustomWish} className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  placeholder="Gõ điều ước của em vào đây (ví dụ: tối nay call video ngắm em ngủ...)"
                  className="flex-1 px-4 py-2.5 text-xs bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0073e6] active:scale-98 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Gửi Qua Facebook Cho Anh</span>
                </button>
              </form>

              {customWishSaved && (
                <div className="mt-3.5 p-3 rounded-2xl bg-white border border-rose-200 shadow-2xs text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-slate-800">Điều ước gần nhất:</span>{' '}
                      <span className="text-xs text-rose-700 font-medium">"{customWishSaved}"</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenFacebookForWish(customWishSaved)}
                    className="self-end sm:self-auto px-3 py-1.5 rounded-xl bg-[#0084FF] text-white hover:bg-[#0073e6] text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Mở Facebook Gửi Lại</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* POPUP MODAL: CUSTOM WISH READY TO SEND VIA FACEBOOK */}
      <AnimatePresence>
        {customWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full border-2 border-rose-300 shadow-2xl text-slate-800 relative text-center"
            >
              <button
                onClick={() => setCustomWishModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2.5">
                <Star className="w-6 h-6 fill-current" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1.5 border border-rose-200">
                ✨ Điều Ước Đã Được Tạo!
              </span>

              <h3 className="text-lg font-bold text-slate-900 font-display">
                "{customWishModal}"
              </h3>

              <div className="my-3.5 p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-left text-xs text-slate-700">
                <span className="font-bold text-rose-900 block mb-0.5">Lời nhắn gửi Anh:</span>
                <p className="italic text-slate-600 leading-relaxed">
                  "Anh yêu ơi! 🌟 Hôm nay 20/10 điều ước của Bé Yêu là: \"{customWishModal}\". Anh hứa là phải thực hiện cho em nha! Yêu anh ❤️"
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleOpenFacebookForWish(customWishModal)}
                  className="w-full py-3 px-4 bg-[#0084FF] hover:bg-[#0073e6] active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Mở Facebook Messenger Gửi Anh 💬</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={() => {
                    const text = `Anh yêu ơi! 🌟 Hôm nay 20/10 điều ước của Bé Yêu là: "${customWishModal}". Anh hứa là phải thực hiện cho em nha! Yêu anh ❤️`;
                    navigator.clipboard.writeText(text);
                    setCopiedMessage(true);
                    audioManager.playSparkle();
                  }}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép điều ước!</span>
                    </>
                  ) : (
                    <span>Chỉ sao chép tin nhắn</span>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  {copiedMessage
                    ? 'Đã copy vào máy! Chỉ cần dán vào chat Facebook gửi anh nhé ❤️'
                    : 'Bấm nút xanh để mở Facebook Messenger và dán gửi anh ngay!'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SEND VOUCHER TO BOYFRIEND VIA FACEBOOK */}
      <AnimatePresence>
        {activeNotifyVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full border-2 border-rose-300 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto text-center relative"
            >
              <button
                onClick={() => setActiveNotifyVoucher(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 fill-current" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1.5 border border-rose-200">
                🎉 Đã Kích Hoạt Phiếu Quà Tặng!
              </span>

              <h3 className="text-lg font-bold text-slate-900 font-display">
                "{activeNotifyVoucher.title}"
              </h3>

              <div className="my-3.5 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-left text-xs text-slate-700 leading-relaxed font-sans">
                <span className="font-bold text-rose-900 block mb-0.5">Nội dung tin nhắn:</span>
                <p className="italic text-slate-600 mb-2">
                  "{getShareText(activeNotifyVoucher)}"
                </p>
                <span className="text-[10px] text-rose-600 font-mono">
                  Thời gian kích hoạt: {activeNotifyVoucher.usedAt}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSendVoucherViaFacebook(activeNotifyVoucher)}
                  className="w-full py-3 px-4 bg-[#0084FF] hover:bg-[#0073e6] active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Gửi Qua Facebook Messenger Cho Anh 💬</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>

                <button
                  onClick={() => handleCopyVoucherText(activeNotifyVoucher)}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã sao chép tin nhắn!</span>
                    </>
                  ) : (
                    <span>Chỉ sao chép tin nhắn</span>
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  {copiedMessage
                    ? 'Đã copy vào máy! Chỉ cần dán vào chat Facebook gửi anh nhé ❤️'
                    : 'Bấm nút xanh để mở Facebook Messenger và dán gửi anh ngay!'}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveNotifyVoucher(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 py-1 px-3"
                  >
                    Đóng lại
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
