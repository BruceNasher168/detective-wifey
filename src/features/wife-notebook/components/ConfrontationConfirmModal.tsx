import React, { useEffect, useRef, useState } from 'react';
import {
  IoScaleOutline,
  IoWarningOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoStar,
} from 'react-icons/io5';
import { useSwipeBack } from '../../../shared/gestures/useSwipeBack';
import type { ConfrontationPreflightInfo, SuspectOnBoard } from '../confrontationEngine';

export interface ConfrontationConfirmModalProps {
  isOpen: boolean;
  preflight: ConfrontationPreflightInfo;
  suspectsOnBoard?: SuspectOnBoard[];
  selectedSuspectId?: string | null;
  husbandName?: string;
  onSelectSuspect?: (suspectId: string | null) => void;
  onConfirmConfront: (suspectId?: string) => void;
  onCancel: () => void;
}

export const ConfrontationConfirmModal: React.FC<ConfrontationConfirmModalProps> = ({
  isOpen,
  preflight,
  suspectsOnBoard = [],
  selectedSuspectId,
  husbandName = 'Hoàng',
  onSelectSuspect,
  onConfirmConfront,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // If suspectsOnBoard is provided and has items, and selectedSuspectId is not set, default to Step 1 (picker)
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedSuspectId !== undefined
      ? selectedSuspectId
      : (suspectsOnBoard.length > 0 ? null : (preflight?.accusedSuspectId || null)),
  );

  useEffect(() => {
    if (selectedSuspectId !== undefined) {
      setInternalSelectedId(selectedSuspectId);
    }
  }, [selectedSuspectId]);

  const hasSuspectList = suspectsOnBoard.length > 0;
  const currentSuspectId = selectedSuspectId !== undefined ? selectedSuspectId : internalSelectedId;
  const isStep1 = hasSuspectList && !currentSuspectId;

  const swipeHandlers = useSwipeBack({
    onBack: isStep1 ? onCancel : (hasSuspectList ? () => handleResetSuspect() : onCancel),
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) return;
    const firstButton = dialogRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])');
    firstButton?.focus();
  }, [isOpen, isStep1]);

  if (!isOpen) return null;

  const {
    totalClues,
    cluesFound,
    cluesFoundDisplay,
    convictionChance,
    potentialStars,
    isLowSuccessRate,
    isWrongSuspect,
    verifiedCluesList = [],
  } = preflight;

  const cluesProgressPercent = isWrongSuspect
    ? 0
    : Math.min(100, Math.max(0, (cluesFound / totalClues) * 100));

  // Resolve suspect info for Step 2
  const selectedSuspect = suspectsOnBoard.find(s => s.id === currentSuspectId);
  const selectedSuspectDisplayName =
    selectedSuspect?.displayName ||
    preflight.accusedSuspectName ||
    'Đối tượng nghi vấn';
  const selectedSuspectAlias =
    selectedSuspect?.alias ||
    preflight.accusedSuspectAlias;

  const handleSelectSuspect = (id: string) => {
    setInternalSelectedId(id);
    onSelectSuspect?.(id);
  };

  const handleResetSuspect = () => {
    setInternalSelectedId(null);
    onSelectSuspect?.(null);
  };

  const handleConfirm = () => {
    onConfirmConfront(currentSuspectId || preflight.accusedSuspectId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-confrontation-title"
      className="absolute inset-0 z-[75] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none font-sans animate-fadeIn"
      onClick={onCancel}
      {...swipeHandlers}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[440px] h-[90vh] max-h-[780px] bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl text-white flex flex-col space-y-3.5 animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onCancel();
          }
        }}
      >
        {/* STEP 1: Suspect Selection List */}
        {isStep1 ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-rose-400">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center">
                  <IoPersonOutline className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 id="confirm-confrontation-title" className="text-base font-bold text-white">
                    Chọn Nghi Phạm Chất Vấn
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Chọn người bạn nghi là tiểu tam để chất vấn chồng {husbandName}
                  </p>
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

            {/* Instruction banner */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 shrink-0">
              Danh sách nghi phạm đã xuất hiện trên bảng điều tra:
            </div>

            {/* Suspects on Board List */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {suspectsOnBoard.map((suspect) => (
                <button
                  key={suspect.id}
                  type="button"
                  onClick={() => handleSelectSuspect(suspect.id)}
                  className="w-full min-h-[56px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 hover:border-rose-400/50 flex items-center justify-between gap-3 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                      <IoPersonOutline className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors truncate">
                        {suspect.displayName}
                      </div>
                      {suspect.alias && (
                        <div className="text-xs text-amber-300 truncate">
                          Bí danh: {suspect.alias}
                        </div>
                      )}
                      {suspect.roleOrSubtitle && (
                        <div className="text-[11px] text-slate-400 truncate">
                          {suspect.roleOrSubtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-rose-400 shrink-0">
                    <span>Chọn</span>
                    <IoChevronForwardOutline className="w-4 h-4" />
                  </div>
                </button>
              ))}

              {suspectsOnBoard.length === 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2.5">
                  <IoWarningOutline className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="font-bold text-sm text-white">Chưa có nghi phạm trên bảng</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bạn chưa gắn thẻ hoặc đưa nghi phạm nào lên bảng điều tra. Hãy quay lại tìm kiếm thêm chứng cứ trước khi đối chất!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={onCancel}
                className="w-full min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <IoSearchOutline className="w-3.5 h-3.5" />
                <span>Điều tra thêm</span>
              </button>
            </div>
          </>
        ) : (
          /* STEP 2: Selected Suspect Clues & Conviction Confirmation */
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-rose-400">
                {hasSuspectList && (
                  <button
                    type="button"
                    onClick={handleResetSuspect}
                    aria-label="Chọn nghi phạm khác"
                    className="min-w-[36px] min-h-[36px] -ml-1 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <IoChevronBackOutline className="w-5 h-5" />
                  </button>
                )}
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
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

            {/* Selected Suspect Info Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/15 to-purple-500/15 border border-rose-400/30 flex items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                  <IoPersonOutline className="w-4 h-4 text-rose-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold">
                    Nghi phạm bị chất vấn
                  </div>
                  <div className="font-bold text-sm text-white truncate">
                    {selectedSuspectDisplayName}
                  </div>
                  {selectedSuspectAlias && (
                    <div className="text-xs text-amber-300 truncate">
                      Bí danh: {selectedSuspectAlias}
                    </div>
                  )}
                </div>
              </div>

              {hasSuspectList && (
                <button
                  type="button"
                  onClick={handleResetSuspect}
                  className="min-h-[36px] px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 hover:text-white shrink-0 transition-all cursor-pointer"
                >
                  Đổi người
                </button>
              )}
            </div>

            {/* Clues Summary & Conviction Chance Progress */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Manh mối cốt lõi đã tìm:</span>
                <span className="font-mono font-bold text-amber-400">
                  {cluesFoundDisplay || (isWrongSuspect ? 'Không áp dụng' : `${cluesFound}/${totalClues} manh mối`)}
                </span>
              </div>

              {/* Progress Bar (visual width calculated in CSS without visible raw %) */}
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
                    {convictionChance?.displayText || (isWrongSuspect ? 'Rất thấp (Very low)' : 'Rất thấp')}
                  </span>
                  {potentialStars > 0 && !isWrongSuspect && (
                    <div className="inline-flex items-center text-amber-400 text-xs">
                      {Array.from({ length: potentialStars }).map((_, i) => (
                        <IoStar key={i} className="w-3 h-3" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Low Conviction Chance Warning Banner (qualitative words only, no raw %) */}
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
                  {isWrongSuspect
                    ? 'Bạn đang chất vấn sai người hoặc không có bằng chứng ngoại tình với người này. Nếu đối chất lúc này, bạn sẽ thất bại và bị trừ 1 lượt nghi ngờ!'
                    : `Bạn chưa thu thập đủ manh mối then chốt liên quan đến ${selectedSuspectDisplayName}. Nếu đối chất lúc này, chồng sẽ dễ dàng chối cãi và bạn sẽ mất 1 lượt nghi ngờ nếu thất bại!`}
                </p>
              </div>
            )}

            {/* Verified Clues Relating to This Person (Expanded scrollable container, NO red strings) */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <IoDocumentTextOutline className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Manh mối liên quan đã thu thập ({verifiedCluesList.length})</span>
              </div>

              {verifiedCluesList.length > 0 ? (
                <div className="space-y-1.5">
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
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-slate-400 italic">
                  Chưa có manh mối nào liên quan đến người này được xác thực trên bảng điều tra.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={handleConfirm}
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

              <div className="flex items-center gap-2">
                {hasSuspectList && (
                  <button
                    type="button"
                    onClick={handleResetSuspect}
                    className="flex-1 min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <IoPersonOutline className="w-3.5 h-3.5" />
                    <span>Chọn nghi phạm khác</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <IoSearchOutline className="w-3.5 h-3.5" />
                  <span>Điều tra thêm</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
