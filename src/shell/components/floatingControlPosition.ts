export const FLOATING_DRAG_THRESHOLD = 6;
export const FLOATING_SAMPLE_MS = 100;
export const FLOATING_PROJECTION_MS = 180;
export const FLOATING_SETTLE_MS = 300;
export const FLOATING_THROW_SPEED = .5;
export type DockEdge = 'left' | 'right';
export interface FloatingBounds { left: number; right: number; top: number; bottom: number }
export interface FloatingPoint { x: number; y: number }
export interface FloatingSample extends FloatingPoint { time: number }
export const NOTEBOOK_TAB_WIDTH = 28;
export const NOTEBOOK_TAB_HEIGHT = 61.6;
export const NOTEBOOK_FLOAT_SIZE = NOTEBOOK_TAB_HEIGHT;
const TAB_DETACH_CLEARANCE = (NOTEBOOK_FLOAT_SIZE - NOTEBOOK_TAB_WIDTH) / 2 + 4;
/** Keep a centered floating square inside the shell; dragging along an edge stays tab-shaped. */
export const isFloatingDetached = (point: FloatingPoint, bounds: FloatingBounds) =>
  point.x - bounds.left > TAB_DETACH_CLEARANCE && bounds.right - point.x > TAB_DETACH_CLEARANCE;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));
export const isFloatingDrag = (dx: number, dy: number) => Math.hypot(dx, dy) > FLOATING_DRAG_THRESHOLD;
export const clampFloatingPoint = (point: FloatingPoint, bounds: FloatingBounds): FloatingPoint => ({
  x: clamp(point.x, bounds.left, bounds.right), y: clamp(point.y, bounds.top, bounds.bottom),
});
/** Same recent-sample convention as retired AssistiveTouch; stale movement cannot cause a throw. */
export function floatingVelocity(samples: FloatingSample[], release: FloatingSample): FloatingPoint {
  const sample = samples.find(point => release.time - point.time <= FLOATING_SAMPLE_MS && release.time > point.time);
  if (!sample) return { x: 0, y: 0 };
  const elapsed = release.time - sample.time;
  return { x: (release.x - sample.x) / elapsed, y: (release.y - sample.y) / elapsed };
}
export function floatingDockPosition(edge: DockEdge, fraction: number, bounds: FloatingBounds): FloatingPoint {
  return { x: edge === 'left' ? bounds.left : bounds.right,
    y: bounds.top + clamp(fraction, 0, 1) * Math.max(0, bounds.bottom - bounds.top) };
}
/** Project both axes before docking: a flick can cross the midline or travel farther vertically. */
export function projectFloatingDock(point: FloatingPoint, velocity: FloatingPoint, bounds: FloatingBounds, inertia = true) {
  const horizon = inertia ? FLOATING_PROJECTION_MS : 0;
  const projected = clampFloatingPoint({ x: point.x + velocity.x * horizon, y: point.y + velocity.y * horizon }, bounds);
  const horizontalThrow = inertia && Math.abs(velocity.x) >= FLOATING_THROW_SPEED && Math.abs(velocity.x) > Math.abs(velocity.y);
  const edge: DockEdge = horizontalThrow ? (velocity.x < 0 ? 'left' : 'right')
    : point.x < (bounds.left + bounds.right) / 2 ? 'left' : 'right';
  return { edge, point: { x: edge === 'left' ? bounds.left : bounds.right, y: projected.y },
    fraction: bounds.bottom > bounds.top ? (projected.y - bounds.top) / (bounds.bottom - bounds.top) : 0 };
}
