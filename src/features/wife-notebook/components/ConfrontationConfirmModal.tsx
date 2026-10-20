import React, { useEffect, useRef } from 'react';
import {
  IoScaleOutline,
  IoWarningOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoGitNetworkOutline,
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
    convictionChance,
    potentialStars,
    isLowSuccessRate,
    verifiedCluesList = [],
    verifiedStringsList = [],
  } = preflight;

  const cluesProgressPercent = Math.min(100, Math.max(5, (cluesFound / totalClues) * 100));

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
        className="w-full max-w-[420px] h-[85vh] max-h-[720px] bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col space-y-3.5 animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onCancel();
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
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

        {/* Clues Summary & Conviction Chance Progress */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Manh mối cốt lõi đã tìm:</span>
            <span className="font-mono font-bold text-amber-400">
              {cluesFound}/{totalClues} manh mối
            </span>
          </div>

          {/* Progress Bar (width calculated in CSS without visible text %) */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLowSuccessRate
                  ? 'bg-rose-500'
                  : convictionChance?.level === 'very_high'
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${cluesProgressPercent}%` }}
            />
          </div>

          {/* Conviction Chance Level Pill & Potential Stars */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400">Khả năng kết tội:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                  isLowSuccessRate
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : convictionChance?.level === 'high'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {convictionChance?.displayText || 'Rất thấp'}
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

        {/* Low Conviction Chance Warning Banner (no numerical %) */}
        {isLowSuccessRate && (
          <div
            role="alert"
            className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-1 animate-pulse shrink-0"
          >
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <IoWarningOutline className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                CẢNH BÁO: Khả năng kết tội rất thấp ({convictionChance?.genericWord || 'Very low'})!
              </span>
            </div>
            <p className="leading-relaxed text-[11px] text-rose-200/90 pl-5">
              Bạn chưa thu thập đủ manh mối then chốt. Nếu đối chất lúc này, chồng sẽ dễ dàng chối cãi và bạn sẽ mất 1 lượt nghi ngờ nếu thất bại!
            </p>
          </div>
        )}

        {/* Verified Clues & Strings Scrollable List (Expanded height) */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {/* Verified Strings Section */}
          {verifiedStringsList.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <IoGitNetworkOutline className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Dây nối đã xác thực ({verifiedStringsList.length})</span>
              </div>
              <div className="space-y-1">
                {verifiedStringsList.map((str, idx) => (
                  <div
                    key={str.id || idx}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-200 truncate">
                        <IoCheckmarkCircleOutline className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{str.sourceTitle} ↔ {str.targetTitle}</span>
                      </div>
                      {str.isSmokingGun && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40">
                          Then chốt
                        </span>
                      )}
                    </div>
                    {str.hint && (
                      <p className="text-[11px] text-slate-300 italic pl-5 line-clamp-2">
                        &ldquo;{str.hint}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Clues Section */}
          {verifiedCluesList.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <IoDocumentTextOutline className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Manh mối đã xác thực ({verifiedCluesList.length})</span>
              </div>
              <div className="space-y-1">
                {verifiedCluesList.map((clue, idx) => (
                  <div
                    key={clue.id || idx}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200"
                  >
                    <IoCheckmarkCircleOutline className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{clue.title}</div>
                      {clue.snippet && (
                        <div className="text-[10px] text-slate-400 truncate">{clue.snippet}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {verifiedCluesList.length === 0 && verifiedStringsList.length === 0 && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-slate-400 italic">
              Chưa có manh mối hoặc dây nối nào được xác thực trên bảng điều tra.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/10 shrink-0">
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
              {isLowSuccessRate ? 'Vẫn đối chất' : 'Bắt đầu đối chất'}
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
