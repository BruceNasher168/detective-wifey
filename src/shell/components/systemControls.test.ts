import { describe, expect, it } from 'vitest';
import { tabGesture } from './NotebookTab';
import { isControlSwipe } from './ControlCenter';

describe('system control gesture ownership', () => {
  it('separates notebook taps, inward pulls and vertical repositioning', () => {
    expect(tabGesture(2, 3)).toBe('tap');
    expect(tabGesture(-38, 5)).toBe('open');
    expect(tabGesture(-4, 38)).toBe('move');
    expect(tabGesture(-10, 28)).toBe('move');
    expect(tabGesture(38, 0)).toBe('cancel');
  });

  it('requires dominant vertical travel and the correct direction for Control Center', () => {
    expect(isControlSwipe(4, 60, 'down')).toBe(true);
    expect(isControlSwipe(4, -60, 'up')).toBe(true);
    expect(isControlSwipe(4, -60, 'down')).toBe(false);
    expect(isControlSwipe(60, 60, 'down')).toBe(false);
    expect(isControlSwipe(0, 20, 'down')).toBe(false);
  });
});
