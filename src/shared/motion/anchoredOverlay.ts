export interface OverlayRect { left: number; top: number; width: number; height: number }

const NOTEBOOK_EASING = 'cubic-bezier(.42, 0, .58, 1)';
const NOTEBOOK_OPEN_DURATION_MS = 400;
const NOTEBOOK_CLOSE_DURATION_MS = 300;
const NOTEBOOK_FADE_DURATION_MS = 40;
const NOTEBOOK_MOTION_BLUR = '4px';
const NOTEBOOK_CLOSE_TRAVEL_BLUR = '1px';
const NOTEBOOK_CLOSE_FADE_EASING = 'cubic-bezier(.4, 0, 1, 1)';

/** Maps the full surface to the measured trigger, including transformed host canvases. */
export function anchoredTransform(surface: OverlayRect, anchor?: OverlayRect): string {
  if (!anchor || !surface.width || !surface.height) return 'scale(.96)';
  return `translate(${anchor.left - surface.left}px, ${anchor.top - surface.top}px) scale(${anchor.width / surface.width}, ${anchor.height / surface.height})`;
}

/** Keeps the collapsed overlay's corner radius proportional to the measured tab. */
export function anchoredCornerRadius(surface: OverlayRect, anchor?: OverlayRect, visibleRadius = 16): string {
  if (!anchor || !surface.width || !surface.height) return `${visibleRadius}px`;
  const scale = Math.min(anchor.width / surface.width, anchor.height / surface.height);
  return scale > 0 ? `${visibleRadius / scale}px` : `${visibleRadius}px`;
}

/** Retarget from the rendered frame before cancelling, so a reversal never jumps. */
export function animateOverlay(element: HTMLElement, open: boolean, closedTransform: string,
  complete: () => void, previous?: Pick<Animation, 'cancel'>, reducedMotion = false,
  closedBorderRadius = '20px'): Animation | undefined {
  const current = getComputedStyle(element);
  const currentTransform = current.transform && current.transform !== 'none' ? current.transform : null;
  const currentFilter = current.filter && current.filter !== 'none' ? current.filter : 'blur(0px)';
  const targetTransform = open ? null : (closedTransform !== 'none' ? closedTransform : null);
  const anchorRadius = closedTransform === 'none' ? '0px' : closedBorderRadius;
  const anchorFilter = closedTransform === 'none' ? 'blur(0px)' : `blur(${NOTEBOOK_MOTION_BLUR})`;
  // Round the notebook as it contracts toward its floating tab.
  const from: Keyframe = {
    opacity: current.opacity,
    borderRadius: open && !previous ? anchorRadius : current.borderRadius,
    filter: open && !previous ? anchorFilter : currentFilter };
  const to: Keyframe = { opacity: open ? '1' : '0', borderRadius: open ? '0px' : anchorRadius,
    filter: open ? 'blur(0px)' : anchorFilter };
  if (currentTransform || targetTransform || closedTransform !== 'none') {
    from.transform = current.transform;
    to.transform = open ? 'none' : closedTransform;
  }
  previous?.cancel();
  const targetOpacity = open ? '1' : '0';
  Object.assign(element.style, to, { opacity: current.opacity });
  if (reducedMotion || !element.animate) {
    element.style.opacity = targetOpacity;
    complete();
    return;
  }
  const fadeOffset = open
    ? NOTEBOOK_FADE_DURATION_MS / NOTEBOOK_OPEN_DURATION_MS
    : 1 - NOTEBOOK_FADE_DURATION_MS / NOTEBOOK_CLOSE_DURATION_MS;
  const keyframes: Keyframe[] = open ? [
    { ...from, offset: 0 },
    { opacity: targetOpacity, offset: fadeOffset },
    { ...to, offset: 1 },
  ] : [
    { ...from, offset: 0 },
    { opacity: current.opacity, filter: `blur(${NOTEBOOK_CLOSE_TRAVEL_BLUR})`,
      offset: fadeOffset, easing: NOTEBOOK_CLOSE_FADE_EASING },
    { ...to, offset: 1 },
  ];
  const animation = element.animate(keyframes, {
    duration: open ? NOTEBOOK_OPEN_DURATION_MS : NOTEBOOK_CLOSE_DURATION_MS,
    easing: NOTEBOOK_EASING,
    fill: 'both',
  });
  animation.onfinish = complete;
  return animation;
}
