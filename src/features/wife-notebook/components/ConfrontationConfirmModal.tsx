import React, { useEffect, useRef } from 'react';
import {
  IoScaleOutline,
  IoWarningOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoStar,
} from 'react-icons/io5';
import { useSwipeBack } from '../../../shared/gestures/useSwipeBack';
import type { ConfrontationPreflightInfo } from '../confrontationEngine';

export interface ConfrontationConfirmModalProps {
  isOpen: boolean;
  preflight: ConfrontationPreflightInfo;
  husbandName?: string;
  onConfirmConfront: () => void;
  onCancel: () => void;
}

export const ConfrontationConfirmModal: React.FC<ConfrontationConfirmModalProps> = ({
  isOpen,
  preflight,
  husbandName = 'Hoàng',
  onConfirmConfront,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipeBack({
    onBack: onCancel,
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) return;
    const firstButton = dialogRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])');
    firstButton?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    totalClues,
    cluesFound,
    cluesFoundPercent,
    successRate,
    potentialStars,
    isLowSuccessRate,
    verifiedCluesList,
  } = preflight;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-confrontation-title"
      className="absolute inset-0 z-[75] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none font-sans animate-fadeIn"
      onClick={onCancel}
      {...swipeHandlers}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[380px] max-h-[90vh] bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col space-y-4 animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onCancel();
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center">
              <IoScaleOutline className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 id="confirm-confrontation-title" className="text-base font-bold text-white">
                Xác Nhận Đối Chất
              </h3>
              <p className="text-[11px] text-slate-400">Chất vấn chồng {husbandName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Đóng"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>

        {/* Clues Summary & Progress Bar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Manh mối cốt lõi đã tìm:</span>
            <span className="font-mono font-bold text-amber-400">
              {cluesFound}/{totalClues} ({cluesFoundPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLowSuccessRate
                  ? 'bg-rose-500'
                  : successRate >= 100
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, cluesFoundPercent))}%` }}
            />
          </div>

          {/* Success Probability Pill & Potential Stars */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400">Tỷ lệ thành công:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono font-extrabold text-sm ${
                  isLowSuccessRate
                    ? 'text-rose-400'
                    : successRate >= 100
                    ? 'text-emerald-400'
                    : 'text-amber-300'
                }`}
              >
                {successRate}%
              </span>
              {potentialStars > 0 && (
                <div className="inline-flex items-center text-amber-400 text-xs">
                  {Array.from({ length: potentialStars }).map((_, i) => (
                    <IoStar key={i} className="w-3 h-3" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Success Rate Warning Banner */}
        {isLowSuccessRate && (
          <div
            role="alert"
            className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-1 animate-pulse"
          >
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <IoWarningOutline className="w-4 h-4 text-rose-400 shrink-0" />
              <span>CẢNH BÁO: Tỷ lệ thành công rất thấp ({successRate}%)!</span>
            </div>
            <p className="leading-relaxed text-[11px] text-rose-200/90 pl-5">
              Bạn chưa tìm đủ tối thiểu 50% manh mối (cần ít nhất 5/10 manh mối). Nếu đối chất ngay lúc này, chồng sẽ dễ dàng chối bay chối biến và vạch nghi ngờ sẽ tăng thêm 1 vạch nếu thất bại!
            </p>
          </div>
        )}

        {/* Verified Clues Mini-List */}
        <div className="space-y-1.5 flex-1 overflow-y-auto max-h-36 pr-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <IoDocumentTextOutline className="w-3.5 h-3.5" />
            <span>Chứng cứ đã ghim vào sổ tay ({verifiedCluesList.length})</span>
          </div>

          {verifiedCluesList.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2 text-center">
              Chưa có manh mối nào được ghim.
            </p>
          ) : (
            <div className="space-y-1">
              {verifiedCluesList.slice(0, 6).map((clue, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-slate-200"
                >
                  <IoCheckmarkCircleOutline className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{clue.title}</span>
                </div>
              ))}
              {verifiedCluesList.length > 6 && (
                <p className="text-[10px] text-slate-400 text-center italic">
                  + thêm {verifiedCluesList.length - 6} chứng cứ khác
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onConfirmConfront}
            className={`w-full min-h-[48px] rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-lg ${
              isLowSuccessRate
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
            }`}
          >
            <IoScaleOutline className="w-4 h-4" />
            <span>
              {isLowSuccessRate ? 'Vẫn đối chất' : `Bắt đầu đối chất (${successRate}%)`}
            </span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <IoSearchOutline className="w-3.5 h-3.5" />
            <span>Điều tra thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
