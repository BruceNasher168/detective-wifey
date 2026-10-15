import { flushSync } from 'react-dom';

export type MotionKind = 'open' | 'close' | 'push' | 'pop' | 'fade' | 'sheet-in' | 'sheet-out';
interface TransitionHandle {
  skipTransition(): void;
  ready: Promise<void>;
  finished: Promise<void>;
}
let active: { handle: TransitionHandle; commit: () => void } | undefined;

export function launcherFlight(x: number, y: number, originX: number, originY: number, width: number, height: number) {
  const dx = x - originX;
  const dy = y - originY;
  const length = Math.hypot(dx, dy);
  if (length < 1) return { x: 0, y: 0 };
  const distance = Math.hypot(width, height);
  return { x: dx / length * distance, y: dy / length * distance };
}

/** Measure in viewport coordinates so compact and desktop shells share the same motion. */
export function appTransition(kind: 'open' | 'close', appId: string, update: () => void): void {
  const flights: { name: string; x: number; y: number }[] = [];
  if (typeof document !== 'undefined') {
    const viewport = document.querySelector('.phone-motion-content')?.getBoundingClientRect();
    const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-launch-app]'));
    const icon = buttons.find(element => element.dataset.launchApp === appId)
      ?.querySelector('.phone-app-icon')?.getBoundingClientRect();
    const style = document.documentElement.style;
    const measured = viewport && icon && viewport.width > 0 && viewport.height > 0;
    style.setProperty('--app-dx', measured ? `${icon.x + icon.width / 2 - viewport.x - viewport.width / 2}px` : '0px');
    style.setProperty('--app-dy', measured ? `${icon.y + icon.height / 2 - viewport.y - viewport.height / 2}px` : '0px');
    style.setProperty('--app-scale-x', measured ? `${icon.width / viewport.width}` : '.96');
    style.setProperty('--app-scale-y', measured ? `${icon.height / viewport.height}` : '.96');
    if (measured) {
      for (const button of buttons) {
        const bounds = button.querySelector('.phone-app-icon')?.getBoundingClientRect();
        if (!bounds) continue;
        const flight = launcherFlight(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2,
          icon.x + icon.width / 2, icon.y + icon.height / 2, viewport.width, viewport.height);
        flights.push({ name: `launcher-${button.dataset.launchApp}`, ...flight });
      }
    }
    let rules = document.getElementById('ios-launcher-motion');
    if (!rules) {
      rules = document.createElement('style');
      rules.id = 'ios-launcher-motion';
      document.head.append(rules);
    }
    // Named snapshot pseudo-elements do not inherit the source icon's variables.
    // Supply each flight directly to its snapshot; only numbers and local app IDs enter CSS.
    rules.textContent = flights.map(flight => {
      const name = flight.name.replace(/[^a-zA-Z0-9_-]/g, '');
      const variables = `--icon-flight-x:${flight.x}px;--icon-flight-y:${flight.y}px;`;
      const timing = 'animation-duration:var(--ios-app-duration);animation-timing-function:var(--ease-ios-spring);animation-fill-mode:both;';
      return `html[data-motion="open"]::view-transition-old(${name}){${variables}${timing}animation-name:ios-launcher-out;}`
        + `html[data-motion="close"]::view-transition-new(${name}){${variables}${timing}animation-name:ios-launcher-in;}`;
    }).join('\n');
  }
  transition(kind, update);
}

/** Snapshots are visual only: outgoing UI cannot receive input or save stale state. */
export function transition(kind: MotionKind, update: () => void): void {
  // A skipped browser transition still runs its callback. Commit it once, in order,
  // before accepting another action, including reduced-motion/fallback actions.
  active?.commit();
  active?.handle.skipTransition();
  active = undefined;
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function'
    || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    update();
    return;
  }
  let committed = false;
  const commit = () => {
    if (committed) return;
    committed = true;
    flushSync(update);
  };
  document.documentElement.dataset.motion = kind;
  const handle = document.startViewTransition(commit);
  const current = { handle, commit };
  active = current;
  // ready rejects normally when interrupted, hidden, or snapshots cannot be taken.
  void handle.ready.catch(() => {});
  const cleanup = () => {
    if (active !== current) return;
    active = undefined;
    delete document.documentElement.dataset.motion;
  };
  void handle.finished.then(cleanup, cleanup);
}

export function navigationMotion(previous: unknown, next: unknown): MotionKind {
  if (Array.isArray(previous) && Array.isArray(next)) {
    return next.length === previous.length ? 'fade' : next.length > previous.length ? 'push' : 'pop';
  }
  if (next == null || next === false) return 'pop';
  if (previous == null || previous === false) return 'push';
  return 'fade';
}
