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
  const panelAnimation = useRef<Animation | undefined>(undefined);
  const onKeyDown = useDialogFocus(open, ref, onClose);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!open && !present) return;
    element.hidden = false;
    const anchor = document.querySelector<HTMLElement>(anchorSelector);
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (presentation === 'dropdown') {
      const panel = element.querySelector<HTMLElement>('[data-dropdown-panel]');
      if (!initialized.current) {
        element.style.transform = 'none';
        element.style.opacity = '0';
        if (panel) panel.style.transform = 'translateY(-100%)';
        initialized.current = true;
      }
      if (open && !present) setPresent(true);

      animation.current = animateOverlay(element, open, 'none', () => {
        if (!open) { element.hidden = true; setPresent(false); initialized.current = false; anchor?.focus({ preventScroll: true }); }
      }, animation.current, isReduced);

      if (panel) {
        panelAnimation.current = animateOverlay(panel, open, 'translateY(-100%)', () => {}, panelAnimation.current, isReduced);
      }
    } else {
      // Measure the layout rectangle without the in-flight animation transform.
      const parent = element.offsetParent as HTMLElement | null;
      const bounds = parent?.getBoundingClientRect() ?? element.getBoundingClientRect();
      const closed = anchoredTransform(bounds, anchor?.getBoundingClientRect());
      if (!initialized.current) {
        element.style.transform = closed;
        element.style.opacity = '0';
        initialized.current = true;
      }
      if (open && !present) setPresent(true);
      animation.current = animateOverlay(element, open, closed, () => {
        if (!open) { element.hidden = true; setPresent(false); initialized.current = false; anchor?.focus({ preventScroll: true }); }
      }, animation.current, isReduced);
    }
  }, [open, anchorSelector, present, presentation]);
  useEffect(() => () => {
    animation.current?.cancel();
    panelAnimation.current?.cancel();
  }, []);
  return <div ref={ref} hidden={!present && !open} inert={!open} role="dialog" aria-modal={open}
    aria-hidden={!open} aria-label={label} className="absolute inset-0 z-50 overflow-hidden"
    style={{ transformOrigin: '0 0', pointerEvents: open ? 'auto' : 'none' }}
    onKeyDown={onKeyDown}>{children}</div>;
}
