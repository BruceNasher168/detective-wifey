/** Keep glass live; crossfade with the floating button only at the handoff. */
export function animateAssistiveMenu(
  panel: HTMLElement, open: boolean, onExit: () => void,
  target: { scale: number; x: number; y: number }, stopPrevious?: () => void, button?: HTMLElement,
): () => void {
  const visible = getComputedStyle(panel);
  const scale = visible.scale === 'none' ? (open ? '.94' : '1') : visible.scale;
  const transform = visible.transform;
  const translate = visible.translate || 'none';
  const opacity = open && visible.scale === 'none' ? '0' : visible.opacity || '1';
  const buttonOpacity = button ? getComputedStyle(button).opacity || (open ? '1' : '0') : '';
  stopPrevious?.();
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !panel.animate) {
    panel.style.scale = '';
    panel.style.translate = '';
    if (button) {
      panel.style.opacity = open ? '1' : '0';
      button.style.opacity = open ? '0' : '1';
    }
    if (!open) onExit();
    return () => {};
  }
  const animation = panel.animate(open
    ? [{ scale, translate }, { scale: '1', translate: '0px 0px' }]
    : [{ scale, translate, transform }, { scale: `${target.scale}`, translate: `${target.x}px ${target.y}px`, transform: 'none' }], {
    duration: open ? 350 : 240,
    easing: open ? 'cubic-bezier(.16,1,.3,1)' : 'cubic-bezier(.32,.72,0,1)',
    fill: 'both',
  });
  const blends: Animation[] = [];
  if (button) {
    const timing: KeyframeAnimationOptions = {
      duration: 160, delay: open ? 0 : 80,
      easing: 'cubic-bezier(.42,0,.58,1)', fill: 'both',
    };
    blends.push(panel.animate([{ opacity }, { opacity: open ? '1' : '0' }], timing));
    blends.push(button.animate([{ opacity: buttonOpacity }, { opacity: open ? '0' : '1' }], timing));
  }
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    preference.removeEventListener('change', reduce);
    animation.onfinish = null;
    animation.cancel();
    blends.forEach(blend => blend.cancel());
  };
  const finish = () => {
    if (stopped) return;
    // Hold the exact endpoint until React removes the panel. Cancelling the
    // fill before committing these values would flash the full-size glass.
    panel.style.scale = open ? '' : `${target.scale}`;
    panel.style.translate = open ? '' : `${target.x}px ${target.y}px`;
    if (!open) panel.style.transform = 'none';
    if (button) {
      panel.style.opacity = open ? '1' : '0';
      button.style.opacity = open ? '0' : '1';
    }
    stop();
    if (!open) onExit();
  };
  const reduce = (event: MediaQueryListEvent) => { if (event.matches) finish(); };
  animation.onfinish = finish;
  preference.addEventListener('change', reduce);
  return stop;
}
