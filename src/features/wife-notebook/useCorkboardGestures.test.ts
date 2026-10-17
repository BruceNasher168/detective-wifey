import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react', () => ({
  useCallback: (callback: unknown) => callback,
  useEffect: () => {},
  useRef: (current: unknown) => ({ current }),
  useState: (initial: unknown) => {
    let value = typeof initial === 'function' ? initial() : initial;
    const set = (next: unknown) => {
      value = typeof next === 'function' ? next(value) : next;
      updates.push(value);
    };
    return [value, set];
  },
}));
const updates: unknown[] = [];
let frames: FrameRequestCallback[] = [];
function flushFrame() {
  const pending = frames;
  frames = [];
  pending.forEach(callback => callback(0));
}
beforeEach(() => {
  frames = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
import { useCorkboardGestures } from './useCorkboardGestures';

function pointer(pointerId: number, clientX: number, clientY: number) {
  return {
    pointerId, clientX, clientY, pointerType: 'touch', button: 0,
    stopPropagation: vi.fn(),
    target: { closest: () => null },
    currentTarget: {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 600 }),
      setPointerCapture: vi.fn(), hasPointerCapture: () => true, releasePointerCapture: vi.fn(),
    },
  } as unknown as Parameters<ReturnType<typeof useCorkboardGestures>['containerProps']['onPointerDown']>[0];
}

describe('corkboard mobile gesture ownership', () => {
  it('starts a new gesture from the latest camera before React commits it', () => {
    updates.length = 0;
    const { containerProps: handlers, setViewport } = useCorkboardGestures();
    setViewport({ x: 800, y: 900, zoom: 2 });
    handlers.onPointerDown(pointer(1, 200, 300));
    handlers.onPointerMove(pointer(1, 240, 320));
    flushFrame();
    expect(updates).toEqual([{ x: 780, y: 890, zoom: 2 }]);
  });

  it('measures the pinch bounds once rather than reading layout on every move', () => {
    const { containerProps: handlers } = useCorkboardGestures();
    handlers.onPointerDownCapture(pointer(1, 100, 300));
    const second = pointer(2, 300, 300);
    const measure = vi.fn(second.currentTarget.getBoundingClientRect);
    second.currentTarget.getBoundingClientRect = measure;
    handlers.onPointerDownCapture(second);
    const move = pointer(2, 350, 300);
    move.currentTarget.getBoundingClientRect = measure;
    handlers.onPointerMoveCapture(move);
    handlers.onPointerMoveCapture(move);
    expect(measure).toHaveBeenCalledTimes(1);
  });

  it('coalesces pointer moves into the latest position each frame', () => {
    updates.length = 0;
    const { containerProps: handlers } = useCorkboardGestures({ initialViewport: { x: 1000, y: 1000, zoom: 1 } });
    handlers.onPointerDown(pointer(1, 200, 300));
    handlers.onPointerMove(pointer(1, 210, 310));
    handlers.onPointerMove(pointer(1, 240, 330));
    expect(updates).toHaveLength(0);
    expect(frames).toHaveLength(1);
    flushFrame();
    expect(updates).toEqual([{ x: 960, y: 970, zoom: 1 }]);
  });

  it('pans from a string and suppresses selection after dragging', () => {
    updates.length = 0;
    const { containerProps: handlers } = useCorkboardGestures({ initialViewport: { x: 1000, y: 1000, zoom: 1 } });
    const start = pointer(1, 200, 300);
    start.target = { closest: (selector: string) => selector === '.corkboard-string' ? {} : null } as unknown as EventTarget;
    handlers.onPointerDownCapture(start);
    handlers.onPointerDown(start);
    expect(start.currentTarget.setPointerCapture).not.toHaveBeenCalled();
    handlers.onPointerMove(pointer(1, 250, 320));
    flushFrame();
    expect(updates[updates.length - 1]).toEqual({ x: 950, y: 980, zoom: 1 });
    handlers.onPointerUp(pointer(1, 250, 320));
    const click = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    handlers.onClickCapture(click as unknown as Parameters<typeof handlers.onClickCapture>[0]);
    expect(click.stopPropagation).toHaveBeenCalled();
  });

  it('anchors pinch at the finger midpoint and suppresses pan through the final finger lift', () => {
    updates.length = 0;
    const { containerProps: handlers } = useCorkboardGestures({ initialViewport: { x: 1000, y: 1000, zoom: 1 } });
    const first = pointer(1, 200, 300);
    handlers.onPointerDownCapture(first);
    handlers.onPointerDown(first);
    handlers.onPointerDownCapture(pointer(2, 300, 300));
    const move = pointer(2, 400, 300);
    handlers.onPointerMoveCapture(move);
    flushFrame();
    expect(updates[updates.length - 1]).toEqual({ x: 1000, y: 1000, zoom: 2 });
    const count = updates.length;
    handlers.onPointerMove(pointer(1, 150, 300));
    expect(updates).toHaveLength(count);
    handlers.onPointerUpCapture(pointer(2, 400, 300));
    handlers.onPointerMoveCapture(pointer(1, 100, 300));
    handlers.onPointerMove(pointer(1, 100, 300));
    expect(updates).toHaveLength(count);
    handlers.onPointerUpCapture(pointer(1, 100, 300));
    expect(updates[updates.length - 1]).toBe(false);
  });

  it('leaves cancel and other buttons out of canvas pointer capture', () => {
    updates.length = 0;
    const { containerProps: handlers } = useCorkboardGestures();
    const event = pointer(1, 200, 300);
    event.target = { closest: (selector: string) => selector.includes('button') ? {} : null } as unknown as EventTarget;
    handlers.onPointerDownCapture(event);
    handlers.onPointerDown(event);
    handlers.onPointerMove(pointer(1, 250, 300));
    expect(event.currentTarget.setPointerCapture).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(updates).toHaveLength(0);
  });

  it('does not treat pointer cancellation as a double tap', () => {
    updates.length = 0;
    const { containerProps: handlers } = useCorkboardGestures();
    handlers.onPointerDown(pointer(1, 200, 300));
    handlers.onPointerCancel();
    handlers.onPointerDown(pointer(2, 200, 300));
    handlers.onPointerUp(pointer(2, 200, 300));
    expect(updates).toHaveLength(0);
  });
});

