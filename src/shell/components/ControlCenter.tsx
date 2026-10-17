import { useRef, useState } from 'react';
import { IoChevronDown, IoChevronUp, IoContractOutline, IoExpandOutline, IoHomeOutline, IoLayersOutline } from 'react-icons/io5';
import { AnchoredOverlay } from '../../shared/ui/AnchoredOverlay';

export const isControlSwipe = (dx: number, dy: number, direction: 'down' | 'up') =>
  (direction === 'down' ? dy : -dy) >= 44 && Math.abs(dy) > Math.abs(dx) * 1.25;

export function ControlCenter({ disabled, isFullscreen, onToggleFullscreen, onGoHome, onOpenLevels, onOpenChange }: {
  disabled: boolean; isFullscreen: boolean; onToggleFullscreen: () => void;
  onGoHome: () => void; onOpenLevels: () => void; onOpenChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClick = useRef(false);
  const change = (next: boolean) => { setOpen(next); onOpenChange(next); };
  const actions = [
    { label: isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình', icon: isFullscreen ? IoContractOutline : IoExpandOutline, run: onToggleFullscreen },
    { label: 'Chọn màn chơi', icon: IoLayersOutline, run: onOpenLevels },
    { label: 'Màn hình chính', icon: IoHomeOutline, run: onGoHome },
  ];
  return <>
    <button data-control-center-trigger type="button" aria-label="Mở trung tâm điều khiển"
      aria-haspopup="dialog" aria-expanded={open} disabled={disabled} tabIndex={open ? -1 : 0}
      className="absolute right-0 top-0 z-40 flex h-11 w-[112px] items-end justify-end rounded-bl-2xl px-3 pb-0.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
      style={{ touchAction: 'none', top: 'env(safe-area-inset-top, 0px)', pointerEvents: disabled || open ? 'none' : 'auto' }}
      onPointerDown={event => {
        if (event.button !== 0 || !event.isPrimary) return;
        event.stopPropagation(); suppressClick.current = false;
        start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={event => {
        const active = start.current;
        start.current = null;
        if (!active || active.id !== event.pointerId) return;
        const dx = event.clientX - active.x, dy = event.clientY - active.y;
        suppressClick.current = Math.hypot(dx, dy) > 6;
        if (isControlSwipe(dx, dy, 'down')) change(true);
      }} onPointerCancel={() => { start.current = null; suppressClick.current = true; }}
      onClick={event => {
        event.stopPropagation();
        if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
        change(true);
      }}><IoChevronDown aria-hidden className="h-3 w-5 rounded-full bg-slate-900/35" /></button>
    <AnchoredOverlay open={open} anchorSelector="[data-control-center-trigger]" presentation="dropdown" label="Trung tâm điều khiển" onClose={() => change(false)}>
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-2xl" style={{ touchAction: 'none' }} onClick={() => change(false)}
        onPointerDown={event => {
          if ((event.target as Element).closest('button')) return;
          event.stopPropagation();
          start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={event => {
          const active = start.current; start.current = null;
          if (active && active.id === event.pointerId && isControlSwipe(event.clientX - active.x, event.clientY - active.y, 'up')) change(false);
        }} onPointerCancel={() => { start.current = null; }}>
        <section className="mx-auto flex w-full max-w-md flex-col px-6 text-white" style={{ paddingTop: 'max(72px, calc(env(safe-area-inset-top, 0px) + 40px))' }} onClick={event => event.stopPropagation()}>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Trung tâm điều khiển</h2>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(({ label, icon: Icon, run }, index) => <button key={index} type="button"
              className={`flex min-h-[120px] flex-col items-start justify-between rounded-[28px] border border-white/20 bg-white/15 p-5 text-left shadow-lg hover:bg-white/25 active:scale-95 ${index === 0 ? 'col-span-2' : ''}`}
              onClick={() => { change(false); run(); }}><Icon aria-hidden className="h-8 w-8" /><span className="mt-3 text-sm font-semibold">{label}</span></button>)}
          </div>
          <button type="button" aria-label="Đóng trung tâm điều khiển" onClick={() => change(false)} className="mt-8 flex min-h-11 items-center justify-center self-center rounded-full px-8 hover:bg-white/15"><IoChevronUp aria-hidden className="h-6 w-6" /></button>
        </section>
      </div>
    </AnchoredOverlay>
  </>;
}
