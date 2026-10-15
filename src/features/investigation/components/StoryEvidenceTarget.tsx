import React, { useRef, useState } from 'react';
import type { UniversalEvidenceItem } from '../../../shared/contracts/evidence';

interface StoryEvidenceTargetProps {
  item: UniversalEvidenceItem;
  onTriggerEvidence: (item: UniversalEvidenceItem) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Universal Story Evidence Target.
 * Implements resilient pointer/touch long-press (380ms) and desktop right-click
 * to open the Universal Evidence Pin Modal.
 *
 * Invariants:
 * - Normal click/tap NEVER triggers evidence pinning.
 * - Long-press (>= 380ms) triggers evidence modal with haptic feedback.
 * - Suppresses browser contextmenu and native text-drag.
 * - Provides active tactile feedback (scale-98 & cursor-pointer) while holding.
 */
export const StoryEvidenceTarget: React.FC<StoryEvidenceTargetProps> = ({
  item,
  onTriggerEvidence,
  children,
  className = '',
  disabled = false,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const isLongPressTriggeredRef = useRef(false);
  const [isPressing, setIsPressing] = useState(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
    activePointerIdRef.current = null;
    startCoordsRef.current = null;
  };

  const triggerEvidence = () => {
    isLongPressTriggeredRef.current = true;
    setIsPressing(false);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch {
        // Ignore vibration errors on unsupported platforms
      }
    }
    onTriggerEvidence(item);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    // Only primary button: left click (button === 0) or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    clearTimer();
    isLongPressTriggeredRef.current = false;
    activePointerIdRef.current = e.pointerId;
    startCoordsRef.current = { x: e.clientX, y: e.clientY };
    setIsPressing(true);

    timerRef.current = setTimeout(() => {
      triggerEvidence();
    }, 380);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startCoordsRef.current || e.pointerId !== activePointerIdRef.current) return;
    const dx = Math.abs(e.clientX - startCoordsRef.current.x);
    const dy = Math.abs(e.clientY - startCoordsRef.current.y);
    // Allow up to 18px movement tolerance for finger jitter or slight mouse tremor
    if (dx > 18 || dy > 18) {
      clearTimer();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerId === activePointerIdRef.current) {
      clearTimer();
    }
  };

  const handlePointerCancel = () => {
    clearTimer();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // If long press was triggered, suppress the subsequent click event
    if (isLongPressTriggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressTriggeredRef.current = false;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent browser context menu and allow desktop right-click to trigger evidence modal
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      clearTimer();
      triggerEvidence();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      onContextMenu={handleContextMenu}
      onDragStart={(e) => e.preventDefault()}
      className={`select-none cursor-pointer transition-transform duration-150 ${
        isPressing ? 'scale-[0.98] opacity-95' : ''
      } ${className}`}
      style={{
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default StoryEvidenceTarget;
