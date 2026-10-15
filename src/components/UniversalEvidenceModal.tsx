import React from 'react';
import { IoClose, IoPin, IoShieldOutline } from 'react-icons/io5';
import { useSwipeBack } from '../hooks/useSwipeBack';

export interface UniversalEvidenceItem {
  title: string;
  snippet: string;
  suspectToTag: string;
  subtitle?: string;
}

interface UniversalEvidenceModalProps {
  isOpen: boolean;
  item: UniversalEvidenceItem | null;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
}

export const UniversalEvidenceModal: React.FC<UniversalEvidenceModalProps> = ({
  isOpen,
  item,
  onPinEvidence,
  onClose,
}) => {
  const swipeHandlers = useSwipeBack({ onBack: onClose });

  if (!isOpen || !item) return null;

  const handlePin = () => {
    onPinEvidence(item.suspectToTag);
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none font-sans animate-fadeIn"
      onClick={onClose}
    >
      <div
        {...swipeHandlers}
        className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl border border-white/40 animate-scaleUp flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Badge & Close */}
        <div className="flex items-center justify-between pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 shadow-xs">
            <IoPin className="w-3.5 h-3.5 fill-rose-600 shrink-0" />
            <span>Bằng Chứng Nghi Vấn</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Đóng"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-[#0F172A] leading-snug break-words">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-xs text-[#64748B] mt-0.5">{item.subtitle}</p>
          )}
        </div>

        {/* Evidence Snippet Quote */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 border-l-4 border-l-rose-500 max-h-40 overflow-y-auto">
          <p className="text-xs text-slate-700 leading-relaxed italic whitespace-pre-line select-text font-normal">
            {item.snippet}
          </p>
        </div>

        {/* Suspect Attribution */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <IoShieldOutline className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Đối tượng liên quan:</span>
          <span className="font-bold text-slate-800 truncate">
            {item.suspectToTag}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handlePin}
            className="w-full min-h-[48px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
          >
            <IoPin className="w-4 h-4 fill-white" />
            <span>Ghim Vào Sổ Tay Bắt Ghen</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 rounded-2xl font-semibold text-xs flex items-center justify-center transition-all"
          >
            <span>Bỏ qua</span>
          </button>
        </div>
      </div>
    </div>
  );
};

