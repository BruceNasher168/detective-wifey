import React from 'react';
import { ActiveSessionState } from '../types/app-contracts';
import { RotateCcw, Play } from 'lucide-react';
import { useSwipeBack } from '../hooks/useSwipeBack';

interface ResumeSessionModalProps {
  session: ActiveSessionState;
  onResume: () => void;
  onRestart: () => void;
}

export const ResumeSessionModal: React.FC<ResumeSessionModalProps> = ({
  session,
  onResume,
  onRestart,
}) => {
  const swipeHandlers = useSwipeBack({ onBack: onResume });

  return (
    <div
      {...swipeHandlers}
      className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none font-sans"
    >
      <div className="w-full max-w-xs bg-slate-900 border border-white/20 rounded-2xl p-5 shadow-2xl space-y-4 text-white text-center animate-popIn">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">
            Tiếp Tục Điều Tra?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phát hiện phiên chơi Màn {session.levelNumber} với {session.taggedSuspects.length} manh mối đã ghim và {session.suspicionStrikes} điểm nghi ngờ.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow-md active:scale-95 transition-all text-white"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Tiếp tục điều tra</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Bắt đầu lại màn này</span>
          </button>
        </div>
      </div>
    </div>
  );
};

