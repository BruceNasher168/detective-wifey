import { afterEach, describe, expect, it, vi } from 'vitest';
import { navigationMotion, transition } from './transition';

afterEach(() => vi.unstubAllGlobals());

describe('motion navigation safety', () => {
  it('derives push, pop, and same-depth tab changes', () => {
    expect(navigationMotion(null, 'thread')).toBe('push');
    expect(navigationMotion('thread', null)).toBe('pop');
    expect(navigationMotion(['home'], ['home', 'detail'])).toBe('push');
    expect(navigationMotion(['home', 'detail'], ['home'])).toBe('pop');
    expect(navigationMotion(['home'], ['profile'])).toBe('fade');
  });

  it('updates immediately without browser support or with reduced motion', () => {
    const update = vi.fn();
    vi.stubGlobal('document', {});
    transition('push', update);
    const startViewTransition = vi.fn();
    vi.stubGlobal('document', { startViewTransition });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    transition('push', update);
    expect(update).toHaveBeenCalledTimes(2);
    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it('commits interrupted actions once and in order, even if browser callbacks arrive late', async () => {
    const callbacks: (() => void)[] = [];
    const finishes: (() => void)[] = [];
    const skip = vi.fn();
    const root = { dataset: {} as Record<string, string> };
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal('document', {
      documentElement: root,
      startViewTransition: (callback: () => void) => {
        callbacks.push(callback);
        return { skipTransition: skip, ready: Promise.resolve(), finished: new Promise<void>(resolve => finishes.push(resolve)) };
      },
    });
    const actions: string[] = [];
    transition('push', () => actions.push('open'));
    transition('pop', () => actions.push('back'));
    callbacks[1]();
    callbacks[0]();
    expect(actions).toEqual(['open', 'back']);
    expect(skip).toHaveBeenCalledOnce();
    finishes[0]();
    await Promise.resolve();
    expect(root.dataset.motion).toBe('pop');
    finishes[1]();
    await Promise.resolve();
    expect(root.dataset.motion).toBeUndefined();
  });
});
