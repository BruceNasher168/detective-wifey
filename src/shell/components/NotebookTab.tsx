import { useLayoutEffect, useRef } from 'react';
import { IoBookOutline, IoChevronBack } from 'react-icons/io5';

export const tabGesture = (dx: number, dy: number) => Math.abs(dx) > 6 && -dx > Math.abs(dy) ? 'open' : Math.abs(dy) > 6 ? 'move' : dx > 6 ? 'cancel' : 'tap';

export function NotebookTab({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const position = useRef(.68);
  const gesture = useRef<{ id: number; x: number; y: number; top: number; mode: string } | null>(null);
  const suppressClick = useRef(false);
  useLayoutEffect(() => {
    const element = ref.current;
    const parent = element?.offsetParent as HTMLElement | null;
    if (!element || !parent) return;
    const place = () => { element.style.top = `${44 + position.current * Math.max(0, parent.clientHeight - 160)}px`; };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);
  const finish = (event: React.PointerEvent<HTMLButtonElement>) => {
    const active = gesture.current;
    if (!active || active.id !== event.pointerId) return;
    gesture.current = null;
    suppressClick.current = active.mode !== 'tap' || event.type !== 'pointerup';
    if (active.mode === 'open' && event.type === 'pointerup' && active.x - event.clientX >= 28) onOpen();
  };
  return <button ref={ref} data-notebook-tab type="button" aria-label="Mở sổ tay của vợ"
    aria-haspopup="dialog" aria-expanded={open} tabIndex={open ? -1 : 0} aria-hidden={open}
    title="Sổ tay của vợ · Chạm hoặc kéo vào để mở"
    className="absolute right-0 z-40 flex h-[76px] w-11 flex-col items-center justify-center gap-1 rounded-l-2xl border-y border-l border-white/35 bg-slate-900/55 text-white shadow-lg backdrop-blur-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
    style={{ touchAction: 'none', opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto' }}
    onPointerDown={event => {
      if (event.button !== 0 || !event.isPrimary) return;
      event.stopPropagation();
      gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, top: event.currentTarget.offsetTop, mode: 'tap' };
      suppressClick.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const active = gesture.current;
      if (!active || active.id !== event.pointerId) return;
      const dx = event.clientX - active.x, dy = event.clientY - active.y;
      if (active.mode === 'tap') active.mode = tabGesture(dx, dy);
      if (active.mode !== 'move') return;
      const element = event.currentTarget;
      const parent = element.offsetParent as HTMLElement;
      const bounds = parent.getBoundingClientRect();
      const scale = bounds.height / parent.offsetHeight || 1;
      const range = Math.max(0, parent.clientHeight - 160);
      const top = Math.max(44, Math.min(44 + range, active.top + dy / scale));
      position.current = range ? (top - 44) / range : 0;
      element.style.top = `${top}px`;
    }} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
    onClick={event => {
      event.stopPropagation();
      if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
      onOpen();
    }}><IoChevronBack aria-hidden className="h-4 w-4" /><IoBookOutline aria-hidden className="h-5 w-5" /></button>;
}
