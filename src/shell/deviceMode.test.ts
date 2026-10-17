import { describe, expect, it } from 'vitest';
import { detectDeviceMode, detectFullscreen, isMobileDevice, shouldShowStatusBar } from './deviceMode';

describe('shell device mode', () => {
  it('recognizes iPhone and iPadOS desktop user agents', () => {
    expect(detectDeviceMode({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', maxTouchPoints: 5 })).toBe('ios');
    expect(detectDeviceMode({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', maxTouchPoints: 5 })).toBe('ios');
  });

  it('keeps Android and desktop browsers on the existing mode', () => {
    expect(detectDeviceMode({ userAgent: 'Mozilla/5.0 (Linux; Android 15)', maxTouchPoints: 5 })).toBe('default');
    expect(detectDeviceMode({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', maxTouchPoints: 0 })).toBe('default');
    expect(detectDeviceMode({ userAgent: 'Mozilla/5.0 (Windows NT 10.0)', maxTouchPoints: 10 })).toBe('default');
  });

  it('correctly identifies mobile devices vs desktop browsers', () => {
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', maxTouchPoints: 5 })).toBe(true);
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7)', maxTouchPoints: 5 })).toBe(true);
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', maxTouchPoints: 5 })).toBe(true);
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', maxTouchPoints: 0 })).toBe(false);
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', maxTouchPoints: 0 })).toBe(false);
    expect(isMobileDevice({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', maxTouchPoints: 10 })).toBe(false);
  });

  it('detects fullscreen via Fullscreen API or CSS media query', () => {
    expect(detectFullscreen({ fullscreenElement: {} as Element }, null)).toBe(true);
    expect(detectFullscreen({ webkitFullscreenElement: {} as Element }, null)).toBe(true);
    expect(detectFullscreen(null, { matchMedia: (q: string) => ({ matches: q === '(display-mode: fullscreen)' }) })).toBe(true);
    expect(detectFullscreen({ fullscreenElement: null }, { matchMedia: () => ({ matches: false }) })).toBe(false);
  });

  it('enforces status bar visibility policy: only show on mobile when in fullscreen', () => {
    // Desktop: always show status bar (no native phone status bar)
    expect(shouldShowStatusBar({ isMobile: false, isFullscreen: false })).toBe(true);
    expect(shouldShowStatusBar({ isMobile: false, isFullscreen: true })).toBe(true);

    // Mobile: hide when not in fullscreen (native status bar already present)
    expect(shouldShowStatusBar({ isMobile: true, isFullscreen: false })).toBe(false);

    // Mobile: show when in fullscreen (native status bar hidden by browser/OS)
    expect(shouldShowStatusBar({ isMobile: true, isFullscreen: true })).toBe(true);
  });
});
