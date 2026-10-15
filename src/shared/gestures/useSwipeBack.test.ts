import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createSwipeBackEngine } from './useSwipeBack';

class Surface {
  style = { transform: '' };
  dataset = {};
  clientWidth = 390;
  animate = vi.fn(() => ({ cancel: vi.fn() }));
  closest(selector: string) { return selector === '[data-swipe-surface]' ? this : null; }
}
beforeEach(() => {
  vi.stubGlobal('HTMLElement', Surface);
  vi.stubGlobal('Element', Surface);
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
});
afterEach(() => vi.unstubAllGlobals());

it('tracks the finger and snaps back on cancellation without navigating', () => {
  const onBack = vi.fn();
  const engine = createSwipeBackEngine({ onBack });
  const surface = new Surface();
  engine.onTouchStart({ currentTarget: surface as unknown as HTMLElement, target: surface as unknown as HTMLElement,
    touches: [{ clientX: 10, clientY: 100 }] });
  engine.onTouchMove({ touches: [{ clientX: 40, clientY: 101 }] });
  expect(surface.style.transform).toBe('translate3d(30px, 0, 0)');
  engine.onTouchCancel();
  engine.onTouchEnd({ changedTouches: [{ clientX: 120, clientY: 100 }] });
  expect(surface.style.transform).toBe('');
  expect(surface.animate).toHaveBeenCalledOnce();
  expect(onBack).not.toHaveBeenCalled();
});

it('gives nested views ownership and leaves the parent stationary', () => {
  const onBack = vi.fn();
  const parent = new Surface();
  const child = new Surface();
  const engine = createSwipeBackEngine({ onBack });
  engine.onPointerDown({ currentTarget: parent as unknown as HTMLElement, target: child as unknown as HTMLElement,
    pointerType: 'mouse', button: 0, clientX: 10, clientY: 100 });
  engine.onPointerMove({ pointerType: 'mouse', clientX: 110, clientY: 100 });
  engine.onPointerUp({ pointerType: 'mouse', button: 0, clientX: 110, clientY: 100 });
  expect(parent.style.transform).toBe('');
  expect(onBack).not.toHaveBeenCalled();
});

it('abandons horizontal navigation when the gesture becomes a vertical scroll', () => {
  const onBack = vi.fn();
  const engine = createSwipeBackEngine({ onBack });
  const surface = new Surface();
  engine.onTouchStart({ currentTarget: surface as unknown as HTMLElement, target: surface as unknown as HTMLElement,
    touches: [{ clientX: 10, clientY: 100 }] });
  engine.onTouchMove({ touches: [{ clientX: 40, clientY: 180 }] });
  engine.onTouchEnd({ changedTouches: [{ clientX: 110, clientY: 100 }] });
  expect(surface.style.transform).toBe('');
  expect(onBack).not.toHaveBeenCalled();
});
