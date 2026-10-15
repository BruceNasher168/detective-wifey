import React, { useEffect, useRef } from 'react';
import { IoClose, IoPin, IoShieldOutline } from 'react-icons/io5';
import { useSwipeBack } from '../hooks/useSwipeBack';
import type { EvidenceSource } from '../types/app-contracts';

export interface UniversalEvidenceItem {
  title: string;
  snippet: string;
  suspectToTag: string;
  subtitle?: string;
  source?: EvidenceSource;
}

interface UniversalEvidenceModalProps {
  isOpen: boolean;
  item: UniversalEvidenceItem | null;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
}

export const UniversalEvidenceModal = ({
  isOpen,
  item,
  onPinEvidence,
  onClose,
}: UniversalEvidenceModalProps): React.JSX.Element | null => {
  const swipeHandlers = useSwipeBack({ onBack: onClose });
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen || !item) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => previous?.focus();
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const hasAttribution = item.suspectToTag.trim().length > 0;

  const handlePin = () => {
    if (!hasAttribution) return;
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="universal-evidence-title"
        className="w-full max-w-[340px] bg-white rounded-3xl p-5 shadow-2xl border border-white/40 animate-scaleUp flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            onClose();
          }
          if (e.key === 'Tab') {
            const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
            if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
          }
        }}
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
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Đóng"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 id="universal-evidence-title" className="text-base font-bold text-[#0F172A] leading-snug break-words">
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
            {hasAttribution ? item.suspectToTag : 'Chưa có thông tin đối tượng'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handlePin}
            disabled={!hasAttribution}
            className="w-full min-h-[48px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

