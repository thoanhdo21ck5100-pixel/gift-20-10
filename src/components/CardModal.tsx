import React, { useState } from 'react';
import { Heart, Copy, Check, Printer, Sparkles, X } from 'lucide-react';
import { assets } from '../assets';
import { audioManager } from '../utils/audioSynth';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  message: string;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName,
  message,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('to', recipientName);
    url.searchParams.set('from', senderName);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    audioManager.playSparkle();
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    audioManager.playSparkle();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-rose-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3 border-b border-rose-100 flex items-center justify-between bg-rose-50/60">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Thiệp Chúc Mừng 20/10 Gửi Bé Yêu</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-rose-100/60 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content with Real Photo */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30">
          <div className="relative bg-white rounded-2xl border-2 border-rose-200 p-5 sm:p-7 shadow-xs text-center">
            {/* Real photo of Bé Yêu */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-3 border-rose-300 shadow-md mb-3 bg-rose-50">
              <img
                src={assets.girlfriendPhoto}
                alt="Bé Yêu"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-rose-500">
              Ngày Phụ Nữ Việt Nam · 20/10/2026
            </span>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-rose-900 mt-1">
              Gửi {recipientName}
            </h3>

            <p className="text-xs sm:text-sm font-serif italic text-slate-700 mt-3 leading-relaxed whitespace-pre-line px-1 sm:px-2">
              "{message.slice(0, 220)}..."
            </p>

            <div className="mt-5 pt-3.5 border-t border-rose-100 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] text-slate-500 block">Ký tên:</span>
                <span className="text-sm font-script font-bold text-rose-800">
                  {senderName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                <Heart className="w-3 h-3 fill-rose-500" />
                <span>Đà Nẵng · Nhật Bản</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In thiệp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors cursor-pointer active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã copy link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link Tặng Bé Yêu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
