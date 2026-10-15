import { useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSwipeBack } from '../gestures/useSwipeBack';

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  suspended?: boolean;
}

const DISMISS_DISTANCE = 80;

/** Shared accessible drawer: the contents scroll independently of its drag handle. */
export function BottomSheet({ title, onClose, children, suspended = false }: BottomSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const swipe = useSwipeBack({ onBack: onClose, enabled: !suspended });

  useLayoutEffect(() => {
    if (suspended) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, [suspended]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (suspended) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
    if (event.key !== 'Tab') return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [href], [tabindex="0"]');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end bg-black/45 backdrop-blur-sm"
      onClick={event => { if (!suspended && event.target === event.currentTarget) onClose(); }}
    >
      <div
        {...swipe}
        ref={panelRef}
        role="dialog"
        aria-modal={!suspended}
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="ios-sheet flex max-h-[90%] min-h-0 flex-col rounded-t-[24px] bg-white text-[#111827] shadow-2xl"
      >
        <header
          className="shrink-0 px-4 pb-2 pt-3"
          style={{ touchAction: 'none' }}
          onPointerDown={event => {
            if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea')) return;
            if (!suspended && event.button === 0 && contentRef.current?.scrollTop === 0) {
              dragStart.current = { x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => { dragStart.current = null; }}
          onPointerUp={event => {
            const start = dragStart.current;
            dragStart.current = null;
            if (start && contentRef.current?.scrollTop === 0 && event.clientY - start.y >= DISMISS_DISTANCE && Math.abs(event.clientX - start.x) < event.clientY - start.y) {
              event.stopPropagation();
              onClose();
            }
          }}
        >
          <div aria-hidden="true" className="mx-auto mb-2 h-[5px] w-9 rounded-full bg-[#E5E7EB]" />
          <div className="flex items-center justify-between gap-2">
            <h2 id={titleId} className="min-w-0 break-words text-xl font-semibold">{title}</h2>
            <button ref={closeRef} type="button" onClick={onClose} aria-label={`Đóng ${title.toLocaleLowerCase('vi')}`} className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[14px]">
              <IoClose aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </header>
        <div ref={contentRef} className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
