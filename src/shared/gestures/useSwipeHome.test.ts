import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSwipeHomeEngine, isSwipeHomeGesture } from './useSwipeHome';

describe('useSwipeHome pure geometry calculation (isSwipeHomeGesture)', () => {
  const baseParams = {
    startX: 180,
    startY: 780,
    startTime: 1000,
    endX: 185,
    endY: 710,
    endTime: 1200,
    containerBottom: 800,
    triggerAreaHeight: 72,
    threshold: 40,
    maxRatio: 0.8,
    maxDuration: 1500,
  };

  it('detects a valid upward swipe from the generous bottom trigger zone', () => {
    expect(isSwipeHomeGesture(baseParams)).toBe(true);
  });

  it('rejects an upward swipe that started above the generous trigger zone', () => {
    // startY = 700, containerBottom = 800 -> distanceFromBottom = 100px > 72px
    expect(isSwipeHomeGesture({
      ...baseParams,
      startY: 700,
      endY: 620,
    })).toBe(false);
  });

  it('rejects an upward swipe that started too far below container bottom', () => {
    // startY = 830, containerBottom = 800 -> distanceFromBottom = -30px < -15px
    expect(isSwipeHomeGesture({
      ...baseParams,
      startY: 830,
      endY: 760,
    })).toBe(false);
  });

  it('rejects downward swipes', () => {
    // endY > startY
    expect(isSwipeHomeGesture({
      ...baseParams,
      endY: 820,
    })).toBe(false);
  });

  it('rejects horizontal swipes (e.g. swipe-back or carousel drag)', () => {
    // deltaX = 100px, upwardDistance = 45px -> |100| > 45 * 0.8
    expect(isSwipeHomeGesture({
      ...baseParams,
      startX: 50,
      endX: 150,
      endY: 735, // 45px upward
    })).toBe(false);
  });

  it('rejects sub-threshold upward movements (e.g. taps or tiny tremors)', () => {
    // upwardDistance = 15px < 40px threshold
    expect(isSwipeHomeGesture({
      ...baseParams,
      endY: 765,
    })).toBe(false);
  });

  it('rejects gestures exceeding max duration', () => {
    // elapsed = 2000ms > 1500ms
    expect(isSwipeHomeGesture({
      ...baseParams,
      endTime: 3100,
    })).toBe(false);
  });

  it('respects custom threshold, maxRatio, and triggerAreaHeight options', () => {
    // Custom generous trigger area: 90px
    // startY = 715, containerBottom = 800 -> distanceFromBottom = 85px <= 90px
    expect(isSwipeHomeGesture({
      ...baseParams,
      startY: 715,
      endY: 650,
      triggerAreaHeight: 90,
      threshold: 50,
      maxRatio: 0.5,
    })).toBe(true);

    // Fails stricter maxRatio 0.5 when deltaX is too high
    expect(isSwipeHomeGesture({
      ...baseParams,
      startX: 100,
      endX: 140, // deltaX = 40
      startY: 715,
      endY: 650, // upward = 65. 40 > 65 * 0.5 (32.5)
      triggerAreaHeight: 90,
      threshold: 50,
      maxRatio: 0.5,
    })).toBe(false);
  });
});

