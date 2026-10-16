import { useEffect, useRef } from 'react';

type GestureSurfaceEvent = {
  currentTarget?: EventTarget | null;
  target?: EventTarget | null;
};

export interface UseSwipeHomeOptions {
  /** Callback fired when an upward swipe home gesture is detected from the bottom of the UI */
  onHome: () => void;
  /** Whether the gesture is enabled (default: true) */
  enabled?: boolean;
  /** Minimum upward deltaY required to trigger home in px (default: 40) */
  threshold?: number;
  /** Max ratio of |deltaX| to upward deltaY (default: 0.8) to ensure vertical dominance */
  maxRatio?: number;
  /** Max duration of gesture in ms (default: 1500) */
  maxDuration?: number;
  /** Height of the generous bottom trigger area in px from the container bottom (default: 72) */
  triggerAreaHeight?: number;
  /** Optional getter for the container element to measure distance from bottom */
  getContainer?: () => HTMLElement | null;
}

export interface SwipeHomeCheckParams {
  startX: number;
  startY: number;
  startTime: number;
  endX: number;
  endY: number;
  endTime: number;
  containerBottom?: number;
  triggerAreaHeight?: number;
  threshold?: number;
  maxRatio?: number;
  maxDuration?: number;
}

/**
 * Pure evaluation function for upward swipe home gestures from the bottom of the UI.
 * Adheres to SRP and pure function testability.
 */
export function isSwipeHomeGesture({
  startX,
  startY,
  startTime,
  endX,
  endY,
  endTime,
  containerBottom,
  triggerAreaHeight = 72,
  threshold = 40,
  maxRatio = 0.8,
  maxDuration = 1500,
}: SwipeHomeCheckParams): boolean {
  // If containerBottom is specified, check that the gesture started within the generous trigger zone
  if (containerBottom !== undefined && containerBottom > 0) {
    const distanceFromBottom = containerBottom - startY;
    // Allow slight overflow (-15px) for touches at the absolute screen edge
    if (distanceFromBottom < -15 || distanceFromBottom > triggerAreaHeight) {
      return false;
    }
  }

  const deltaX = endX - startX;
  const upwardDistance = startY - endY; // deltaY is negative when swiping up
  const elapsed = endTime - startTime;

  return (
    upwardDistance >= threshold &&
    Math.abs(deltaX) <= upwardDistance * maxRatio &&
    elapsed <= maxDuration
  );
}

export interface SwipeHomeHandlers {
  onTouchStart: (e: GestureSurfaceEvent & { touches: ArrayLike<{ clientX: number; clientY: number }> }) => void;
  onTouchMove: (e: { touches: ArrayLike<{ clientX: number; clientY: number }> }) => void;
  onTouchCancel: () => void;
  onTouchEnd: (e: { changedTouches: ArrayLike<{ clientX: number; clientY: number }>; stopPropagation?: () => void }) => void;
  onPointerDown: (e: GestureSurfaceEvent & { pointerType: string; button: number; clientX: number; clientY: number }) => void;
  onPointerMove: (e: { pointerType: string; clientX: number; clientY: number }) => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onPointerUp: (e: { pointerType: string; button: number; clientX: number; clientY: number; stopPropagation?: () => void }) => void;
}

export interface SwipeHomeEngine extends SwipeHomeHandlers {
  dispose: () => void;
}

/**
 * Core event binder decoupled from React hook lifecycle.
 * Can be instantiated directly or via the useSwipeHome hook.
 */
