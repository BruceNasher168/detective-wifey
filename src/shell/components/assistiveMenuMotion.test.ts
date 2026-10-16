import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { animateAssistiveMenu } from './assistiveMenuMotion';

const preference = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
const target = { scale: .2, x: 25.6, y: 18.6 };
beforeEach(() => {
  preference.matches = false;
  vi.clearAllMocks();
  vi.stubGlobal('window', { matchMedia: () => preference });
  vi.stubGlobal('getComputedStyle', () => ({ scale: 'none', transform: 'none' }));
});
afterEach(() => vi.unstubAllGlobals());

function panel() {
  const animation = { onfinish: null as (() => void) | null, cancel: vi.fn() };
  const element = { style: { scale: '', translate: '', transform: '', opacity: '' }, animate: vi.fn(() => animation) };
  return { element, animation, node: element as unknown as HTMLElement };
}

describe('live Assistive Touch glass motion', () => {
  it.each([true, false])('does not fade or snapshot glass while open=%s', open => {
    const { node, element, animation } = panel();
    const exit = vi.fn();
    animateAssistiveMenu(node, open, exit, target);
    const frames = element.animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions];
    expect(frames[0].every(frame => frame.opacity === undefined && frame.backdropFilter === undefined)).toBe(true);
    expect(frames[0][frames[0].length - 1]?.scale).toBe(open ? '1' : '0.2');
    expect(exit).not.toHaveBeenCalled();
    animation.onfinish?.();
    expect(exit).toHaveBeenCalledTimes(open ? 0 : 1);
    expect(preference.removeEventListener).toHaveBeenCalled();
    if (!open) {
      expect(element.style.scale).toBe('0.2');
      expect(element.style.translate).toBe('25.6px 18.6px');
    }
  });

  it('starts from the current swipe displacement and finishes at the button', () => {
    vi.stubGlobal('getComputedStyle', () => ({ scale: '1', transform: 'matrix(1, 0, 0, 1, 90, 0)' }));
    const { node, element } = panel();
    const stop = animateAssistiveMenu(node, false, vi.fn(), target);
    const frames = element.animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(frames[0][0].transform).toBe('matrix(1, 0, 0, 1, 90, 0)');
    expect(frames[0][1].transform).toBe('none');
    stop();
  });

  it('does not dismiss a reopened panel when the cancelled close finishes late', () => {
    const { node, animation } = panel();
    const exit = vi.fn();
    const stop = animateAssistiveMenu(node, false, exit, target);
    const lateFinish = animation.onfinish;
    stop();
    lateFinish?.();
    expect(exit).not.toHaveBeenCalled();
  });

  it('closes immediately without animation when reduced motion is enabled', () => {
    preference.matches = true;
    const { node, element } = panel();
    const exit = vi.fn();
    animateAssistiveMenu(node, false, exit, target);
    expect(element.animate).not.toHaveBeenCalled();
    expect(exit).toHaveBeenCalledOnce();
  });

  it.each([true, false])('crossfades popup and button in opposite directions on open=%s', open => {
    const { node, element, animation } = panel();
    const floating = panel();
    const popupBlend = { onfinish: null, cancel: vi.fn() };
    element.animate.mockReturnValueOnce(animation).mockReturnValueOnce(popupBlend);
    const exit = vi.fn();
    animateAssistiveMenu(node, open, exit, target, undefined, floating.node);
    const popupFrames = element.animate.mock.calls[1] as unknown as [Keyframe[], KeyframeAnimationOptions];
    const buttonFrames = floating.element.animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions];
    expect(popupFrames[0][1].opacity).toBe(open ? '1' : '0');
    expect(buttonFrames[0][1].opacity).toBe(open ? '0' : '1');
    expect(popupFrames[1]).toEqual(buttonFrames[1]);
    expect(popupFrames[1].delay).toBe(open ? 0 : 80);
    animation.onfinish?.();
    expect(element.style.opacity).toBe(open ? '1' : '0');
    expect(floating.element.style.opacity).toBe(open ? '0' : '1');
    expect(popupBlend.cancel).toHaveBeenCalled();
  });
});
