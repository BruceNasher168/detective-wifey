import React, { useRef } from 'react';
import { UniversalEvidenceItem } from './UniversalEvidenceModal';

interface StoryEvidenceTargetProps {
  item: UniversalEvidenceItem;
  onTriggerEvidence: (item: UniversalEvidenceItem) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const StoryEvidenceTarget: React.FC<StoryEvidenceTargetProps> = ({
  item,
  onTriggerEvidence,
  children,
  className = '',
  disabled = false,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);

  const startTimer = (clientX: number, clientY: number) => {
    if (disabled) return;
    clearTimer();
    isLongPressRef.current = false;
    startCoordsRef.current = { x: clientX, y: clientY };

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onTriggerEvidence(item);
    }, 450);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startTimer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startCoordsRef.current || e.touches.length !== 1) return;
    const dx = Math.abs(e.touches[0].clientX - startCoordsRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - startCoordsRef.current.y);
    // If movement exceeds 10px, the user is scrolling -> cancel long press
    if (dx > 10 || dy > 10) {
      clearTimer();
    }
  };

  const handleTouchEnd = () => {
    clearTimer();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button (left click)
    if (e.button === 0) {
      startTimer(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startCoordsRef.current) return;
    const dx = Math.abs(e.clientX - startCoordsRef.current.x);
    const dy = Math.abs(e.clientY - startCoordsRef.current.y);
    if (dx > 10 || dy > 10) {
      clearTimer();
    }
  };

  const handleMouseUp = () => {
    clearTimer();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressRef.current = false;
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClickCapture={handleClickCapture}
      className={className}
    >
      {children}
    </div>
  );
};