export function createSwipeHomeEngine(options: UseSwipeHomeOptions): SwipeHomeEngine {
  let startCoords: { x: number; y: number; time: number; containerBottom?: number } | null = null;
  let lastTriggered = 0;

  const cancel = () => {
    startCoords = null;
  };

  const resolveBottom = (element?: EventTarget | null): number | undefined => {
    if (options.getContainer) {
      const container = options.getContainer();
      if (container && typeof container.getBoundingClientRect === 'function') {
        const rect = container.getBoundingClientRect();
        if (rect.bottom > 0) return rect.bottom;
        if (container.clientHeight > 0) return container.clientHeight;
      }
    }
    if (typeof HTMLElement !== 'undefined' && element instanceof HTMLElement) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom > 0) return rect.bottom;
      if (element.clientHeight > 0) return element.clientHeight;
    }
    if (typeof window !== 'undefined' && window.innerHeight > 0) {
      return window.innerHeight;
    }
    return undefined;
  };

  const handleStart = (event: GestureSurfaceEvent, clientX: number, clientY: number) => {
    if (options.enabled === false) return;

    if (typeof Element !== 'undefined' && event.target instanceof Element) {
      if (event.target.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
    }

    const containerBottom = resolveBottom(event.currentTarget);
    const triggerAreaHeight = options.triggerAreaHeight ?? 72;

    if (containerBottom !== undefined && containerBottom > 0) {
      const distanceFromBottom = containerBottom - clientY;
      if (distanceFromBottom < -15 || distanceFromBottom > triggerAreaHeight) {
        return; // Outside generous bottom trigger area
      }
    }

    startCoords = { x: clientX, y: clientY, time: Date.now(), containerBottom };
  };

  const handleEnd = (clientX: number, clientY: number, stopProp?: () => void) => {
    if (options.enabled === false || !startCoords) {
      cancel();
      return;
    }

    const { x: startX, y: startY, time: startTime, containerBottom } = startCoords;
    startCoords = null;
    const now = Date.now();

    if (
      isSwipeHomeGesture({
        startX,
        startY,
        startTime,
        endX: clientX,
        endY: clientY,
        endTime: now,
        containerBottom,
        triggerAreaHeight: options.triggerAreaHeight ?? 72,
        threshold: options.threshold ?? 40,
        maxRatio: options.maxRatio ?? 0.8,
        maxDuration: options.maxDuration ?? 1500,
      }) &&
      now - lastTriggered > 350
    ) {
      lastTriggered = now;
      if (stopProp) {
        stopProp();
      }
      options.onHome();
    }
  };

  return {
    dispose: () => {
      startCoords = null;
    },
    onTouchStart: (e) => {
      if (e.touches && e.touches.length === 1) {
        handleStart(e, e.touches[0].clientX, e.touches[0].clientY);
      } else {
        cancel();
      }
    },
    onTouchMove: () => {
      // Intentionally passive to avoid blocking native vertical scrolling
    },
    onTouchCancel: cancel,
    onTouchEnd: (e) => {
      if (e.changedTouches && e.changedTouches.length >= 1) {
        handleEnd(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY,
          () => e.stopPropagation?.()
        );
      }
    },
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        handleStart(e, e.clientX, e.clientY);
      }
    },
    onPointerMove: () => {
      // Passive
    },
    onPointerCancel: cancel,
    onPointerLeave: () => {
      // Do not cancel on pointer leave as upward swipe intentionally travels upward out of small sub-elements
    },
    onPointerUp: (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        handleEnd(e.clientX, e.clientY, () => e.stopPropagation?.());
      }
    },
  };
}

/**
 * Universal gesture hook: Swipe Up from Bottom to Go Home.
 * Detects touch or mouse drag gestures from the generous bottom area upwards.
 * Stops propagation on trigger so child gestures don't conflict.
 */
export function useSwipeHome(options: UseSwipeHomeOptions): SwipeHomeHandlers {
  const engineRef = useRef<{ handlers: SwipeHomeHandlers; dispose: () => void } | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => () => engineRef.current?.dispose(), []);

  if (!engineRef.current) {
    const { dispose, ...handlers } = createSwipeHomeEngine({
      onHome: () => optionsRef.current.onHome(),
      get enabled() {
        return optionsRef.current.enabled ?? true;
      },
      get threshold() {
        return optionsRef.current.threshold ?? 40;
      },
      get maxRatio() {
        return optionsRef.current.maxRatio ?? 0.8;
      },
      get maxDuration() {
        return optionsRef.current.maxDuration ?? 1500;
      },
      get triggerAreaHeight() {
        return optionsRef.current.triggerAreaHeight ?? 72;
      },
      getContainer: () => optionsRef.current.getContainer?.() ?? null,
    });
    engineRef.current = { handlers, dispose };
  }

  return engineRef.current.handlers;
}
