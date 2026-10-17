import { useCallback, useRef, useState } from 'react';
import { clampZoom, CANVAS_SIZE } from './graphEngine';
import type { CorkboardViewport } from './types';

export interface UseCorkboardGesturesOptions {
  initialViewport?: CorkboardViewport;
}

export function useCorkboardGestures(options?: UseCorkboardGesturesOptions) {
  const [viewport, setViewport] = useState<CorkboardViewport>(() => options?.initialViewport ?? {
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
    zoom: 1.0,
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, startCamX: 0, startCamY: 0, moved: false });
  const pinchStart = useRef<{
    initialDist: number;
    initialZoom: number;
    initialCamX: number;
    initialCamY: number;
    centroidX: number;
    centroidY: number;
  } | null>(null);
  const lastTapTime = useRef(0);

  // Discrete Step Zoom Handlers
  const zoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: clampZoom(Math.round((prev.zoom + 0.25) * 100) / 100),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: clampZoom(Math.round((prev.zoom - 0.25) * 100) / 100),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setViewport({
      x: CANVAS_SIZE / 2,
      y: CANVAS_SIZE / 2,
      zoom: 1.0,
    });
  }, []);

  const setCenter = useCallback((x: number, y: number) => {
    setViewport(prev => ({ ...prev, x, y }));
  }, []);

  // Desktop Mouse Wheel Zoom Handler
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setViewport(prev => {
      const nextZoom = clampZoom(Math.round((prev.zoom + zoomDelta) * 100) / 100);
      if (nextZoom === prev.zoom) return prev;
      return {
        ...prev,
        zoom: nextZoom,
      };
    });
  }, []);

  // Pointer / Mouse Drag Panning Handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag on primary button and directly on canvas background
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.corkboard-node-card, .corkboard-control-dock, .corkboard-drawer')) {
      return;
    }

    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startCamX: viewport.x,
      startCamY: viewport.y,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [viewport.x, viewport.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const rawDx = e.clientX - dragStart.current.x;
    const rawDy = e.clientY - dragStart.current.y;
    if (Math.hypot(rawDx, rawDy) > 6) {
      dragStart.current.moved = true;
    }

    const dx = rawDx / viewport.zoom;
    const dy = rawDy / viewport.zoom;

    // Generous boundary padding (-100 to CANVAS_SIZE + 100) so edge cards are never clipped
    setViewport(prev => ({
      ...prev,
      x: Math.max(-100, Math.min(CANVAS_SIZE + 100, dragStart.current.startCamX - dx)),
      y: Math.max(-100, Math.min(CANVAS_SIZE + 100, dragStart.current.startCamY - dy)),
    }));
  }, [viewport.zoom]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already lost
    }

    // Double-tap zoom toggle only if the user tapped in place without panning
    if (!dragStart.current.moved) {
      const now = Date.now();
      if (now - lastTapTime.current < 320) {
        setViewport(prev => ({
          ...prev,
          zoom: prev.zoom >= 1.4 ? 1.0 : 1.5,
        }));
        lastTapTime.current = 0;
      } else {
        lastTapTime.current = now;
      }
    }
  }, []);

  // Multi-Touch Pinch-to-Zoom Handlers (Mobile Native Touch Events)
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      pinchStart.current = {
        initialDist: dist,
        initialZoom: viewport.zoom,
        initialCamX: viewport.x,
        initialCamY: viewport.y,
        centroidX: (t1.clientX + t2.clientX) / 2,
        centroidY: (t1.clientY + t2.clientY) / 2,
      };
    }
  }, [viewport.zoom, viewport.x, viewport.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchStart.current) {
      e.stopPropagation();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scaleDelta = currentDist / Math.max(1, pinchStart.current.initialDist);
      const newZoom = clampZoom(pinchStart.current.initialZoom * scaleDelta);

      setViewport(prev => ({
        ...prev,
        zoom: newZoom,
      }));
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      pinchStart.current = null;
    }
  }, []);

  return {
    viewport,
    setViewport,
    zoomIn,
    zoomOut,
    resetZoom,
    setCenter,
    containerProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: { touchAction: 'none' as const },
    },
  };
}
