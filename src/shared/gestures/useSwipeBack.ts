import { useRef } from 'react';

export interface UseSwipeBackOptions {
  /** Callback fired when a right-swipe back gesture is detected */
  onBack: () => void;
  /** Whether the swipe gesture is enabled (default: true) */
  enabled?: boolean;
  /** Minimum horizontal deltaX required to trigger back in px (default: 45) */
  threshold?: number;
  /** Max ratio of |deltaY| to deltaX (default: 0.8) to ensure horizontal swipe */
  maxRatio?: number;
  /** Max duration of gesture in ms (default: 1500) */
  maxDuration?: number;
}

export interface SwipeCheckParams {
  startX: number;
  startY: number;
  startTime: number;
  endX: number;
  endY: number;
  endTime: number;
  threshold?: number;
  maxRatio?: number;
  maxDuration?: number;
}

/**
 * Pure evaluation function for rightward swipe gestures.
 * Adheres to SRP and pure function testability.
 */
export function isSwipeRightGesture({
  startX,
  startY,
  startTime,
  endX,
  endY,
  endTime,
  threshold = 45,
  maxRatio = 0.8,
  maxDuration = 1500,
}: SwipeCheckParams): boolean {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const elapsed = endTime - startTime;

  return (
    deltaX >= threshold &&
    Math.abs(deltaY) <= deltaX * maxRatio &&
    elapsed <= maxDuration
  );
}

export interface SwipeBackHandlers {
  onTouchStart: (e: { touches: ArrayLike<{ clientX: number; clientY: number }> }) => void;
  onTouchEnd: (e: { changedTouches: ArrayLike<{ clientX: number; clientY: number }>; stopPropagation?: () => void }) => void;
  onPointerDown: (e: { pointerType: string; button: number; clientX: number; clientY: number }) => void;
  onPointerUp: (e: { pointerType: string; button: number; clientX: number; clientY: number; stopPropagation?: () => void }) => void;
}

/**
 * Core event binder decoupled from React hook lifecycle.
 * Can be instantiated directly or via the useSwipeBack hook.
 */
export function createSwipeBackEngine({
  onBack,
  enabled = true,
  threshold = 45,
  maxRatio = 0.8,
  maxDuration = 1500,
}: UseSwipeBackOptions): SwipeBackHandlers {
  let startCoords: { x: number; y: number; time: number } | null = null;
  let lastTriggered = 0;

  const handleStart = (clientX: number, clientY: number) => {
    if (!enabled) return;
    startCoords = { x: clientX, y: clientY, time: Date.now() };
  };

  const handleEnd = (clientX: number, clientY: number, stopProp?: () => void) => {
    if (!enabled || !startCoords) return;
    const { x: startX, y: startY, time: startTime } = startCoords;
    startCoords = null;
    const now = Date.now();

    if (
      isSwipeRightGesture({
        startX,
        startY,
        startTime,
        endX: clientX,
        endY: clientY,
        endTime: now,
        threshold,
        maxRatio,
        maxDuration,
      }) &&
      now - lastTriggered > 350
    ) {
      lastTriggered = now;
      if (stopProp) {
        stopProp();
      }
      onBack();
    }
  };

  return {
    onTouchStart: (e: { touches: ArrayLike<{ clientX: number; clientY: number }> }) => {
      if (e.touches && e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    onTouchEnd: (e: { changedTouches: ArrayLike<{ clientX: number; clientY: number }>; stopPropagation?: () => void }) => {
      if (e.changedTouches && e.changedTouches.length >= 1) {
        handleEnd(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY,
          () => e.stopPropagation?.()
        );
      }
    },
    onPointerDown: (e: { pointerType: string; button: number; clientX: number; clientY: number }) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        handleStart(e.clientX, e.clientY);
      }
    },
    onPointerUp: (e: { pointerType: string; button: number; clientX: number; clientY: number; stopPropagation?: () => void }) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        handleEnd(e.clientX, e.clientY, () => e.stopPropagation?.());
      }
    },
  };
}

/**
 * Universal gesture hook: Swipe Right to Go Back.
 * Detects touch or mouse drag gestures from left-to-right.
 * Stops propagation on trigger so nested views only pop one level at a time.
 */
export function useSwipeBack(options: UseSwipeBackOptions): SwipeBackHandlers {
  const engineRef = useRef<SwipeBackHandlers | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  if (!engineRef.current) {
    engineRef.current = createSwipeBackEngine({
      onBack: () => optionsRef.current.onBack(),
      get enabled() {
        return optionsRef.current.enabled ?? true;
      },
      get threshold() {
        return optionsRef.current.threshold ?? 45;
      },
      get maxRatio() {
        return optionsRef.current.maxRatio ?? 0.8;
      },
      get maxDuration() {
        return optionsRef.current.maxDuration ?? 1500;
      },
    });
  }

  return engineRef.current;
}

