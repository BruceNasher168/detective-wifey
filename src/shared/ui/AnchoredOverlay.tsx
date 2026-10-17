import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { anchoredTransform, animateOverlay } from '../motion/anchoredOverlay';
import { useDialogFocus } from './useDialogFocus';

/** Keeps content alive while hidden and throughout exit, preserving scroll and notebook state. */
export function AnchoredOverlay({ open, anchorSelector, label, onClose, children, presentation = 'anchor' }: {
  open: boolean; anchorSelector: string; label: string; onClose: () => void; children: ReactNode;
  presentation?: 'anchor' | 'dropdown';
}) {
  const [present, setPresent] = useState(open);
  const ref = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | undefined>(undefined);
  const initialized = useRef(false);
  const onKeyDown = useDialogFocus(open, ref, onClose);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!open && !present) return;
    element.hidden = false;
    const anchor = document.querySelector<HTMLElement>(anchorSelector);
    // Measure the layout rectangle without the in-flight animation transform.
    const parent = element.offsetParent as HTMLElement | null;
    const bounds = parent?.getBoundingClientRect() ?? element.getBoundingClientRect();
    const closed = presentation === 'dropdown' ? 'translateY(-48px)' : anchoredTransform(bounds, anchor?.getBoundingClientRect());
    if (!initialized.current) {
      element.style.transform = closed;
      element.style.opacity = '0';
      initialized.current = true;
    }
    if (open && !present) setPresent(true);
    animation.current = animateOverlay(element, open, closed, () => {
      if (!open) { element.hidden = true; setPresent(false); initialized.current = false; anchor?.focus({ preventScroll: true }); }
    }, animation.current, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [open, anchorSelector, present, presentation]);
  useEffect(() => () => animation.current?.cancel(), []);
  return <div ref={ref} hidden={!present && !open} inert={!open} role="dialog" aria-modal={open}
    aria-hidden={!open} aria-label={label} className="absolute inset-0 z-50 overflow-hidden"
    style={{ transformOrigin: '0 0', pointerEvents: open ? 'auto' : 'none' }}
    onKeyDown={onKeyDown}>{children}</div>;
}
