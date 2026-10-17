/** iPadOS can advertise a desktop Mac user agent. */
export function detectDeviceMode(device: Pick<Navigator, 'userAgent' | 'maxTouchPoints'>): 'ios' | 'default' {
  return /iPad|iPhone|iPod/.test(device.userAgent)
    || (/Macintosh/.test(device.userAgent) && device.maxTouchPoints > 1)
    ? 'ios' : 'default';
}

/** Determines if the current client is a mobile device (iOS, Android, or iPadOS). */
export function isMobileDevice(device: Pick<Navigator, 'userAgent' | 'maxTouchPoints'>): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(device.userAgent)
    || (/Macintosh/.test(device.userAgent) && (device.maxTouchPoints ?? 0) > 1);
}

/** Detects if the current window/document is operating in full screen mode. */
export function detectFullscreen(
  doc: Document | { fullscreenElement?: unknown; webkitFullscreenElement?: unknown; mozFullScreenElement?: unknown; msFullscreenElement?: unknown } | null = typeof document !== 'undefined' ? document : null,
  win: Window | { matchMedia?: (query: string) => { matches: boolean } } | null = typeof window !== 'undefined' ? window : null,
): boolean {
  if (doc) {
    const d = doc as {
      fullscreenElement?: unknown;
      webkitFullscreenElement?: unknown;
      mozFullScreenElement?: unknown;
      msFullscreenElement?: unknown;
    };
    if (d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement) {
      return true;
    }
  }
  if (win && typeof win.matchMedia === 'function') {
    try {
      if (win.matchMedia('(display-mode: fullscreen)').matches) {
        return true;
      }
    } catch {
      // Ignore unsupported query errors in older environments
    }
  }
  return false;
}

/**
 * On mobile, show the in-game status bar ONLY when in fullscreen mode.
 * When not in fullscreen on mobile, the native mobile browser/OS status bar is already visible.
 * On desktop, the virtual status bar is always shown.
 */
export function shouldShowStatusBar({
  isMobile,
  isFullscreen,
}: {
  isMobile: boolean;
  isFullscreen: boolean;
}): boolean {
  return !isMobile || isFullscreen;
}
