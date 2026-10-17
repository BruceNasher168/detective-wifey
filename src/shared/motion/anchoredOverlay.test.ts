import { describe, expect, it, vi } from 'vitest';
import { anchoredTransform, animateOverlay } from './anchoredOverlay';

describe('notebook anchor motion', () => {
  it('maps the notebook into the actual right-edge tab, including translated host coordinates', () => {
    expect(anchoredTransform({ left: 100, top: 20, width: 400, height: 800 },
      { left: 456, top: 540, width: 44, height: 76 }))
      .toBe('translate(356px, 520px) scale(0.11, 0.095)');
    expect(anchoredTransform({ left: 0, top: 0, width: 0, height: 0 })).toBe('scale(.96)');
  });

  it('samples the visible frame before cancelling a reversed transition and retains exit until completion', () => {
    const sequence: string[] = [];
    vi.stubGlobal('getComputedStyle', () => {
      sequence.push('read'); return { transform: 'matrix(.5, 0, 0, .5, 40, 20)', opacity: '.6', borderRadius: '10px', filter: 'none' };
    });
    const animation = { onfinish: null } as unknown as Animation;
    const animate = vi.fn((_frames: Keyframe[], _options?: KeyframeAnimationOptions) => animation);
    const element = { style: {}, animate } as unknown as HTMLElement;
    const complete = vi.fn();
    const cancel = vi.fn(() => sequence.push('cancel'));
    animateOverlay(element, false, 'scale(.1)', complete, { cancel });
    expect(sequence).toEqual(['read', 'cancel']);
    expect(animate.mock.calls[0][0]).toEqual([
      { transform: 'matrix(.5, 0, 0, .5, 40, 20)', opacity: '.6', borderRadius: '10px', filter: 'blur(0px)', offset: 0 },
      { opacity: '.6', filter: 'blur(1px)', offset: 1 - 40 / 300, easing: 'cubic-bezier(.4, 0, 1, 1)' },
      { transform: 'scale(.1)', opacity: '0', borderRadius: '20px', filter: 'blur(4px)', offset: 1 },
    ]);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: 300, fill: 'both' });
    expect(complete).not.toHaveBeenCalled();
    animation.onfinish?.call(animation, {} as AnimationPlaybackEvent);
    expect(complete).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('commits immediately without travel when reduced motion is enabled', () => {
    vi.stubGlobal('getComputedStyle', () => ({ transform: 'none', opacity: '0', borderRadius: '0px', filter: 'none' }));
    const animate = vi.fn();
    const element = { style: {}, animate } as unknown as HTMLElement;
    const complete = vi.fn();
    animateOverlay(element, true, 'scale(.1)', complete, undefined, true);
    expect(animate).not.toHaveBeenCalled();
    expect(element.style).toMatchObject({ transform: 'none', opacity: '1' });
    expect(complete).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('omits transform keyframe when closedTransform is none, preventing backdrop-filter GPU snapping', () => {
    vi.stubGlobal('getComputedStyle', () => ({ transform: 'none', opacity: '0', borderRadius: '0px' }));
    const animation = { onfinish: null } as unknown as Animation;
    const animate = vi.fn((_frames: Keyframe[]) => animation);
    const element = { style: {}, animate } as unknown as HTMLElement;
    const complete = vi.fn();
    animateOverlay(element, true, 'none', complete);
    expect(animate).toHaveBeenCalledOnce();
    expect(animate.mock.calls[0][0]).toEqual([
      { opacity: '0', borderRadius: '0px', filter: 'blur(0px)', offset: 0 },
      { opacity: '1', offset: 40 / 400 },
      { opacity: '1', borderRadius: '0px', filter: 'blur(0px)', offset: 1 },
    ]);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: 400, fill: 'both' });
    vi.unstubAllGlobals();
  });
});
