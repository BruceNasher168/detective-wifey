import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps, PointerEvent, ReactElement } from 'react';
import { NotebookTab } from './NotebookTab';

vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useRef: (current: unknown) => ({ current }),
  useLayoutEffect: () => undefined,
}));

describe('notebook tab pointer ownership', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    vi.stubGlobal('getComputedStyle', () => ({ transform: 'none' }));
  });
  afterEach(() => vi.unstubAllGlobals());

  function setup() {
    const onOpen = vi.fn();
    const tab = NotebookTab({ open: false, onOpen }) as ReactElement<ComponentProps<'button'>>;
    const host = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 390, height: 844 }), offsetWidth: 390, offsetHeight: 844, clientLeft: 0, clientTop: 0 };
    const button = { offsetParent: host, getBoundingClientRect: () => ({ left: 362, top: 400 }), querySelector: () => null, setPointerCapture: vi.fn(), style: {}, dataset: {} };
    const event = (x: number, y: number, type = 'pointerup') => ({
      currentTarget: button, clientX: x, clientY: y, pointerId: 1, button: 0, isPrimary: true,
      timeStamp: type === 'pointerdown' ? 0 : 50, type, detail: 1, stopPropagation: vi.fn(),
    });
    const down = () => tab.props.onPointerDown?.(event(375, 420, 'pointerdown') as unknown as PointerEvent<HTMLButtonElement>);
    const release = (x: number, y: number, cancel = false) => {
      const releaseEvent = event(x, y, cancel ? 'pointercancel' : 'pointerup') as unknown as PointerEvent<HTMLButtonElement>;
      if (cancel) tab.props.onPointerCancel?.(releaseEvent); else tab.props.onPointerUp?.(releaseEvent);
      tab.props.onClick?.(releaseEvent);
    };
    return { onOpen, down, release };
  }
  it('opens on a short tap', () => {
    const tab = setup(); tab.down(); tab.release(376, 421);
    expect(tab.onOpen).toHaveBeenCalledOnce();
  });
  it('suppresses the generated click after dragging inward or vertically', () => {
    for (const [x, y] of [[300, 420], [375, 500]]) {
      const tab = setup(); tab.down(); tab.release(x, y);
      expect(tab.onOpen).not.toHaveBeenCalled();
    }
  });
  it('suppresses cancelled gestures and permits a fresh tap afterward', () => {
    const tab = setup(); tab.down(); tab.release(375, 420, true);
    expect(tab.onOpen).not.toHaveBeenCalled();
    tab.down(); tab.release(375, 420);
    expect(tab.onOpen).toHaveBeenCalledOnce();
  });
  it('remains persistent and calls onClose on a short tap when open', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const tab = NotebookTab({ open: true, onOpen, onClose }) as ReactElement<ComponentProps<'button'>>;
    expect(tab.props['aria-label']).toBe('Đóng sổ tay của vợ');
    expect(tab.props['aria-expanded']).toBe(true);
    expect(tab.props.style?.opacity).toBe(1);
    expect(tab.props.style?.pointerEvents).toBe('auto');

    const host = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 390, height: 844 }), offsetWidth: 390, offsetHeight: 844, clientLeft: 0, clientTop: 0 };
    const button = { offsetParent: host, getBoundingClientRect: () => ({ left: 362, top: 400 }), querySelector: () => null, setPointerCapture: vi.fn(), style: {}, dataset: {} };
    const event = (x: number, y: number, type = 'pointerup') => ({
      currentTarget: button, clientX: x, clientY: y, pointerId: 1, button: 0, isPrimary: true,
      timeStamp: type === 'pointerdown' ? 0 : 50, type, detail: 1, stopPropagation: vi.fn(),
    });

    tab.props.onPointerDown?.(event(375, 420, 'pointerdown') as unknown as PointerEvent<HTMLButtonElement>);
    tab.props.onPointerUp?.(event(376, 421, 'pointerup') as unknown as PointerEvent<HTMLButtonElement>);
    tab.props.onClick?.(event(376, 421, 'pointerup') as unknown as PointerEvent<HTMLButtonElement>);

    expect(onClose).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
  });
  it('hides and disables pointer events when hidden is true', () => {
    const tab = NotebookTab({ open: false, hidden: true, onOpen: vi.fn() }) as ReactElement<ComponentProps<'button'>>;
    expect(tab.props.style?.opacity).toBe(0);
    expect(tab.props.style?.pointerEvents).toBe('none');
    expect(tab.props['aria-hidden']).toBe(true);
    expect(tab.props.tabIndex).toBe(-1);
  });
});
