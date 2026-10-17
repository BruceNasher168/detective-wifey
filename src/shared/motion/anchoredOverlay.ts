export interface OverlayRect { left: number; top: number; width: number; height: number }

/** Maps the full surface to the measured trigger, including transformed host canvases. */
export function anchoredTransform(surface: OverlayRect, anchor?: OverlayRect): string {
  if (!anchor || !surface.width || !surface.height) return 'scale(.96)';
  return `translate(${anchor.left - surface.left}px, ${anchor.top - surface.top}px) scale(${anchor.width / surface.width}, ${anchor.height / surface.height})`;
}

/** Retarget from the rendered frame before cancelling, so a reversal never jumps. */
export function animateOverlay(element: HTMLElement, open: boolean, closedTransform: string,
  complete: () => void, previous?: Animation, reducedMotion = false): Animation | undefined {
  const current = getComputedStyle(element);
  const currentTransform = current.transform && current.transform !== 'none' ? current.transform : null;
  const targetTransform = open ? null : (closedTransform !== 'none' ? closedTransform : null);
  const from: Keyframe = { opacity: current.opacity, borderRadius: current.borderRadius };
  const to: Keyframe = { opacity: open ? '1' : '0', borderRadius: open ? '0px' : '20px' };
  if (currentTransform || targetTransform || closedTransform !== 'none') {
    from.transform = current.transform;
    to.transform = open ? 'none' : closedTransform;
  }
  previous?.cancel();
  Object.assign(element.style, to);
  if (reducedMotion || !element.animate) { complete(); return; }
  const animation = element.animate([from, to], {
    duration: open ? 400 : 300, easing: 'cubic-bezier(.16,1,.3,1)',
  });
  animation.onfinish = complete;
  return animation;
}
