import { describe, expect, it } from 'vitest';
import { detectDeviceMode } from './deviceMode';

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
});
