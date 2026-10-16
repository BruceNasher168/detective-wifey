import { describe, expect, it } from 'vitest';
import { assistiveMenuPosition } from './assistiveMenuPosition';

const insets = { top: 16, right: 16, bottom: 16, left: 16 };
const viewport = { width: 390, height: 844 };

describe('Assistive Touch menu anchoring', () => {
  it.each([
    { x: 0, y: 0, left: 16, top: 16 },
    { x: 334, y: 0, left: 94, top: 16 },
    { x: 0, y: 788, left: 16, top: 548 },
    { x: 334, y: 788, left: 94, top: 548 },
  ])('keeps the menu within the screen at button position $x,$y', ({ x, y, left, top }) => {
    const result = assistiveMenuPosition(viewport, { x, y, width: 56, height: 56 }, insets);
    expect(result.left).toBe(left);
    expect(result.top).toBe(top);
    expect(result.size).toBe(280);
    expect(result.left + result.originX).toBe(x + 28);
    expect(result.top + result.originY).toBe(y + 28);
  });

  it('opens around the actual button position instead of a fixed screen center', () => {
    const result = assistiveMenuPosition({ width: 1000, height: 844 }, { x: 400, y: 300, width: 56, height: 56 }, insets);
    expect(result.left).toBe(288);
    expect(result.top + result.size * 5 / 6).toBeCloseTo(328);
  });

  it('aligns the bottom-row Home action vertically with the floating button', () => {
    const result = assistiveMenuPosition(viewport, { x: 334, y: 630, width: 56, height: 56 }, insets);
    expect(result.top + result.size * 5 / 6).toBeCloseTo(658);
    expect(result.top).toBeLessThan(518);
  });

  it.each([{ x: 0, y: 0 }, { x: 334, y: 630 }, { x: 334, y: 788 }])(
    'contracts exactly onto the floating button at $x,$y', anchor => {
      const result = assistiveMenuPosition(viewport, { ...anchor, width: 56, height: 56 }, insets);
      const { scale, x, y } = result.closed;
      expect(result.size * scale).toBeCloseTo(56);
      expect(result.left + (1 - scale) * result.originX + x).toBeCloseTo(anchor.x);
      expect(result.top + (1 - scale) * result.originY + y).toBeCloseTo(anchor.y);
    },
  );

  it('fits a short viewport and honors all four hardware safe areas', () => {
    const safe = { top: 44, right: 20, bottom: 34, left: 20 };
    const result = assistiveMenuPosition({ width: 320, height: 300 }, { x: 264, y: 244, width: 56, height: 56 }, safe);
    expect(result.size).toBe(222);
    expect(result.left).toBeGreaterThanOrEqual(safe.left);
    expect(result.top).toBeGreaterThanOrEqual(safe.top);
    expect(result.left + result.size).toBeLessThanOrEqual(320 - safe.right);
    expect(result.top + result.size).toBeLessThanOrEqual(300 - safe.bottom);
  });
});