describe('useSwipeHome engine interaction suite', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { innerHeight: 800 });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  class MockSurface {
    get clientHeight() { return 800; }
    getBoundingClientRect() {
      return { top: 0, bottom: 800, left: 0, right: 390, width: 390, height: 800 };
    }
  }

  it('triggers onHome on valid touch swipe up from bottom', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome, triggerAreaHeight: 72 });

    // Touch start in generous bottom area (startY: 770, bottom: 800 -> distance: 30px <= 72px)
    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 770 }],
    });

    // Move up
    engine.onTouchMove({
      touches: [{ clientX: 195, clientY: 710 }],
    });

    // Release after upward movement of 60px
    const stopPropagation = vi.fn();
    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 710 }],
      stopPropagation,
    });

    expect(onHome).toHaveBeenCalledOnce();
    expect(stopPropagation).toHaveBeenCalledOnce();
    engine.dispose();
  });

  it('does not trigger onHome when touch starts above generous trigger area', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome, triggerAreaHeight: 72 });

    // Touch start high up in middle of screen (startY: 500, bottom: 800 -> distance: 300px > 72px)
    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 500 }],
    });

    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 400 }],
    });

    expect(onHome).not.toHaveBeenCalled();
    engine.dispose();
  });

  it('does not trigger on simple tap in bottom area', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome, triggerAreaHeight: 72 });

    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 770 }],
    });

    // Touch end at nearly same location
    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 768 }],
    });

    expect(onHome).not.toHaveBeenCalled();
    engine.dispose();
  });

  it('cancels gesture on onTouchCancel', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome });

    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 770 }],
    });

    engine.onTouchCancel();

    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 700 }],
    });

    expect(onHome).not.toHaveBeenCalled();
    engine.dispose();
  });

  it('triggers on desktop mouse drag upward in bottom area', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome, triggerAreaHeight: 72 });

    engine.onPointerDown({
      currentTarget: surface as unknown as HTMLElement,
      pointerType: 'mouse',
      button: 0,
      clientX: 195,
      clientY: 780,
    });

    engine.onPointerMove({
      pointerType: 'mouse',
      clientX: 195,
      clientY: 720,
    });

    const stopPropagation = vi.fn();
    engine.onPointerUp({
      pointerType: 'mouse',
      button: 0,
      clientX: 195,
      clientY: 720,
      stopPropagation,
    });

    expect(onHome).toHaveBeenCalledOnce();
    expect(stopPropagation).toHaveBeenCalledOnce();
    engine.dispose();
  });

  it('ignores non-primary mouse clicks', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome });

    // Right-click button 2
    engine.onPointerDown({
      currentTarget: surface as unknown as HTMLElement,
      pointerType: 'mouse',
      button: 2,
      clientX: 195,
      clientY: 780,
    });

    engine.onPointerUp({
      pointerType: 'mouse',
      button: 2,
      clientX: 195,
      clientY: 710,
    });

    expect(onHome).not.toHaveBeenCalled();
    engine.dispose();
  });

  it('honors enabled = false', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome, enabled: false });

    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 780 }],
    });

    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 710 }],
    });

    expect(onHome).not.toHaveBeenCalled();
    engine.dispose();
  });

  it('throttles rapid repeated triggers within 350ms', () => {
    const onHome = vi.fn();
    const surface = new MockSurface();
    const engine = createSwipeHomeEngine({ onHome });

    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 780 }],
    });
    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 710 }],
    });
    expect(onHome).toHaveBeenCalledTimes(1);

    // Immediate second swipe before 350ms
    engine.onTouchStart({
      currentTarget: surface as unknown as HTMLElement,
      touches: [{ clientX: 195, clientY: 780 }],
    });
    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 710 }],
    });
    expect(onHome).toHaveBeenCalledTimes(1);
    engine.dispose();
  });

  it('uses getContainer callback when provided to resolve bottom boundary', () => {
    const onHome = vi.fn();
    const customContainer = {
      getBoundingClientRect: () => ({ top: 0, bottom: 600, left: 0, right: 390, width: 390, height: 600 }),
    } as unknown as HTMLElement;

    const engine = createSwipeHomeEngine({
      onHome,
      triggerAreaHeight: 72,
      getContainer: () => customContainer,
    });

    // startY = 550, containerBottom = 600 -> distance = 50px <= 72px (valid)
    engine.onTouchStart({
      currentTarget: null,
      touches: [{ clientX: 195, clientY: 550 }],
    });
    engine.onTouchEnd({
      changedTouches: [{ clientX: 195, clientY: 490 }],
    });
    expect(onHome).toHaveBeenCalledOnce();
    engine.dispose();
  });
});
