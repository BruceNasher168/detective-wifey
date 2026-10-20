import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoPin } from 'react-icons/io5';
import { useSwipeBack } from '../../../shared/gestures/useSwipeBack';
import type { UniversalEvidenceItem } from '../../../shared/contracts/evidence';
import { ContactAvatar } from '../../../shared/ui/ContactAvatar';
import { formatEvidenceSubtitle } from '../evidencePresentation';
export type { UniversalEvidenceItem } from '../../../shared/contracts/evidence';

interface UniversalEvidenceModalProps {
  isOpen: boolean;
  item: UniversalEvidenceItem | null;
  avatar?: React.ReactNode;
  onPinEvidence: (suspectName: string) => void;
  onClose: () => void;
}

export const UniversalEvidenceModal = ({
  isOpen,
  item,
  avatar,
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
  const hasSource = Boolean(item.source?.caseId && item.source.recordId && item.source.title.trim());
  const canPin = hasAttribution || hasSource;
  const subtitle = formatEvidenceSubtitle(item);
  const profileName = item.profileName || item.visibleAlias || item.source?.visibleAlias || item.suspectToTag;

  const handlePin = () => {
    if (!canPin) return;
    onPinEvidence(hasAttribution ? item.suspectToTag : item.source!.title);
    onClose();
  };

  const portalTarget = typeof document !== 'undefined'
    ? (document.querySelector<HTMLElement>('.phone-shell') ?? document.body)
    : null;
  const isShellTarget = portalTarget?.classList?.contains('phone-shell');
  const positionClass = isShellTarget || !portalTarget ? 'absolute inset-0' : 'fixed inset-0';

  const modalContent = (
    <div
      className={`${positionClass} z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none font-sans animate-fadeIn`}
      onClick={onClose}
    >
      <div
        {...swipeHandlers}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="universal-evidence-title"
        className="ios-evidence-modal w-full max-w-[420px] max-h-[calc(100%-2rem)] overflow-y-auto bg-white rounded-3xl p-5 shadow-2xl border border-white/40 animate-scaleUp flex flex-col gap-4"
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
        <div className="flex items-start gap-2">
          {avatar ?? (profileName.trim() ? <ContactAvatar name={profileName} size={44} /> : null)}
          <div className="min-w-0 flex-1">
            <h3 id="universal-evidence-title" className="text-ios-headline font-bold text-[#0F172A] leading-snug break-words">
              {item.title}
            </h3>
            {subtitle && <p className="text-ios-footnote text-[#64748B] mt-0.5 break-words whitespace-pre-wrap">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] shrink-0 -mr-2 -mt-2 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Đóng"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence Snippet Quote */}
        {item.snippet && <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 border-l-4 border-l-rose-500 max-h-60 overflow-y-auto shrink-0">
          <p className="text-ios-subheadline text-slate-700 leading-relaxed italic whitespace-pre-line select-text font-normal">
            {item.snippet}
          </p>
        </div>}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handlePin}
            disabled={!canPin}
            className="w-full min-h-[48px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-[0.98] text-white rounded-2xl font-bold text-ios-headline flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoPin className="w-4 h-4 fill-white" />
            <span>Ghim Vào Sổ Tay</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 rounded-2xl font-semibold text-ios-subheadline flex items-center justify-center transition-all"
          >
            <span>Bỏ qua</span>
          </button>
        </div>
      </div>
    </div>
  );

  return portalTarget ? createPortal(modalContent, portalTarget) : modalContent;
};


