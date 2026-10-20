import { describe, expect, it } from 'vitest';
import { clampFloatingPoint, floatingDockPosition, floatingVelocity, projectFloatingDock, isFloatingDetached, NOTEBOOK_FLOAT_SIZE, NOTEBOOK_TAB_WIDTH, NOTEBOOK_TAB_HEIGHT } from './floatingControlPosition';

const bounds = { left: 0, right: 362, top: 67, bottom: 746 };
describe('floating notebook tab docking', () => {
  it('detaches only with enough inward clearance for a centered floating square', () => {
    expect(NOTEBOOK_TAB_HEIGHT).toBe(80);
    expect(NOTEBOOK_FLOAT_SIZE).toBe(NOTEBOOK_TAB_HEIGHT);
    expect(isFloatingDetached({ x: bounds.right, y: 400 }, bounds)).toBe(false);
    expect(isFloatingDetached({ x: 0, y: 500 }, bounds)).toBe(false);
    expect(isFloatingDetached({ x: 10, y: 500 }, bounds)).toBe(false);
    const clearance = (NOTEBOOK_FLOAT_SIZE - NOTEBOOK_TAB_WIDTH) / 2 + 5;
    for (const x of [clearance, 100, bounds.right - clearance]) {
      expect(isFloatingDetached({ x, y: 400 }, bounds)).toBe(true);
      const visualLeft = x + (NOTEBOOK_TAB_WIDTH - NOTEBOOK_FLOAT_SIZE) / 2;
      expect(visualLeft).toBeGreaterThanOrEqual(bounds.left);
      expect(visualLeft + NOTEBOOK_FLOAT_SIZE).toBeLessThanOrEqual(bounds.right + NOTEBOOK_TAB_WIDTH);
    }
  });
  it('throws to either edge even when a short flick does not cross a wide screen midline', () => {
    const wide = { ...bounds, right: 1400 };
    expect(projectFloatingDock({ x: 1300, y: 400 }, { x: -.6, y: 0 }, wide).edge).toBe('left');
    expect(projectFloatingDock({ x: 60, y: 400 }, { x: .6, y: 0 }, wide).edge).toBe('right');
  });
  it('keeps vertical flicks on their current side and slow drags on the nearest edge', () => {
    expect(projectFloatingDock({ x: 350, y: 400 }, { x: -.6, y: 2 }, bounds).edge).toBe('right');
    expect(projectFloatingDock({ x: 10, y: 400 }, { x: .6, y: -2 }, bounds).edge).toBe('left');
    expect(projectFloatingDock({ x: 200, y: 400 }, { x: -.2, y: 0 }, bounds).edge).toBe('right');
    expect(projectFloatingDock({ x: 150, y: 400 }, { x: .2, y: 0 }, bounds).edge).toBe('left');
  });
  it('carries vertical momentum and clamps away from status and home areas', () => {
    expect(projectFloatingDock({ x: 340, y: 400 }, { x: 0, y: 1 }, bounds).point.y).toBe(580);
    expect(projectFloatingDock({ x: 0, y: 100 }, { x: 0, y: -3 }, bounds).point.y).toBe(67);
    expect(projectFloatingDock({ x: 0, y: 700 }, { x: 0, y: 3 }, bounds).point.y).toBe(746);
    expect(clampFloatingPoint({ x: -20, y: 900 }, bounds)).toEqual({ x: 0, y: 746 });
  });
  it('snaps without inertia for cancellation or reduced motion', () => {
    expect(projectFloatingDock({ x: 300, y: 400 }, { x: -5, y: 5 }, bounds, false).point).toEqual({ x: 362, y: 400 });
  });
  it('preserves relative dock position across resize and safely handles tiny hosts', () => {
    const dock = projectFloatingDock({ x: 0, y: (67 + 746) / 2 }, { x: 0, y: 0 }, bounds);
    expect(floatingDockPosition(dock.edge, dock.fraction, { left: 10, right: 700, top: 50, bottom: 550 })).toEqual({ x: 10, y: 300 });
    expect(floatingDockPosition('right', 2, { left: 0, right: 0, top: 52, bottom: 52 })).toEqual({ x: 0, y: 52 });
  });
  it('uses recent release velocity and discards paused or stale flicks', () => {
    expect(floatingVelocity([{ x: 100, y: 200, time: 10 }], { x: 50, y: 240, time: 60 })).toEqual({ x: -1, y: .8 });
    expect(floatingVelocity([{ x: 100, y: 200, time: 10 }], { x: 50, y: 240, time: 160 })).toEqual({ x: 0, y: 0 });
  });
});
