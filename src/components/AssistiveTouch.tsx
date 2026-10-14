import React, { useState } from 'react';
import {
  IoHome,
  IoBook,
  IoLayers,
  IoRefresh,
  IoExpand,
  IoContract,
  IoPhonePortrait,
  IoClose,
} from 'react-icons/io5';

interface AssistiveTouchProps {
  onGoHome: () => void;
  onOpenNotebook: () => void;
  onOpenLevelSelector: () => void;
  onRestartLevel: () => void;
  onToggleFullscreen: () => void;
  onOpenPwaGuide: () => void;
  isFullscreen: boolean;
}

export const AssistiveTouch: React.FC<AssistiveTouchProps> = ({
  onGoHome,
  onOpenNotebook,
  onOpenLevelSelector,
  onRestartLevel,
  onToggleFullscreen,
  onOpenPwaGuide,
  isFullscreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Assistive Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-3 bottom-20 w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform cursor-pointer focus:outline-none"
        aria-label="Menu Trợ Năng"
      >
        <div className="w-7 h-7 rounded-full border-2 border-white/70 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
        </div>
      </button>

      {/* Centered Popup Menu Modal */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 bg-slate-900/95 border border-white/20 rounded-2xl p-4 shadow-2xl space-y-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Menu Trợ Năng (iOS)
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onGoHome();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                <IoHome className="w-4 h-4 text-sky-400" />
                <span>Màn hình chính</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenNotebook();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                <IoBook className="w-4 h-4 text-rose-400" />
                <span>Sổ tay của vợ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenLevelSelector();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                <IoLayers className="w-4 h-4 text-amber-400" />
                <span>Chọn màn chơi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onToggleFullscreen();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                {isFullscreen ? (
                  <IoContract className="w-4 h-4 text-emerald-400" />
                ) : (
                  <IoExpand className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isFullscreen ? 'Xem Chế Độ Trình Duyệt' : 'Toàn màn hình'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenPwaGuide();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                <IoPhonePortrait className="w-4 h-4 text-indigo-400" />
                <span>Cài đặt như App (PWA)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onRestartLevel();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium transition-colors"
              >
                <IoRefresh className="w-4 h-4 text-slate-400" />
                <span>Chơi lại màn này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

