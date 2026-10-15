import { useMotionState } from '../../shared/motion/useMotionState';
﻿import React, { useEffect, useRef, useState } from 'react';
import { IoBook, IoLayers, IoExpand, IoContract } from 'react-icons/io5';

interface AssistiveTouchProps {
  onGoHome: () => void;
  onOpenNotebook: () => void;
  onOpenLevelSelector: () => void;
  onRestartLevel: () => void;
  onToggleFullscreen: () => void;
  onOpenPwaGuide: () => void;
  isFullscreen: boolean;
  isIOS?: boolean;
}

const SIZE = 56;
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

export const AssistiveTouch: React.FC<AssistiveTouchProps> = ({
  onGoHome, onOpenNotebook, onOpenLevelSelector, onToggleFullscreen,
  onOpenPwaGuide, isFullscreen, isIOS = false,
}) => {
  const [isOpen, setIsOpen] = useMotionState(false, 'fade');
  const [position, setPosition] = useState({ edge: 'right', y: 0.8 });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    id: number; startX: number; startY: number; offsetX: number; offsetY: number;
    moved: boolean; x: number; y: number;
  } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector('button')?.focus();
    return () => buttonRef.current?.focus();
  }, [isOpen]);

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const parent = event.currentTarget.offsetParent as HTMLElement | null;
    if (parent && current.moved) {
      const width = Math.max(0, parent.clientWidth - SIZE);
      const height = Math.max(0, parent.clientHeight - SIZE);
      setPosition({ edge: current.x < width / 2 ? 'left' : 'right', y: height ? clamp(current.y, height) / height : 0 });
    }
    suppressClick.current = current.moved || event.type === 'pointercancel';
    gesture.current = null;
    setDragPosition(null);
  };

  const actions = [
    { label: 'Sổ tay của vợ', icon: <IoBook />, run: onOpenNotebook, place: 'col-start-2 row-start-1' },
    { label: isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình', icon: isFullscreen ? <IoContract /> : <IoExpand />, run: isIOS ? onOpenPwaGuide : onToggleFullscreen, place: 'col-start-1 row-start-2' },
    { label: 'Chọn màn chơi', icon: <IoLayers />, run: onOpenLevelSelector, place: 'col-start-3 row-start-2' },
    { label: 'Màn hình chính', icon: <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/70"><span className="h-7 w-7 rounded-full border-2 border-white bg-white/90 shadow-inner" /></span>, run: onGoHome, place: 'col-start-2 row-start-3' },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu trợ năng"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          event.stopPropagation();
          const rect = event.currentTarget.getBoundingClientRect();
          gesture.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false, x: 0, y: 0 };
          suppressClick.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const current = gesture.current;
          const parent = event.currentTarget.offsetParent as HTMLElement | null;
          if (!current || current.id !== event.pointerId || !parent) return;
          if (Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6) current.moved = true;
          if (!current.moved) return;
          const rect = parent.getBoundingClientRect();
          const scaleX = rect.width / parent.offsetWidth || 1;
          const scaleY = rect.height / parent.offsetHeight || 1;
          current.x = clamp((event.clientX - rect.left - current.offsetX) / scaleX - parent.clientLeft, parent.clientWidth - SIZE);
          current.y = clamp((event.clientY - rect.top - current.offsetY) / scaleY - parent.clientTop, parent.clientHeight - SIZE);
          setDragPosition({ x: current.x, y: current.y });
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClick={event => {
          event.stopPropagation();
          if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; }
          setIsOpen(true);
        }}
        style={{
          left: dragPosition ? dragPosition.x : position.edge === 'left' ? 0 : `calc(100% - ${SIZE}px)`,
          top: dragPosition ? dragPosition.y : `calc(${position.y * 100}% - ${position.y * SIZE}px)`,
          touchAction: 'none',
        }}
        className={`absolute z-40 flex h-14 w-14 select-none items-center justify-center rounded-[18px] bg-[#242426]/70 shadow-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${dragPosition ? 'cursor-grabbing' : 'cursor-grab motion-safe:transition-[left,top] motion-safe:duration-200'} ${isOpen ? 'invisible' : ''}`}
      >
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/50">
            <span className="h-7 w-7 rounded-full bg-white/90 shadow-sm" />
          </span>
        </span>
      </button>
      {isOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
          onKeyDown={event => {
            if (event.key === 'Escape') { event.stopPropagation(); setIsOpen(false); }
            if (event.key === 'Tab') {
              const buttons = panelRef.current?.querySelectorAll('button');
              if (!buttons?.length) return;
              const index = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement);
              event.preventDefault();
              buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
            }
          }}
        >
          <div
            ref={panelRef}
            style={{ viewTransitionName: 'assistive-menu' }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu trợ năng"
            onClick={event => event.stopPropagation()}
            className="grid aspect-square w-[280px] max-w-full grid-cols-3 grid-rows-3 gap-1 rounded-[32px] bg-[#252527]/95 p-3 text-white shadow-2xl backdrop-blur-xl"
          >
            {actions.map(action => (
              <button
                key={action.place}
                type="button"
                onClick={() => { setIsOpen(false); action.run(); }}
                className={`${action.place} flex min-h-11 min-w-11 flex-col items-center justify-center gap-2 rounded-2xl text-center text-[12px] leading-tight hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white active:bg-white/20`}
              >
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center text-[36px]">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
