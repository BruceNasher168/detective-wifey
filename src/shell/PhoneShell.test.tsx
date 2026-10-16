import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppDefinition } from '../shared/contracts/app-contracts';
import { PhoneShell, type PhoneShellProps } from './PhoneShell';

const noop = () => {};
const app: AppDefinition = {
  appId: 'banking', displayName: 'Banking', icon: () => null, component: () => null,
  themeGradient: '', themeColor: '#ED1C24', bottomBarColor: '#FFFFFF', isLocked: false,
};
const props: PhoneShellProps = {
  deviceMetadata: { narrativeTime: '23:45', batteryPercent: '42%', carrierTag: '', pwaThemeColor: '#ED1C24' },
  activeAppId: 'banking', activeAppDefinition: app, activeUpperApps: [app], activeDockApps: [],
  systemAlertToast: null, demoNotification: { toastId: 'test', sourceAppId: 'banking', senderTitle: '', snippetBody: '' },
  children: <main>App content</main>, overlays: null, renderLevelSelector: () => null,
  onLaunchApp: noop, onReturnHome: noop, onRestartLevel: noop, onOpenNotebook: noop, onNotify: noop,
};

beforeEach(() => {
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
  vi.stubGlobal('navigator', { userAgent: 'Desktop', maxTouchPoints: 0 });
});
afterEach(() => vi.unstubAllGlobals());

describe('app surface and stationary system chrome', () => {
  it('places both bar backgrounds and the app inside one surface, with glyphs outside', () => {
    const html = renderToStaticMarkup(<PhoneShell {...props} />);
    const surface = html.indexOf('data-app-surface');
    const statusBackground = html.indexOf('data-app-status-background');
    const viewport = html.indexOf(' data-app-viewport=');
    const bottomBackground = html.indexOf('data-app-home-background');
    const homeControl = html.indexOf('phone-system-home');
    expect(html.indexOf('phone-system-status')).toBeLessThan(surface);
    expect(statusBackground).toBeGreaterThan(surface);
    expect(viewport).toBeGreaterThan(statusBackground);
    expect(bottomBackground).toBeGreaterThan(viewport);
    expect(homeControl).toBeGreaterThan(bottomBackground);
    expect(html.slice(surface, statusBackground)).toContain('background-color:#ED1C24');
    expect(html.slice(bottomBackground, homeControl)).toContain('background-color:#FFFFFF');
    expect(html.slice(homeControl)).toContain('color:#000000');
    // The app covers a live glass launcher; hiding its entire tree would force
    // glass into a snapshot and change its compositing during app transitions.
    expect(html).toContain('data-launcher-hidden="true"');
    expect(html.match(/class="phone-launcher[^"]*"/)?.[0]).not.toContain('invisible');
  });

  it('keeps the launcher geometry but removes the app surface on Home', () => {
    const html = renderToStaticMarkup(<PhoneShell {...props} activeAppId="home" activeAppDefinition={null} />);
    expect(html).not.toContain('data-app-surface');
    expect(html).toContain('data-launcher-hidden="false"');
    expect(html).toContain('--phone-system-top:59px');
    expect(html).toContain('--phone-system-bottom:calc(34px + env(safe-area-inset-bottom, 0px))');
    expect(html.slice(html.indexOf('phone-system-home'))).toContain('color:#FFFFFF');
  });

  it('uses native iOS safe areas without rendering duplicate system indicators', () => {
    vi.stubGlobal('navigator', { userAgent: 'iPhone', maxTouchPoints: 5 });
    const html = renderToStaticMarkup(<PhoneShell {...props} />);
    expect(html).toContain('--phone-system-top:env(safe-area-inset-top, 0px)');
    expect(html).toContain('--phone-system-bottom:env(safe-area-inset-bottom, 0px)');
    expect(html).toContain('data-app-surface');
    expect(html).not.toContain('phone-system-status');
    expect(html).not.toContain('phone-system-home');
  });

  it('renders phone-system-home with accessible home label on non-iOS', () => {
    const html = renderToStaticMarkup(<PhoneShell {...props} />);
    expect(html).toContain('phone-system-home');
    expect(html).toContain('aria-label="Về trang chủ"');
  });
});
