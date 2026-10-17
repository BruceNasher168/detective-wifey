import { describe, expect, it } from 'vitest';
import { isFloatingDrag } from './floatingControlPosition';
import { isControlSwipe } from './ControlCenter';

describe('system control gesture ownership', () => {
  it('keeps short notebook taps distinct from dragging in every direction', () => {
    expect(isFloatingDrag(2, 3)).toBe(false);
    expect(isFloatingDrag(-38, 5)).toBe(true);
    expect(isFloatingDrag(-4, 38)).toBe(true);
    expect(isFloatingDrag(-10, -28)).toBe(true);
    expect(isFloatingDrag(38, 0)).toBe(true);
  });

  it('requires dominant vertical travel and the correct direction for Control Center', () => {
    expect(isControlSwipe(4, 60, 'down')).toBe(true);
    expect(isControlSwipe(4, -60, 'up')).toBe(true);
    expect(isControlSwipe(4, -60, 'down')).toBe(false);
    expect(isControlSwipe(60, 60, 'down')).toBe(false);
    expect(isControlSwipe(0, 20, 'down')).toBe(false);
  });
});
