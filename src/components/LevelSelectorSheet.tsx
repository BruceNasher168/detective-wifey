import React, { useState } from 'react';
import { LevelMetadata } from '../types/case-schema';
import { Lock, Star, AlertTriangle, X, Play } from 'lucide-react';

interface LevelSelectorSheetProps {
  levels: LevelMetadata[];
  activeLevelNumber: number;
  unlockedMaxLevel: number;
  starRatings: Record<string, 1 | 2 | 3>;
  onSelectLevel: (levelNumber: number) => void;
  onClose: () => void;
}

export const LevelSelectorSheet: React.FC<LevelSelectorSheetProps> = ({
  levels,
  activeLevelNumber,
  unlockedMaxLevel,
  starRatings,
  onSelectLevel,
  onClose,
}) => {
  const [lockedBannerMsg, setLockedBannerMsg] = useState<string | null>(null);

  const handleLevelClick = (level: LevelMetadata) => {
    if (level.levelNumber > unlockedMaxLevel) {
      // Block level launch & display gating banner (AC 6)
      setLockedBannerMsg('Bạn cần vượt qua màn chơi trước để mở khóa màn này!');
      return;
    }

    setLockedBannerMsg(null);
    onSelectLevel(level.levelNumber);
  };

  return (
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end animate-fadeIn select-none font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[85%] bg-slate-900 border-t border-white/20 rounded-t-3xl p-4 shadow-2xl space-y-3 overflow-y-auto animate-slideUp text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Pill */}
        <div
          className="w-10 h-1 bg-slate-600 rounded-full mx-auto cursor-pointer"
          onClick={onClose}
        />

        {/* Sheet Header */}
        <div className="flex justify-between items-start pb-2 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              HỒ SƠ VỤ ÁN & CHỌN MÀN CHƠI
            </h2>
            <p className="text-xs text-slate-400">
              Chồng: Hoàng (32 tuổi • CEO Triệu Phú)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gated Restriction Banner (AC 6) */}
        {lockedBannerMsg && (
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lockedBannerMsg}</span>
          </div>
        )}

        {/* Level Cards */}
        <div className="space-y-2.5 pt-1">
          {levels.map((level) => {
            const isUnlocked = level.levelNumber <= unlockedMaxLevel;
            const isActive = level.levelNumber === activeLevelNumber;
            const stars = starRatings[level.caseId] || (level.levelNumber === 1 ? 3 : level.levelNumber === 2 ? 2 : 0);

            return (
              <div
                key={level.caseId}
                onClick={() => handleLevelClick(level)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                    : isUnlocked
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white/[0.02] border-white/5 opacity-55'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">
                      {level.levelTitle}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                        Đang chơi
                      </span>
                    )}
                  </div>

                  {isUnlocked ? (
                    /* Earned Star Rating using Lucide vector Stars */
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Padlock Icon (AC 5) */
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>KHÓA</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {level.storySnippet}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[10px] text-slate-400">
                    Giới hạn: {level.allowedStrikes} Lượt nghi ngờ
                  </span>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(level.levelNumber);
                      }}
                      className="flex items-center gap-1 min-h-[36px] px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isActive ? 'Tiếp tục điều tra' : 'Chơi màn này'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-medium">
                      Mở sau Màn {level.unlockRequirementLevel - 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

