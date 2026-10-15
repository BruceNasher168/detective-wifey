import { flushSync } from 'react-dom';

export type MotionKind = 'open' | 'close' | 'push' | 'pop' | 'fade' | 'sheet-in' | 'sheet-out';
interface TransitionHandle {
  skipTransition(): void;
  ready: Promise<void>;
  finished: Promise<void>;
}
let active: { handle: TransitionHandle; commit: () => void } | undefined;

/** Measure in viewport coordinates so compact and desktop shells share the same motion. */
export function appTransition(kind: 'open' | 'close', appId: string, update: () => void): void {
  if (typeof document !== 'undefined') {
    const viewport = document.querySelector('.phone-motion-content')?.getBoundingClientRect();
    const icon = Array.from(document.querySelectorAll<HTMLElement>('[data-launch-app]'))
      .find(element => element.dataset.launchApp === appId)?.querySelector('.phone-app-icon')?.getBoundingClientRect();
    const style = document.documentElement.style;
    const measured = viewport && icon && viewport.width > 0 && viewport.height > 0;
    style.setProperty('--app-dx', measured ? `${icon.x + icon.width / 2 - viewport.x - viewport.width / 2}px` : '0px');
    style.setProperty('--app-dy', measured ? `${icon.y + icon.height / 2 - viewport.y - viewport.height / 2}px` : '0px');
    style.setProperty('--app-scale-x', measured ? `${icon.width / viewport.width}` : '.96');
    style.setProperty('--app-scale-y', measured ? `${icon.height / viewport.height}` : '.96');
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
